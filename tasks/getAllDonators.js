require("@nomiclabs/hardhat-ethers");

const DonationsArtefact = require('./DonationsAbi.json');
const donationsContractAddress = '0x61AbC70576DFf84824511a9632E65E7094abCAB5';

task('getAllDonators', 'Return all addresses that make donations')
  .setAction(async (taskArgs) => {
    console.log(`Fetching donators list ...`);

    const [owner] = await ethers.getSigners();

    const donationsContract = new ethers.Contract(
      donationsContractAddress,
      DonationsArtefact.abi,
      owner
    );

    const result = await donationsContract.allDonators();
    console.log(`Donators:`, result);

  });