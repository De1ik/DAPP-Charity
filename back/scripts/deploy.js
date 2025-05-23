const hre = require("hardhat");

async function main() {
    const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
    const initialSupply = hre.ethers.utils.parseUnits("1000000", 6);
    const mockUSDT = await MockUSDT.deploy(initialSupply);
    await mockUSDT.deployed();
    console.log("✅MockUSDT deployed to:", mockUSDT.address);

    const [deployer, user1] = await hre.ethers.getSigners();
    console.log("Deployer:", deployer.address);
    console.log("User1:", user1.address);

    const amountToTransfer = hre.ethers.utils.parseUnits("10", 6);
    const tx = await mockUSDT.transfer(user1.address, amountToTransfer);
    await tx.wait();

    const recipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    await mockUSDT.transfer(recipient, amountToTransfer);

    console.log((await mockUSDT.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())
    console.log(`✅Transferred ${hre.ethers.utils.formatUnits(amountToTransfer, 6)} mUSDT to ${user1.address}`);


    const FundraisingBank = await hre.ethers.getContractFactory("FundraisingBank");
    const fundraisingBank = await FundraisingBank.deploy(mockUSDT.address);

    await fundraisingBank.deployed();
    console.log("✅FundraisingBank deployed to:", fundraisingBank.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
