const ethers = require("ethers");

const dbUtils = require("./dbUtils");

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.ankr.com/eth_goerli"
);

async function insertInBlock(blockData) {
  const connection = await dbUtils.getConnection();
  const insertBlockQuery = `INSERT INTO block (blockhash, parenthash, timestamp, process) VALUES (${blockData.blockhash}, ${blockData.parenthash}, ${blockData.timestamp}, 1) `;
  const result = await connection.query(insertBlockQuery);
  console.log("Inserted block data!!");
}

async function insertInTransactions(transactionData) {
  const connection = await dbUtils.getConnection();
  const insertTransactionQuery = "INSERT INTO addresses (address) VALUES ?";
  const result = await connection.query(insertTransactionQuery, [
    addressList.map((item) => [
      item.transactionhash,
      item.fromaddress,
      item.toaddress,
      item.amount,
      item.timestamp,
    ]),
  ]);
  console.log("Inserted transactions data!!");
}

async function getblockData(blockNumber, addressMap) {
  let atleastOneAddressPresent = true;
  const blockWithTransactions = await provider.getBlockWithTransactions(
    blockNumber
  );
  console.log("Calling getBlock for block number:", blockNumber);
  const blockData = {
    blockhash: blockWithTransactions["hash"],
    parenthash: blockWithTransactions["parentHash"],
    timestamp: blockWithTransactions["timestamp"],
  };
  const transactionList = blockWithTransactions["transactions"];
  const transactionData = [];
  for (const transaction of transactionList) {
    const from = transaction["from"];
    const to = transaction["to"];
    const isFromPresent = addressMap.get(from);
    const isToPresent = addressMap.get(to);
    if (isFromPresent || isToPresent) {
      transactionData.push({
        transactionhash: transaction["hash"],
        fromaddress: transaction["from"],
        toaddress: transaction["to"],
        amount: transaction["value"],
        timestamp: transaction["timestamp"],
      });
    }
  }
  if (atleastOneAddressPresent) {
    await insertInBlock(blockData);
    // await insertInTransactions(transactionData);
  }
}

async function getAddresseList() {
  const connection = await dbUtils.getConnection();
  const getAddressQuery = `SELECT address FROM addresses`;
  const [rows] = await connection.execute(getAddressQuery);
  return rows;
}

async function watchBlock() {
  const addressMap = new Map();
  const addressList = await getAddresseList();
  console.log("addressList", addressList);
  for await (const address of addressList) {
    addressMap.set(address, 1);
  }
  provider.on("block", async (data) => {
    console.log("Block Number:",data);
    await getblockData(data, addressMap);
  });
}

module.exports = { watchBlock };
