const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  const PawToken = await hre.ethers.getContractFactory("PawToken");
  const token = await PawToken.deploy("PawToken", "PAW", 1000000);
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("PawToken deployed to:", address);

  const deploymentInfo = {
    address: address,
    deployer: deployer.address,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
  };

  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "PawToken.sol", "PawToken.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const frontendDir = path.join(__dirname, "..", "frontend", "src", "contracts");
  if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir, { recursive: true });

  fs.writeFileSync(
    path.join(frontendDir, "deployment.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );
  fs.writeFileSync(
    path.join(frontendDir, "PawToken.json"),
    JSON.stringify({ abi: artifact.abi }, null, 2)
  );

  console.log("Frontend artifacts saved to:", frontendDir);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
