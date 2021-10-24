const Web3 = require('web3');
const { abi } = require('./ERC20.json');
const { addresses } = require('./addresses.json');

const INFURA_PROJECTID = 'f8c0238e936a41a4aec431ce4921c6a1';
const NETWORK = 'palm-mainnet';
const CHAIN_ID = '11297108109';
const TOKEN_ADDRESS = '0x5eE074D24f462E0311814C992c99a178458C39fc';
const PRIVATE_KEY = '???';

const amount = 0;

const web3 = new Web3(`https://${NETWORK}.infura.io/v3/${INFURA_PROJECTID}`)

const main = async () => {
  const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
  
  const ERC20 = new web3.eth.Contract(abi, TOKEN_ADDRESS);
  for (const address of addresses) {
    console.log(`sending ${address.split(',')[0]} : ${(Number(address.split(',')[1].toString()) * 1000000000000000000).toLocaleString('fullwide', {useGrouping:false})}`);
    const transaction = ERC20.methods.transfer(`${address.split(',')[0]}`, `${web3.utils.toBN((Number(address.split(',')[1].toString()) * 1000000000000000000).toLocaleString('fullwide', {useGrouping:false}))}`);
    const options = {
      to      : transaction._parent._address,
      data    : transaction.encodeABI(),
      gas     : await transaction.estimateGas({from: account.address}),
      chainId : CHAIN_ID,
      gasPrice: await web3.eth.getGasPrice(),
    };
    const signed  = await web3.eth.accounts.signTransaction(options, PRIVATE_KEY);
    const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
    if (receipt.status) {
      console.log(`SUCCESS: ${address.split(',')[0]}, amount: ${address.split(',')[1]}.`);
    } else {
      console.log(`FAILED: ${address.split(',')[0]}.`);
    }
  }
}

void main();
