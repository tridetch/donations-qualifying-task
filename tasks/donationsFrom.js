require("@nomiclabs/hardhat-ethers");

const DonationsArtefact = require('./DonationsAbi.json');
const donationsContractAddress = '0x61AbC70576DFf84824511a9632E65E7094abCAB5';

task('donationsFrom', 'Return totam amount of donations from specified address')
  .addParam('address', 'Address of donator')
  .setAction(async (taskArgs) => {
    console.log(`Fetching donation amount for ${taskArgs.address} ...`);

    const [owner] = await ethers.getSigners();

    const donationsContract = new ethers.Contract(
      donationsContractAddress,
      DonationsArtefact.abi,
      owner
    );


    const result = await donationsContract.donations(taskArgs.address);
    console.log(`Amount of donations:`, result);
  });
