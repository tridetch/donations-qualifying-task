const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');

describe('Donations contract', function () {

    let DonationsFactory;
    let donationsContract;

    let owner;
    let addr1;
    let addr2;
    let addr3;

    beforeEach(async function () {
        DonationsFactory = await ethers.getContractFactory('Donations');
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        donationsContract = await DonationsFactory.deploy();
    });

    describe('Deployment', function () {
        it('Should set the right owner', async function () {
            expect(await donationsContract.owner()).to.equal(owner.address);
        });
    });

    describe('Transactions', function () {
        it('Should receive funds and add sender address to donators list', async function () {
            const amount = ethers.utils.parseEther('0.1');
            await donationsContract.connect(addr1).donate({ value: amount });

            const addr1Donation = await donationsContract.donations(addr1.address);
            expect(addr1Donation).to.equal(amount);

            const allDonators = await donationsContract.allDonators();
            console.log(`addrDonation: ${allDonators}`);
            expect(await donationsContract.allDonators()).to.include(addr1.address);
        });
    });
});