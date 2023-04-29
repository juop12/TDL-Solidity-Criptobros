const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Contract = await hre.ethers.getContractFactory("ERC1155");
  const contract = await Contract.deploy("https://ipfs.io/ipfs/QmP9WNgUdSSsA9XRzRzNfbUTzHph5UjhLGwHRToSUZ1gWW/");

  await contract.deployed();

  fs.writeFileSync("contract-address.txt", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
