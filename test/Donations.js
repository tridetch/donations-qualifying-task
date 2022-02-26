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
        await donationsContract.deployed();
    });

    describe('Deployment', function () {
        it('Should set the right owner', async function () {
            expect(await donationsContract.owner()).to.equal(owner.address);
        });
    });

    describe('Transactions', function () {
        const testAmount = ethers.utils.parseEther('0.1');

        it('Should receive funds and add sender address to donators list', async function () {
            await donationsContract.connect(addr1).donate({ value: testAmount });
            await donationsContract.connect(addr1).donate({ value: testAmount });

            const donationSumm = testAmount.add(testAmount);

            const addr1Donation = await donationsContract.donations(addr1.address);
            expect(addr1Donation).to.equal(donationSumm);

            const allDonators = await donationsContract.allDonators();
            console.log(`addrDonation: ${allDonators}`);
            expect(await donationsContract.allDonators()).to.include(addr1.address);
        });

        it('Should withdraws specified amound of funds to the address', async function () {
            await donationsContract.connect(addr1).donate({ value: testAmount });

            let withdrawAmount = ethers.utils.parseEther('0.05');

            const tx = await donationsContract.connect(owner).withdraw(addr2.address, withdrawAmount);
            await expect(() => tx).to.changeEtherBalance(addr2, withdrawAmount);
            await tx.wait();
        });

        it('Should revert if not owner try to withdraw', async function () {
            await expect(donationsContract.connect(addr1).withdraw(addr1.address, testAmount)).to.be.revertedWith('Only owner can withdraw funds.');
        });

        it('Should withdraw entire balance', async function () {
            await donationsContract.connect(addr1).donate({ value: testAmount });
            await donationsContract.connect(addr2).donate({ value: testAmount });

            const donationSumm = ethers.utils.parseEther('0.2');

            const tx = await donationsContract.connect(owner).withdrawAll(addr2.address);
            await expect(() => tx).to.changeEtherBalance(addr2, donationSumm);
            await tx.wait();
        });

        it('Should return addresses of all donators', async function () {
            await donationsContract.connect(addr1).donate({ value: testAmount });
            await donationsContract.connect(addr2).donate({ value: testAmount });

            const allDonators = await donationsContract.allDonators();
            expect(allDonators).to.eql([addr1.address, addr2.address]);
        });

        it('Should return balance', async function () {
            await donationsContract.connect(addr1).donate({ value: testAmount });
            await donationsContract.connect(addr2).donate({ value: testAmount });

            const donationSumm = ethers.utils.parseEther('0.2');

            const balance = await donationsContract.balance();
            expect(await donationsContract.balance()).to.equal(donationSumm);
        });
    });
});