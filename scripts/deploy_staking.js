const hre = require("hardhat");
const web3 = require("web3");
require("dotenv").config();

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();
  const latestBlock = await hre.ethers.provider.getBlock("latest")

  const weth = await hre.ethers.getContractAt(
    "WETH",
    process.env.WMATIC_MUMBAI
  ); 

  
  const StakingRewardsFactory = await hre.ethers.getContractFactory("StakingRewardsFactory");
  const stakingRewardsFactory = await StakingRewardsFactory.deploy(process.env.REWARDS_TOKEN, latestBlock.timestamp + 1000);
  await stakingRewardsFactory.deployed();
  console.log("StakingRewardsFactory: ", stakingRewardsFactory.address);
  
  const pairAddress = "0x59C1F4e0473430A9cd041AA896Be479E5b29ad08"; //DAI-WMATIC

  const StakingRewards = await hre.ethers.getContractFactory("StakingRewards");
  const stakingRewards = await StakingRewards.deploy(
    stakingRewardsFactory.address,
    process.env.REWARDS_TOKEN,
    pairAddress);
  await stakingRewards.deployed();
  console.log("StakingRewards: ", stakingRewards.address);


  /*const StakingRewardsDualFactory = await hre.ethers.getContractFactory("StakingRewardsDualFactory");
  const stakingRewardsDualFactory = await StakingRewardsDualFactory.deploy();
  await stakingRewardsDualFactory.deployed();
  console.log("StakingRewardsDualFactory: ", stakingRewardsDualFactory.address);*/


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });