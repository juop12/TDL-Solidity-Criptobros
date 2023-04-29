const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const myTokenAddress = ""; // Address of your deployed MyToken contract
  const myToken = await hre.ethers.getContractAt("MyToken", myTokenAddress, deployer);

  const newOwner = ""; // Address of the new owner

  const transferTx = await myToken.transferOwnership(newOwner);

  await transferTx.wait();

  console.log("Ownership transferred to", newOwner);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
