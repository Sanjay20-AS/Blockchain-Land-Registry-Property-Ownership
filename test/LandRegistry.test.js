const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LandRegistry", function () {
  let registry, admin, registrar, surveyor, notary, verifier, ownerA, buyerB, outsider;
  const docHash = ethers.keccak256(ethers.toUtf8Bytes("document-v1"));
  const deedHash = ethers.keccak256(ethers.toUtf8Bytes("deed-v2"));

  beforeEach(async function () {
    [admin, registrar, surveyor, notary, verifier, ownerA, buyerB, outsider] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("LandRegistry");
    registry = await Factory.deploy(admin.address);
    await registry.waitForDeployment();
    await registry.connect(admin).setRegistrar(registrar.address, true);
    await registry.connect(admin).setSurveyor(surveyor.address, true);
    await registry.connect(admin).setNotary(notary.address, true);
    await registry.connect(admin).setVerifier(verifier.address, true);
  });

  async function register(id = 1) {
    return registry.connect(registrar).registerProperty(
      id, "P00" + id, "Demo Location", 2400, "Residential", ownerA.address, docHash
    );
  }

  it("deploys with the correct admin", async function () {
    expect(await registry.admin()).to.equal(admin.address);
  });

  it("allows the registrar to register a property", async function () {
    await expect(register())
      .to.emit(registry, "PropertyRegistered")
      .withArgs(1, "P001", ownerA.address, docHash);
    const p = await registry.getProperty(1);
    expect(p.currentOwner).to.equal(ownerA.address);
    expect(p.verified).to.equal(false);
  });

  it("rejects duplicate property IDs", async function () {
    await register();
    await expect(register()).to.be.revertedWith("Property already exists");
  });

  it("rejects zero owner and invalid area", async function () {
    await expect(registry.connect(registrar).registerProperty(1, "P001", "X", 10, "Residential", ethers.ZeroAddress, docHash))
      .to.be.revertedWith("Invalid owner");
    await expect(registry.connect(registrar).registerProperty(2, "P002", "X", 0, "Residential", ownerA.address, docHash))
      .to.be.revertedWith("Area must be positive");
  });

  it("blocks unauthorized registration", async function () {
    await expect(registry.connect(outsider).registerProperty(1, "P001", "X", 10, "Residential", ownerA.address, docHash))
      .to.be.revertedWith("Not registrar");
  });

  it("allows an authorized verifier to verify", async function () {
    await register();
    await expect(registry.connect(verifier).verifyProperty(1))
      .to.emit(registry, "PropertyVerified");
    const p = await registry.getProperty(1);
    expect(p.verified).to.equal(true);
    expect(p.status).to.equal(1); // VERIFIED
  });

  it("rejects unauthorized verification", async function () {
    await register();
    await expect(registry.connect(outsider).verifyProperty(1)).to.be.revertedWith("Not verifier");
  });

  it("transfers ownership only after verification", async function () {
    await register();
    await expect(registry.connect(ownerA).transferOwnership(1, buyerB.address, deedHash))
      .to.be.revertedWith("Property not verified");
    await registry.connect(verifier).verifyProperty(1);
    await expect(registry.connect(ownerA).transferOwnership(1, buyerB.address, deedHash))
      .to.emit(registry, "OwnershipTransferred");
    const p = await registry.getProperty(1);
    expect(p.currentOwner).to.equal(buyerB.address);
    expect(p.previousOwner).to.equal(ownerA.address);
  });

  it("rejects transfer by old owner", async function () {
    await register();
    await registry.connect(verifier).verifyProperty(1);
    await registry.connect(ownerA).transferOwnership(1, buyerB.address, deedHash);
    await expect(registry.connect(ownerA).transferOwnership(1, outsider.address, deedHash))
      .to.be.revertedWith("Not property owner");
  });

  it("rejects zero new owner", async function () {
    await register();
    await registry.connect(verifier).verifyProperty(1);
    await expect(registry.connect(ownerA).transferOwnership(1, ethers.ZeroAddress, deedHash))
      .to.be.revertedWith("Invalid new owner");
  });

  it("stores ownership history", async function () {
    await register();
    await registry.connect(verifier).verifyProperty(1);
    await registry.connect(ownerA).transferOwnership(1, buyerB.address, deedHash);
    const history = await registry.getOwnershipHistory(1);
    expect(history.length).to.equal(2);
    expect(history[0].owner).to.equal(ownerA.address);
    expect(history[1].owner).to.equal(buyerB.address);
  });

  it("lists properties for an owner", async function () {
    await register(1);
    await register(2);
    const ids = await registry.getPropertiesByOwner(ownerA.address);
    expect(ids.map(x => Number(x))).to.deep.equal([1, 2]);
  });

  it("supports the multi-step transfer flow", async function () {
    await register();
    await registry.connect(verifier).verifyProperty(1);
    await expect(registry.connect(ownerA).requestTransfer(1)).to.emit(registry, "PropertyStatusUpdated");
    await expect(registry.connect(notary).completeTransfer(1, buyerB.address, deedHash))
      .to.emit(registry, "OwnershipTransferred");
    const p = await registry.getProperty(1);
    expect(p.currentOwner).to.equal(buyerB.address);
    expect(p.status).to.equal(3); // TRANSFERRED
  });

  it("rejects completion by non-notary", async function () {
    await register();
    await registry.connect(verifier).verifyProperty(1);
    await registry.connect(ownerA).requestTransfer(1);
    await expect(registry.connect(outsider).completeTransfer(1, buyerB.address, deedHash))
      .to.be.revertedWith("Not notary");
  });
});
