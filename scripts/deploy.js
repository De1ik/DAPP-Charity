const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const CharityDAO = await hre.ethers.getContractFactory("CharityDAO");
    const dao = await CharityDAO.deploy();
    await dao.deployed();

    console.log("✅ CharityDAO deployed to:", dao.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
