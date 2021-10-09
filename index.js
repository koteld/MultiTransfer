const Web3 = require('web3');
const { abi } = require('./ERC20.json');
const { addresses } = require('./addresses.json');

const INFURA_PROJECTID = '';
const NETWORK = '';
const CHAIN_ID = '';
const TOKEN_ADDRESS = '';
const PRIVATE_KEY = '';

const amount = 0;

const web3 = new Web3(`https://${NETWORK}.infura.io/v3/${INFURA_PROJECTID}`)

const main = async () => {
  const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
  
  const ERC20 = new web3.eth.Contract(abi, TOKEN_ADDRESS);
  for (const address of addresses) {
    const transaction = ERC20.methods.transfer(`${address}`, `${web3.utils.toBN(amount)}`);
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
      console.log(`SUCCESS: ${address}, amount: ${amount}.`);
    } else {
      console.log(`FAILED: ${address}.`);
    }
  }
}

void main();
