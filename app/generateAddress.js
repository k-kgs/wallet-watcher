const { utils } = require("ethers");

function getWalletAddress(walletCount) {
  const addressList = [];
  const mnemonic =
    "brief garment retire casino return try echo dove negative electric siren all";
  const hdNode = utils.HDNode.fromMnemonic(mnemonic);
  for (let i = 0; i < walletCount; i++) {
    const account = hdNode.derivePath(`m/44'/60'/0'/0/${i}`);
    addressList.push(account["address"]);
  }
  return addressList;
}

module.exports = { getWalletAddress };

