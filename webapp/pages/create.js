import styles from '../styles/Home.module.css'
import React, {useEffect, useState} from 'react'
import { init, getNFTRaffleFactory, getNFTRaffle, getERC721, getSelectedAccount } from './Web3Client'
import * as web3Utils from 'web3-utils';

// This page will list deployed raffles the owner has, it also has a button to create a new one.

export default function Create(){
    const [globalRaffles, setGlobalRaffles] = useState([]);

    useEffect(() => {
        init();
    }, []);

    const getRaffleNFTMetadata = async (raffleAddress) => { // (raffleAddress)
        const NFTRaffleContract = await getNFTRaffle(raffleAddress);
        const metadataURL = await NFTRaffleContract.methods.nftTokenURI().call();
        const nftAddress = await NFTRaffleContract.methods.nftAddress().call();
        const nftTokenID = await NFTRaffleContract.methods.nftTokenID().call();
        const ticketPrice = await NFTRaffleContract.methods.ticketPrice().call();
        const state = await NFTRaffleContract.methods.getStateString().call();
        const endTime = await NFTRaffleContract.methods.endTime().call();

        // Fetch token metadata from the IPFS url (tokenURI in the contract)
        const metadata = await fetch(metadataURL).then(response => response.json());
        metadata['nftAddress'] = nftAddress;
        metadata['nftTokenID'] = nftTokenID;
        metadata['ticketPrice'] = ticketPrice;
        metadata['state'] = state;
        metadata['endTime'] = endTime;

        return metadata;
    }

    // Calls the fetchRafflesByOwner function in the NFTRaffleFactory contract
    // Gets the current owned NFTs for the active wallet address on window.ethereum
    const getRafflesByOwner = async (ownerAddress) => {
        try {
            const NFTRaffleFactoryContract = await getNFTRaffleFactory();
            const raffles = await NFTRaffleFactoryContract.methods.fetchRafflesByOwner(ownerAddress).call();

            // Fetch metadata for each raffle (i.e. image, description, name)
            const output = [];
            for (let i = 0; i < raffles.concat().length; i++) {
                const raffleMetadata = await getRaffleNFTMetadata(raffles[i][1]);
                output.push([].concat(
                    raffles[i], 
                    [raffleMetadata['image'], raffleMetadata['description'], raffleMetadata['name'], raffleMetadata['nftAddress'], raffleMetadata['nftTokenID'],
                    raffleMetadata['ticketPrice'], raffleMetadata['state'], raffleMetadata['endTime']]));
            }
            
            // Log output so that Isaiah can view output
            console.log(output);
            /* 
            'raffles' output is a list of nested lists, each nested list is a raffle owned by the current user's wallet:
            
            raffles = [
                [raffleId, raffleAddress, createdAtTimestamp, ownerAddress, ownerEmail, nftImage, nftDescription, nftName, nftAddress, nftTokenID, ticketPrice, state, endTime],
                [raffleId, raffleAddress, createdAtTimestamp, ownerAddress, ownerEmail, nftImage, nftDescription, nftName, nftAddress, nftTokenID, ticketPrice, state, endTime],
            ]
            */
            return output;
        } catch(err) {
            alert('An error occurred: ' + err.message)
        }
    }

    // Used to update the globalRaffles React state variable (uses the current window.ethereum address)
    const updateGlobalRaffles = async () => {
        const output = await getRafflesByOwner(getSelectedAccount());
        setGlobalRaffles(Array.from(output));
    }

    // Function to prompt the user to approve the raffle contract to access the NFT (Must be done before the raffle can be started)
    // approveNFT should not be called if the NFT is already approved, this is a waste of gas
    const checkIfApproved = async (raffleAddress) => {
        try {
            const NFTRaffleContract = await getNFTRaffle(raffleAddress);
            return await NFTRaffleContract.methods.isApproved().call();
        } catch(err) {
            alert('An error occurred: ' + err.message)
        }
    }
    const approveNFT = async (raffleAddress, nftAddress, tokenId) => {
        try {
            if (await checkIfApproved(raffleAddress)) {
                throw new Error('Contract is already approved to access NFT!');
            }
            const ERC721Contract = await getERC721(nftAddress);
            await ERC721Contract.methods.approve(raffleAddress, tokenId).send({from: getSelectedAccount()});
        } catch(err) {
            alert('An error occurred: ' + err.message)
        }
    }

    // Function to prompt user to start the raffle (User transfers NFT to the raffle contract and the raffle is set to Active)
    const startRaffle = async (raffleAddress) => {
        try {
            if (!(await checkIfApproved(raffleAddress))) {
                throw new Error('Contract is not approved to access NFT! Click Approve to approve the contract to access the NFT.');
            }
            const NFTRaffleContract = await getNFTRaffle(raffleAddress);
            await NFTRaffleContract.methods.startRaffle().send({from: getSelectedAccount()});
        } catch(err) {
            alert('An error occurred: ' + err.message)
        }
    }

    // Function to prompt user to cancel the raffle (Only if raffle was started - If no tickets were purchased and the raffle was created by mistake)
    const cancelRaffle = async (raffleAddress) => {
        try {
            const NFTRaffleContract = await getNFTRaffle(raffleAddress);
            await NFTRaffleContract.methods.cancelRaffle().send({from: getSelectedAccount()});
        } catch(err) {
            alert('An error occurred: ' + err.message)
        }
    }

    // Function to prompt user to settle the raffle (if it has ended and tickets were purchased)
    const settleRaffle = async (raffleAddress) => {
        try {
            const NFTRaffleContract = await getNFTRaffle(raffleAddress);
            await NFTRaffleContract.methods.settleRaffle().send({from: getSelectedAccount()});
        } catch(err) {
            alert('An error occurred: ' + err.message)
        }
    }

    const createRaffle = () => {
        window.location="/create-raffle"
      }
    return(
        <div>
            <button className="btn btn-primary m-3" onClick={createRaffle}>Create Raffle</button>
            {/* <button onClick={() => getRafflesByOwner(getSelectedAccount())}>Get Raffles by Owner</button> */}
            {/* <button onClick={() => approveNFT(
                '0xD7bf241c5266E616568a9366EEd7F8F0Cfe35dDa', '0x28510E6c60668858A73fDA70D172a3a1Dbaaf69b', 3)
                }>Test approveNFT</button> */}
                        
            <button className="btn btn-primary m-3" onClick={updateGlobalRaffles}>Refresh My Raffles</button>
            
            {/* Loop through globalRaffles (set when calling updateGlobalRaffles)*/}
            <h2 style={{margin: '20px'}}>Your Raffles</h2>
            <ul>
                {globalRaffles.map((raffle) => (
                    <div style={{width: '500px', border: '5px solid black', padding: '50px', margin: '20px', align: 'center'}} key={`raffle-${raffle[0]}`}>
                        <img width='200' src={raffle[5]} alt="nft_image" id="itemImg"/>
                        <p><b>({raffle[0]}) Raffle at Address:</b> {raffle[1]}</p>
                        <p><b>{raffle[7]}</b></p>
                        <p><em>{raffle[6]}</em></p>
                        <p><b>Ticket Price:</b> {web3Utils.fromWei(raffle[10], 'ether')} ETH</p>
                        <p><b>Current State:</b> {raffle[11]}</p>
                        {raffle[12] > 0
                            ? <p><b>Ends At:</b> {(new Date(raffle[12] * 1000)).toLocaleString()}</p>
                            : <p><b>Ends At:</b> Not Started</p>
                        }
                        <p style={{color: 'blue'}}><a href={`https://testnets.opensea.io/assets/mumbai/${raffle[8]}/${raffle[9]}`}>View on Opensea</a></p>
                        <button onClick={() => approveNFT(raffle[1], raffle[8], raffle[9])}>Approve</button>
                        <button onClick={() => startRaffle(raffle[1])}>Start Raffle</button>
                        <button onClick={() => cancelRaffle(raffle[1])}>Cancel Raffle</button>
                        <button onClick={() => settleRaffle(raffle[1])}>Settle Raffle</button>
                    </div>
                ))}
            </ul>
        </div>
    )
}