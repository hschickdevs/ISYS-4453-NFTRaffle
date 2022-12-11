import styles from '../styles/Home.module.css'
import React, {useEffect, useState} from 'react'
import { init, getNFTRaffleFactory, getNFTRaffle, getERC721, getSelectedAccount } from './Web3Client'
import * as web3Utils from 'web3-utils';
import Link from 'next/link';

export default function Join(){
    const [rafflesDisplay, setRafflesDisplay] = useState([]);
    const [rafflesDisplayState, setRafflesDisplayState] = useState('Choose Raffles State to View');
    
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
    // @param stateId: 0 = PENDING, 1 = ACTIVE, 2 = SETTLED, 3 = CANCELLED 
    const getRafflesByState = async (stateId) => {
        try {
            const NFTRaffleFactoryContract = await getNFTRaffleFactory();
            const raffles = await NFTRaffleFactoryContract.methods.fetchRafflesByState(stateId).call();

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
           setRafflesDisplay(Array.from(output));
           setRafflesDisplayState({0: "Pending Raffles", 1: "Active Raffles", 2: "Settled Raffles", 3: "Cancelled Raffles"}[stateId]);
        } catch(err) {
            alert('An error occurred: ' + err.message)
        }
    }

    return(
        <div>            
            {/* Yeah this is monkey but we can fix it later with a dropdown*/}
            <button onClick={() => getRafflesByState(0)}>Show Pending Raffles</button>
            <button onClick={() => getRafflesByState(1)}>Show Active Raffles</button>
            <button onClick={() => getRafflesByState(2)}>Show Settled Raffles</button>
            <button onClick={() => getRafflesByState(3)}>Show Cancelled Raffles</button>

            <h2 style={{margin: '20px'}}>{rafflesDisplayState}</h2>
            {rafflesDisplay.map((raffle) => (
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
                        <p style={{color: 'blue'}}>
                            <a href={`https://testnets.opensea.io/assets/mumbai/${raffle[8]}/${raffle[9]}`}>View on Opensea</a>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a href={`https://mumbai.polygonscan.com/address/${raffle[1]}`}>View on Polyscan</a>
                        </p>
                        <button><Link href={`/join-raffle/${raffle[1]}`}>Enter Raffle</Link></button>
                    </div>
                ))}
        </div>
    )
}