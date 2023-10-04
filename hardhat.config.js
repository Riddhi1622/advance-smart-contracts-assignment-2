require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
// const { ethers } = require("hardhat");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
// module.exports = {
//   solidity: "0.8.4",
//   paths: {
//     artifacts: "./src/artifacts",
//   },
// };


module.exports = {
  solidity: "0.8.4",
  networks: {
    sepolia: {
      url: 'https://sepolia.infura.io/v3/863d3d27e7204792b795dce852fe981e', // Sepolia network URL
      accounts: ['cdc07a7eb3f8055972eef4050f738b8b4b01a0214dda543fda1828346c102719'], // Replace with your wallet's private key
    },
  },
};