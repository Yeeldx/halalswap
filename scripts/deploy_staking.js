const hre = require("hardhat");
const web3 = require("web3");
require("dotenv").config();

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();
  const latestBlock = await hre.ethers.provider.getBlock("latest");

  const pairAddresses = [
    "0x59C1F4e0473430A9cd041AA896Be479E5b29ad08",
    "0x994BD6C0456348D4Af87249Ef691845A36926F23",
    "0xc46957c080e6B142b17d40F7DE19c29e19EF8216",
  ]; //DAI-MATIC, USDT-MATIC, USDC-MATIC

  /*const StakingRewardsFactory = await hre.ethers.getContractFactory(
    "StakingRewardsFactory"
  );
  const stakingRewardsFactory = await StakingRewardsFactory.deploy(
    process.env.REWARDS_TOKEN,
    latestBlock.timestamp + 1000
  );
  await stakingRewardsFactory.deployed();
  console.log("StakingRewardsFactory: ", stakingRewardsFactory.address);*/

  const stakingRewardsFactory = await hre.ethers.getContractAt(
    "StakingRewardsFactory",
    process.env.REWARD_FACTORY
  );

  //const StakingRewardsDualFactory = await hre.ethers.getContractFactory("StakingRewardsDualFactory");

  const StakingRewards = await hre.ethers.getContractFactory("StakingRewards");
  console.log("Deploying Farm for : ", pairAddresses[2]);

  await deployRewardContract(
    stakingRewardsFactory.address,
    StakingRewards,
    pairAddresses[2]
  );

  /*const stakingRewardsDualFactory = await StakingRewardsDualFactory.deploy();
  await stakingRewardsDualFactory.deployed();
  console.log("StakingRewardsDualFactory: ", stakingRewardsDualFactory.address);*/
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function deployRewardContract(
  rewardFactoryAddress,
  rewardContractInstance,
  pairAddress
) {
  const stakingRewards = await rewardContractInstance.deploy(
    rewardFactoryAddress,
    process.env.REWARDS_TOKEN,
    pairAddress
  );
  await stakingRewards.deployed();
  console.log("StakingRewards: ", stakingRewards.address);
}
