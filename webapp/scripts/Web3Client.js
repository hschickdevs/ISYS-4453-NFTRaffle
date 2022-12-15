import Web3 from "web3";
import NFTRaffleFactoryABI from '../abi/NFTRaffleFactoryABI.js'
import NFTRaffleABI from '../abi/NFTRaffleABI.js'
import ERC721ABI from '../abi/ERC721ABI.js'


let selectedAccount;
let web3;
let provider;

export const init = async () => {
    provider = window.ethereum;

    web3 = new Web3(provider);

    if (typeof provider !== 'undefined') {
      //Metamask is installed
      provider.request({method: 'eth_requestAccounts' }).then((accounts) => {
        selectedAccount = accounts[0]
        console.log(`Selected account is ${selectedAccount}`);
      })
      .catch((err) => {
        console.log(err);
      });

      window.ethereum.on('accountsChanged', function (accounts){
        selectedAccount = accounts[0];
        console.log(`Selected account changed to ${selectedAccount}`);
      });

    }
}

export const getSelectedAccount = () => {
    return selectedAccount;
}

export const getNFTRaffle = (raffleAddress) => {
    return new web3.eth.Contract(NFTRaffleABI, raffleAddress);
}

export const getERC721 = (address) => {
  return new web3.eth.Contract(ERC721ABI, address);
}

export const getNFTRaffleFactory = () => {
    // Static address variable is set to currently deployed NFTRaffleFactory contract on Polygon Mumbai Testnet
    return new web3.eth.Contract(NFTRaffleFactoryABI, '0x35184A35303b48825440BEB46fB9A4F561f91498');
}

export const getNativeTokenSymbol = async () => {
    return await web3.eth.getChainId().then((chainId) => {
      switch (chainId) {
        case 80001:
          return 'MATIC';
        default:
          return 'ETH';
      }
    })
}

