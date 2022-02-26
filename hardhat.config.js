require("@nomiclabs/hardhat-ethers");
require('@nomiclabs/hardhat-waffle');
require('solidity-coverage');
require('dotenv').config();

const DonationsArtefact = require('./tasks/DonationsAbi.json');
const donationsContractAddress = '0x61AbC70576DFf84824511a9632E65E7094abCAB5';

// TODO move task to tasks folder
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

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.12',
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`${process.env.RINKEBY_PRIVATE_KEY}`, `${process.env.RINKEBY_PRIVATE_KEY_ACC_2}`]
    }
  }
};
