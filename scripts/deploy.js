const { ethers } = require("hardhat");

const deployedContractAddress = "0x61AbC70576DFf84824511a9632E65E7094abCAB5";

async function main() {
    const [owner] = await ethers.getSigners();
    console.log(`Deploy contract with the account: ${owner.address}`);

    const DonationsFactory = await ethers.getContractFactory('Donations');
    const donationsContract = await DonationsFactory.deploy();

    console.log(`Contract deployed! Donations contract address: ${donationsContract.address}`); 
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });