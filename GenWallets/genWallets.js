const ethers = require('ethers');
const fs = require('fs');

// Number of wallets to create
const numWallets = 1;

// Save wallet information to file and create HTTP request body
let requestBody = [];
for (let i = 1; i <= numWallets; i++) {
  let wallet = ethers.Wallet.createRandom();
  let body = {
      walletAddress: wallet.address,
      walletKey: wallet.privateKey,
  };
  let data = JSON.stringify(body) + '\n';
  fs.appendFileSync('wallets.txt', data);
  requestBody.push(body);
}

console.log(`${numWallets} wallets created and saved to wallets.txt`);
console.log("HTTP Request Body:");
console.log(JSON.stringify(requestBody, null, 2));
