import styles from '../styles/Home.module.css'
import React, {useEffect, useState} from 'react'
import { init, getNFTRaffleFactory, getNFTRaffle, getERC721, getSelectedAccount, getNativeTokenSymbol } from '../scripts/Web3Client'
import * as web3Utils from 'web3-utils'
import Link from 'next/link'
import Image from 'next/image'


// This page will list deployed raffles the owner has, it also has a button to create a new one.

export default function Create(){
    const [globalRaffles, setGlobalRaffles] = useState([]);
    const [nativeToken, setNativeToken] = useState('');

    var waitForWeb3AndWallet = function (callback) {
        if (typeof window.ethereum !== 'undefined' && typeof window.ethereum.selectedAddress != 'undefined') {
            console.log(`Web3 and Wallet Detected as ${window.ethereum.selectedAddress}!`)
            callback();
        } else {
            var wait_callback = function () {
                waitForWeb3AndWallet(callback);
            };
            setTimeout(wait_callback, 100);
        }
    }

    useEffect(() => {
        init();
        waitForWeb3AndWallet(updateGlobalRaffles);
        getNativeTokenSymbol().then((symbol) => {
            setNativeToken(symbol);
        })
    }, []);

    const getRaffleNFTMetadata = async (raffleAddress) => { // (raffleAddress)
        const NFTRaffleContract = await getNFTRaffle(raffleAddress);
        const metadataURL = await NFTRaffleContract.methods.nftTokenURI().call();
        const nftAddress = await NFTRaffleContract.methods.nftAddress().call();
        const nftTokenID = await NFTRaffleContract.methods.nftTokenID().call();
        const ticketPrice = await NFTRaffleContract.methods.ticketPrice().call();
        const state = await NFTRaffleContract.methods.getStateString().call();
        const endTime = await NFTRaffleContract.methods.endTime().call();
        const winner = await NFTRaffleContract.methods.winner().call();
        const ticketsSold = await NFTRaffleContract.methods.size().call();

        // Fetch token metadata from the IPFS url (tokenURI in the contract)
        const metadata = await fetch(metadataURL).then(response => response.json());
        metadata['nftAddress'] = nftAddress;
        metadata['nftTokenID'] = nftTokenID;
        metadata['ticketPrice'] = ticketPrice;
        metadata['state'] = state;
        metadata['endTime'] = endTime;
        metadata['winner'] = winner;
        metadata['ticketsSold'] = ticketsSold;

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
                    raffleMetadata['ticketPrice'], raffleMetadata['state'], raffleMetadata['endTime'], raffleMetadata['winner'], raffleMetadata['ticketsSold']]));
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
        const output = await getRafflesByOwner(window.ethereum.selectedAddress);
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
    
    const home = () => {
        window.location="/"
    }
    return(
        
        <div>
            
            {/* <button onClick={() => getRafflesByOwner(getSelectedAccount())}>Get Raffles by Owner</button> */}
            {/* <button onClick={() => approveNFT(
                '0xD7bf241c5266E616568a9366EEd7F8F0Cfe35dDa', '0x28510E6c60668858A73fDA70D172a3a1Dbaaf69b', 3)
                }>Test approveNFT</button> */}
                        
            
            
            {/* Loop through globalRaffles (set when calling updateGlobalRaffles)*/}
            <h2 className='white' style={{margin: '20px'}}>Your Raffles 
                <button id="top-buttons" className="btn btn-primary m-3" onClick={home}><i class="bi bi-house"/></button>
                <button id="top-buttons" className="btn btn-primary m-3" onClick={updateGlobalRaffles}><i class="bi bi-arrow-clockwise"></i></button>
                <button id="top-buttons" className="btn btn-primary m-3" onClick={createRaffle}>Create Raffle</button>
            </h2> 
            <ul>
                <div className='card-row'>
                {globalRaffles.map((raffle) => (
                    <div className='column' key={`raffle-${raffle[0]}-col`}>
                        <div className='card' style={{width: '500px', padding: '50px', margin: '20px', align: 'center'}} key={`raffle-${raffle[0]}-card`}>
                            <img className='card-img-top' width='200' src={raffle[5]} alt="nft_image" id="itemImg"/>
                            <br></br>
                            <p className='white'><b className='white'>({raffle[0]}) Raffle at Address:</b> {raffle[1]}</p>
                            <p><b className='white'>{raffle[7]}</b></p>
                            <p><em className='white'>{raffle[6]}</em></p>
                            <p className='white'><b className='white'>Ticket Price:</b> {web3Utils.fromWei(raffle[10], 'ether')} {nativeToken}</p>
                            <p className='white'><b className='white'>Tickets Sold:</b> {raffle[14]}</p>
                            <p className='white'><b className='white'>Current Earnings:</b> {web3Utils.fromWei(String(raffle[14] * raffle[10]), 'ether')} {nativeToken}</p>
                            <p className='white'><b className='white'>Current State:</b> {raffle[11]}</p>
                            {raffle[12] > 0
                                ? <p className='white'><b className='white'>Ends At:</b> {(new Date(raffle[12] * 1000)).toLocaleString()}</p>
                                : <p className='white'><b className='white'>Ends At:</b> Not Started</p>
                            }
                            {/* {show winner} */}
                            {raffle[13] != "0x0000000000000000000000000000000000000000" &&
                                <p className='white'><b className='white'>Winner:</b> {raffle[13]}</p>
                            }
                            <p className='white' style={{color: 'blue'}}><a href={`https://testnets.opensea.io/assets/mumbai/${raffle[8]}/${raffle[9]}`}>View on Opensea</a></p>
                            <button className='btn btn-primary btn-sm' onClick={() => approveNFT(raffle[1], raffle[8], raffle[9])}>Approve</button>
                            <br></br>
                            <button className='btn btn-primary btn-sm' onClick={() => startRaffle(raffle[1])}>Start Raffle</button>
                            <br></br>
                            <button className='btn btn-primary btn-sm' onClick={() => cancelRaffle(raffle[1])}>Cancel Raffle</button>
                            <br></br>
                            <button className='btn btn-primary btn-sm' onClick={() => settleRaffle(raffle[1])}>Settle Raffle</button>
                        </div>
                    </div>

                )
                )}
                </div>
            </ul>
            <style
dangerouslySetInnerHTML={{
  __html:
    "\nbody {\n  background-color: #000;\n}\n.card {\n  background-color: #15172b;\n}\n.white {\n  color: #eee;\n}\n.card-img-top {\n  max-height: 350px;\n  min-height: 150px;\n  object-fit: cover;\n}\n"
}}
/>

<style
    dangerouslySetInnerHTML={{
      __html:
        "\n.card-row {\n  display: flex;\n  \n}\n\n"
    }}
  />
        </div>
    )
}