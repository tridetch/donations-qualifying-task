require("@nomiclabs/hardhat-ethers");

const DonationsArtefact = require('./DonationsAbi.json');
const donationsContractAddress = '0x61AbC70576DFf84824511a9632E65E7094abCAB5';

task('donate', 'Donate funds')
  .addParam('amount', 'Amount to donate in format 0.1, 1, 1.8 (ETH)')
  .setAction(async (taskArgs) => {
    console.log(`Making donation of ${taskArgs.amount} ETH ...`);

    const [owner, addr2] = await ethers.getSigners();

    const donationsContract = new ethers.Contract(
      donationsContractAddress,
      DonationsArtefact.abi,
      addr2
    );

    const result = await donationsContract.donate({ value: ethers.utils.parseEther(taskArgs.amount) });
    result.wait();

    console.log(`Tx hash: ${result.hash}`);
  });
