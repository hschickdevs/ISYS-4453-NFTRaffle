import Web3 from "web3";
import NFTRaffleFactoryABI from '../abi/NFTRaffleFactoryABI.js'
import NFTRaffleABI from '../abi/NFTRaffleABI.js'


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

export const getNFTRaffleFactory = () => {
    return new web3.eth.Contract(NFTRaffleFactoryABI, '0x4c591F25BBD52a44d64CdF4cf586BaEb4D0DfB38');
}
