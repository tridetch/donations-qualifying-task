require("@nomiclabs/hardhat-ethers");

const DonationsArtefact = require('./DonationsAbi.json');
const donationsContractAddress = '0x61AbC70576DFf84824511a9632E65E7094abCAB5';

task('withdraw', 'Withdraws specified amound of funds to the address')
  .addParam('address', 'The address to receive funds')
  .addParam('amount', 'The amount of funds to be withdrawed')
  .setAction(async (taskArgs) => {
    console.log(`Withdrawing ${taskArgs.amount} ETH to ${taskArgs.address} ...`);

    const [owner] = await ethers.getSigners();

    const donationsContract = new ethers.Contract(
      donationsContractAddress,
      DonationsArtefact.abi,
      owner
    );

    const result = await donationsContract.withdraw(taskArgs.address, ethers.utils.parseEther(taskArgs.amount));
    result.wait();

    console.log(`Tx hash: ${result.hash}`);

  });
