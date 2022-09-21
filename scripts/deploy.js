// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const web3 = require("web3");
require("dotenv").config();

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();

  const weth = await hre.ethers.getContractAt(
    "WETH",
    process.env.WMATIC_MUMBAI
  ); //await hre.ethers.getContractFactory("WETH");
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const YeeldxToken = await hre.ethers.getContractFactory("YeeldxToken");
  const MasterChef = await hre.ethers.getContractFactory("MasterChef");
  const YeeldxBar = await hre.ethers.getContractFactory("YeeldxBar");
  const YeeldxMaker = await hre.ethers.getContractFactory("YeeldxMaker");
  const Migrator = await hre.ethers.getContractFactory("Migrator");
  const Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const Router = await hre.ethers.getContractFactory("UniswapV2Router02");

  // const weth = await WETH.deploy();
  // await weth.deployed();

  const tokenA = await MockERC20.deploy(
    "Token A",
    "TKA",
    web3.utils.toWei("1000")
  );
  await tokenA.deployed();
  console.log("TokenA: ", tokenA.address);

  const tokenB = await MockERC20.deploy(
    "Token B",
    "TKB",
    web3.utils.toWei("1000")
  );
  await tokenB.deployed();
  console.log("TokenB: ", tokenB.address);

  const factory = await Factory.deploy(owner.address);
  await factory.deployed();
  console.log("Factory: ", factory.address);
  console.log("pairCodeHash: ", await factory.pairCodeHash());

  await factory.createPair(weth.address, tokenA.address);
  await factory.createPair(weth.address, tokenB.address);

  const router = await Router.deploy(factory.address, weth.address);
  await router.deployed();
  console.log("Router: ", router.address);

  const yeeldxToken = await YeeldxToken.deploy();
  await yeeldxToken.deployed();
  console.log("YeeldxToken: ", yeeldxToken.address);

  const masterChef = await MasterChef.deploy(
    yeeldxToken.address,
    owner.address,
    web3.utils.toWei("100"),
    1,
    1
  );
  await masterChef.deployed();
  console.log("MasterChef: ", masterChef.address);

  await yeeldxToken.transferOwnership(masterChef.address);

  const yeeldxBar = await YeeldxBar.deploy(yeeldxToken.address);
  await yeeldxBar.deployed();
  console.log("YeeldxBar: ", yeeldxBar.address);

  const yeeldxMaker = await YeeldxMaker.deploy(
    factory.address,
    yeeldxBar.address,
    yeeldxToken.address,
    weth.address
  );
  await yeeldxMaker.deployed();
  console.log('YeeldxMaker: ', yeeldxMaker.address);

  await factory.setFeeTo(yeeldxMaker.address);

  const migrator = await Migrator.deploy(
    masterChef.address,
    "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    factory.address,
    1
  );

  await migrator.deployed();
  console.log('Migrator: ', migrator.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
