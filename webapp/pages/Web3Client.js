import Web3 from "web3";


let selectedAccount;
let createRaffle;

export const init = () => {

    const web3 = new Web3("https://polygon-mumbai.g.alchemy.com/v2/tlaVXleVvdYQDrol0PKLp86ee0guNGwi")  
    
    let provider = window.ethereum;
  
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
    // The abi.js file wasn't reading it as json so just put createraffle here manually
    const NFTRaffleABI = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "nftAddress",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "nftTokenID",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "ownerEmail",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "ticketPrice",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "duration",
                    "type": "uint256"
                }
            ],
            "name": "createRaffle",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
    // abi and contract address
    createRaffle = new web3.eth.Contract(
        NFTRaffleABI,
        '0x91F4637Fa345ee75Db56A12d07f9261bd5c82df8'
    );
    // from here I went to create_raffle.js 
}

