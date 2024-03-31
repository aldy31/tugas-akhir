require('@nomiclabs/hardhat-waffle');
require('dotenv').config();
require('@nomiclabs/hardhat-truffle5');

module.exports = {
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    sepolia : {
      url : process.env.ENDPOINT_URL,
      accounts : [process.env.DEPLOYER_KEY]
    }
  },
  solidity: {
    version: '0.8.11',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey : 'NMPMPURGJF48EYHZBXJIJ854PH7EWUBAFM',
  },
  paths: {
    sources: './src/contracts',
    artifacts: './src/abis',
  },
  mocha: {
    timeout: 40000,
  },

  plugins: ["@nomiclabs/hardhat-truffle"],
}
