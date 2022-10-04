const hre = require("hardhat");
const web3 = require("web3");
require("dotenv").config();

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();
  const latestBlock = await hre.ethers.provider.getBlock("latest");

  const pairs = [
    {
      address: "0x59C1F4e0473430A9cd041AA896Be479E5b29ad08",
      rate: "8.554",
      duration: 1209600,
    },
    {
      address: "0x994BD6C0456348D4Af87249Ef691845A36926F23",
      rate: "18.06",
      duration: 518400,
    },
    {
      address: "0xc46957c080e6B142b17d40F7DE19c29e19EF8216",
      rate: "11.225",
      duration: 724600,
    },
  ]; //DAI-MATIC, USDT-MATIC, USDC-MATIC

  // const Yeeld = await hre.ethers.getContractFactory("Yeeld");

  // const yeeld = await Yeeld.deploy();
  // await yeeld.deployed();
  // console.log("Yeeld: ", yeeld.address);

  // const StakingRewardsFactory = await hre.ethers.getContractFactory(
  //   "StakingRewardsFactory"
  // );
  // const stakingRewardsFactory = await StakingRewardsFactory.deploy(
  //   yeeld.address,
  //   latestBlock.timestamp + 145
  // );
  // await stakingRewardsFactory.deployed();
  // console.log("StakingRewardsFactory: ", stakingRewardsFactory.address);

  // await yeeld.transfer(stakingRewardsFactory.address, web3.utils.toWei("1000"));


  const stakingRewardsFactory = await hre.ethers.getContractAt(
    "StakingRewardsFactory",
    "0x3F16d8EC10F2E44dc0cD92ae57d5CAe7cea2333d"
  );

  const deployPromises = pairs.map(async (pair) => {
    setTimeout(async () => {
      await stakingRewardsFactory.deploy(
        pair.address,
        web3.utils.toWei(pair.rate),
        pair.duration
      );
    }, 1000);
  });

  const promise = await Promise.all(deployPromises);
  console.log(promise);

  // setTimeout(async () => {
  //   console.log("Waiting to notifyRewardAmounts");
  //   await stakingRewardsFactory.notifyRewardAmounts();
  // }, 145000);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
