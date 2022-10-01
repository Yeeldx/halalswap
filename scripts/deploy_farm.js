const hre = require("hardhat");
const web3 = require("web3");
require("dotenv").config();

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();

  const weth = await hre.ethers.getContractAt(
    "WETH",
    process.env.WMATIC_MUMBAI
  ); 
  const DragonLair = await hre.ethers.getContractFactory("DragonLair");
  const Quick = await hre.ethers.getContractFactory("Quick");

  const quick = await Quick.deploy(process.env.GATEWAY_ADDRESS);
  await quick.deployed();
  console.log("Quick: ", quick.address);

  const dragonLair = await DragonLair.deploy(quick.address);
  await dragonLair.deployed();
  console.log("DragonLair: ", dragonLair.address);

}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });