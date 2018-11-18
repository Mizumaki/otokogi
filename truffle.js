var HDWalletProvider = require("truffle-hdwallet-provider");
var privateKey = process.env.KEY;
var infuraApiKey = process.env.INFURA;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    mainnet: {
      provider: function () {
        return new HDWalletProvider(
          privateKey,
          "https://mainnet.infura.io/v3/" + infuraApiKey
        );
      },
      network_id: 1,
      gas: 2000000,
      gasPrice: 8000000000 // 8 Gwei
    }
  }
};