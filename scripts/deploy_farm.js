const hre = require("hardhat");
const web3 = require("web3");
require("dotenv").config();

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();

  const Yeeld = await hre.ethers.getContractFactory("Yeeld");
  const YeeldGovernor = await hre.ethers.getContractFactory("YeeldGovernor");

  const yeeld = await Yeeld.deploy(process.env.GATEWAY_ADDRESS);
  await yeeld.deployed();
  console.log("Yeeld: ", yeeld.address);

  const yeeldGovernor = await YeeldGovernor.deploy(yeeld.address);
  await yeeldGovernor.deployed();
  console.log("YeeldGovernor: ", yeeldGovernor.address);

}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });