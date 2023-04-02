const dbUtils = require("./dbUtils");
const generateAddress = require("./generateAddress");

async function runInitailSetup() {
  const connection = await dbUtils.getConnection();

  const addressList = generateAddress.getWalletAddress(100);
  
  // create tables
  const addressQuery = "CREATE TABLE addresses (address VARCHAR(255))";
  const addressQueryResult = await connection.execute(addressQuery);
  console.log("Table: addresses created");

  const blockQuery =
    "CREATE TABLE block (id INT AUTO_INCREMENT PRIMARY KEY, blockhash VARCHAR(255), parenthash VARCHAR(255), timestamp INT, process INT)";
  const blockQueryResult = await connection.execute(blockQuery);
  console.log("Table: block created");

  const transactionQuery =
    "CREATE TABLE transactions (id INT AUTO_INCREMENT PRIMARY KEY, transactionhash VARCHAR(255), fromaddress VARCHAR(255), toaddres VARCHAR(255), amount BIGINT, timestamp INT)";
  const transactionQueryResult = await connection.execute(transactionQuery);
  console.log("Table: transactions created");

  // insert addresses
  const insertWalletQuery = "INSERT INTO addresses (address) VALUES ?";
  const insertWalletQueryResult = await connection.query(
    insertWalletQuery,
    [addressList.map((item) => [item])],
    true
  );
  console.log("Inserted addresses");
}
module.exports = { runInitailSetup };
