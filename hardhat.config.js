require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.6.12",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
      forking: {
        url: "https://omniscient-radial-dew.matic-testnet.discover.quiknode.pro/589dde8b81587955e08b391727cabcdfc61f72f0/",
      },
    },
    mainnet: {
      url: "polygon-rpc-node-url",
      chainId: 56,
      gasPrice: 20000000000,
      //accounts: {mnemonic: mnemonic}
    },
  }
};
