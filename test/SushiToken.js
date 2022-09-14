const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SushiToken", function () {
  let sushi;
  let owner, alice, bob, carol;
  beforeEach(async () => {
    [owner, alice, bob, carol] = await ethers.getSigners();
    const Sushi = await ethers.getContractFactory("SushiToken");
    sushi = await Sushi.deploy();
  });

  it("should have correct name and symbol and decimal", async () => {
    const name = await sushi.name();
    const symbol = await sushi.symbol();
    const decimals = await sushi.decimals();

    expect(name).to.equal("SushiToken");
    expect(symbol).to.equal("SUSHI");
    expect(decimals).to.equal(18);
  });

  it("should only allow owner to mint token", async () => {
    await sushi.mint(alice.address, "100", { from: owner.address });
    await sushi.mint(bob.address, "1000", { from: owner.address });

    await expect(
      sushi.connect(bob).mint(carol.address, "1000", { from: bob.address })
    ).to.be.revertedWith("Ownable: caller is not the owner");

    const totalSupply = await sushi.totalSupply();
    const aliceBal = await sushi.balanceOf(alice.address);
    const bobBal = await sushi.balanceOf(bob.address);
    const carolBal = await sushi.balanceOf(carol.address);

    expect(totalSupply).to.equal(1100);
    expect(aliceBal).to.equal(100);
    expect(bobBal).to.equal(1000);
    expect(carolBal).to.equal(0);
  });

  it("should supply token transfers properly", async () => {
    await sushi.mint(alice.address, "100", { from: owner.address });
    await sushi.mint(bob.address, "1000", { from: owner.address });

    await sushi
      .connect(alice)
      .transfer(carol.address, "10", { from: alice.address });
    await sushi
      .connect(bob)
      .transfer(carol.address, "100", { from: bob.address });

    const totalSupply = await sushi.totalSupply();
    const aliceBal = await sushi.balanceOf(alice.address);
    const bobBal = await sushi.balanceOf(bob.address);
    const carolBal = await sushi.balanceOf(carol.address);

    expect(totalSupply).to.equal(1100);
    expect(aliceBal).to.equal(90);
    expect(bobBal).to.equal(900);
    expect(carolBal).to.equal(110);
  });

  it("should fail if you try to do bad transfers", async () => {
    await sushi
      .connect(owner)
      .mint(alice.address, "100", { from: owner.address });

    await expect(
      sushi.transfer(carol.address, "110", { from: owner.address })
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

    await expect(
      sushi.connect(bob).transfer(carol.address, "1", { from: bob.address })
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });
});
