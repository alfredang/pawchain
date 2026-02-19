const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PawToken", function () {
  let token, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const PawToken = await ethers.getContractFactory("PawToken");
    token = await PawToken.deploy("PawToken", "PAW", 1000000);
    await token.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should set correct name and symbol", async function () {
      expect(await token.name()).to.equal("PawToken");
      expect(await token.symbol()).to.equal("PAW");
    });

    it("should assign total supply to owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });

    it("should set deployer as owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });
  });

  describe("Transfers", function () {
    it("should transfer tokens", async function () {
      const amount = ethers.parseEther("1000");
      await token.transfer(addr1.address, amount);
      expect(await token.balanceOf(addr1.address)).to.equal(amount);
    });

    it("should fail if insufficient balance", async function () {
      await expect(
        token.connect(addr1).transfer(addr2.address, ethers.parseEther("1"))
      ).to.be.revertedWith("Insufficient balance");
    });
  });

  describe("Minting", function () {
    it("should allow admin to mint", async function () {
      const amount = ethers.parseEther("5000");
      await token.mint(addr1.address, amount);
      expect(await token.balanceOf(addr1.address)).to.equal(amount);
    });

    it("should reject non-admin mint", async function () {
      await expect(
        token.connect(addr1).mint(addr1.address, ethers.parseEther("100"))
      ).to.be.revertedWith("Not admin");
    });
  });

  describe("Burning", function () {
    it("should burn tokens", async function () {
      const burnAmount = ethers.parseEther("1000");
      const supplyBefore = await token.totalSupply();
      await token.burn(burnAmount);
      expect(await token.totalSupply()).to.equal(supplyBefore - burnAmount);
    });
  });

  describe("Treasury", function () {
    it("should deposit to treasury", async function () {
      const amount = ethers.parseEther("10000");
      await token.depositToTreasury(amount);
      expect(await token.treasuryBalance()).to.equal(amount);
    });

    it("should withdraw from treasury", async function () {
      const amount = ethers.parseEther("10000");
      await token.depositToTreasury(amount);
      await token.withdrawFromTreasury(addr1.address, amount);
      expect(await token.balanceOf(addr1.address)).to.equal(amount);
      expect(await token.treasuryBalance()).to.equal(0);
    });
  });

  describe("Pause", function () {
    it("should pause and unpause", async function () {
      await token.setPaused(true);
      await expect(
        token.transfer(addr1.address, ethers.parseEther("100"))
      ).to.be.revertedWith("Contract is paused");

      await token.setPaused(false);
      await token.transfer(addr1.address, ethers.parseEther("100"));
      expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther("100"));
    });
  });

  describe("Transactions", function () {
    it("should record transactions", async function () {
      await token.transfer(addr1.address, ethers.parseEther("100"));
      await token.mint(addr2.address, ethers.parseEther("200"));
      expect(await token.getTransactionCount()).to.equal(2);
    });
  });
});
