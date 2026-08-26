const { ethers } = require("hardhat");

async function main() {
  const [admin, registrar, surveyor, notary, verifier, ownerA] = await ethers.getSigners();
  const Factory = await ethers.getContractFactory("LandRegistry");
  const registry = await Factory.deploy(admin.address);
  await registry.waitForDeployment();

  await (await registry.setRegistrar(registrar.address, true)).wait();
  await (await registry.setSurveyor(surveyor.address, true)).wait();
  await (await registry.setNotary(notary.address, true)).wait();
  await (await registry.setVerifier(verifier.address, true)).wait();

  const documentHash = ethers.keccak256(ethers.toUtf8Bytes("synthetic-property-001-v1"));
  await (await registry.connect(registrar).registerProperty(
    1,
    "P001",
    "Coimbatore Demo Zone",
    2400,
    "Residential",
    ownerA.address,
    documentHash
  )).wait();

  console.log("LandRegistry:", await registry.getAddress());
  console.log("Admin:", admin.address);
  console.log("Registrar:", registrar.address);
  console.log("Surveyor:", surveyor.address);
  console.log("Notary:", notary.address);
  console.log("Verifier:", verifier.address);
  console.log("Owner A:", ownerA.address);
  console.log("Sample Property P001 registered.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
