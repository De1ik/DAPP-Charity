# 🌐 Decentralized Charity Donation Platform

> A trustless, transparent, and DAO-governed crypto donation system — powered by smart contracts, stablecoins, and community verification.

---

## 🎯 Problem

Charitable organizations often suffer from **fraud**, **lack of transparency**, and **inefficient fund distribution**.

According to the [European Anti-Fraud Office](https://ec.europa.eu/olaf-report/2023/index_en.html), over **€1.04 billion** was recommended for recovery in 2023 due to fraudulent activity in the charity sector.

---

## 💡 Solution

This platform ensures **radical transparency** and **community-controlled verification** through:

- 🛠️ **Smart contracts** on the blockchain
- 💸 **Stablecoin donations** (mockUSDT)
- 🧾 **Mandatory public reports**
- 🗳️ **DAO voting to approve or reject fund usage**

---

## 🔁 How It Works

1. **Create a Campaign ("Jar")**  
   Organizers launch a campaign specifying category, goal, and deadline.

2. **Donate in USDT**  
   Supporters send donations in mockUSDT (ERC20), held by the contract.

3. **Submit a Spending Report**  
   After meeting the goal, the organizer submits a report (e.g., IPFS CID with receipts/media).

4. **DAO Validators Vote**  
   Validators review and vote on the report. If approved — funds are released. If rejected — refunds are triggered.

---

## 🔒 Key Features

- ✅ **On-chain transparency**  
  Every donation, vote, and report is recorded on the blockchain.

- ✅ **DAO governance**  
  Validators approve or reject how funds are used.

- ✅ **Stable currency (mockUSDT)**  
  No volatility risks; built using a USDT-like ERC20 token.

- ✅ **Refund mechanism**  
  If a campaign is rejected or expires, donors can reclaim their funds.

- ✅ **Reputation system**  
  DAO validators earn or lose reputation based on their votes.

---

## ⚙️ Tech Stack

- **Smart Contracts:** Solidity, Hardhat
- **Frontend:** React, Ethers.js
- **Blockchain:** Local Hardhat or compatible EVM network
- **Storage (reports):** IPFS (via CID)

---

## 🚀 How to launch a project: 
file path: /backend/app.js

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
const nftContract = new ethers.Contract(process.env.NFT_CONTRACT_ADDRESS, accessNftAbi, signer)

This contract allows the backend to:
Grant or verify NFT ownership for validator access.
Sign or authenticate interactions with smart contracts on behalf of the admin
```bash


Ensure you have:
Node.js ≥ 16.x
Hardhat (installed locally or globally)
.env file with the following variables:
IPFS_EMAIL= 
IPFS_SPACE=
NFT_CONTRACT_ADDRESS=0xf5b0dF3E8B0C1fe305813aFb08E00f9aEB6E127B
PRIVATE_KEY= (your private key, which is used for
RPC_URL= 
ADMIN_ADDRESS=

# 1. Clone the repository
git clone https://github.com/De1ik/DAPP-Charity.git
cd DAPP-Charity/

# 2. Install dependencies
cd frontend/
npm install
cd ../backend/
npm install
cd ..

# 3. Configure environment
# Create .env files in both backend/ and root if needed (see above for values)

# 4. Start local Hardhat blockchain
npx hardhat node

# 5. Deploy smart contracts
npx hardhat run scripts/deploy.js --network localhost

# 6. Start the backend server (IPFS uploader & NFT signer)
cd backend/
node app.js  # or: nodemon app.js

# 7. Launch the frontend
cd ../frontend/
npm run dev

