import styles from '../styles/Home.module.css'
import React, {useEffect, useState} from 'react'
import { init, getNFTRaffleFactory, getNFTRaffle, getERC721, getSelectedAccount, getNativeTokenSymbol } from '../scripts/Web3Client'
import * as web3Utils from 'web3-utils';
import Link from 'next/link';

export default function Join(){
    const [rafflesDisplay, setRafflesDisplay] = useState([]);
    const [rafflesDisplayState, setRafflesDisplayState] = useState('Active');
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
        waitForWeb3AndWallet(getRafflesByState);
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

        // Fetch token metadata from the IPFS url (tokenURI in the contract)
        const metadata = await fetch(metadataURL).then(response => response.json());
        metadata['nftAddress'] = nftAddress;
        metadata['nftTokenID'] = nftTokenID;
        metadata['ticketPrice'] = ticketPrice;
        metadata['state'] = state;
        metadata['endTime'] = endTime;
        metadata['winner'] = winner;

        return metadata;
    }

    // Calls the fetchRafflesByOwner function in the NFTRaffleFactory contract
    // Gets the current owned NFTs for the active wallet address on window.ethereum
    // @param stateId: 0 = PENDING, 1 = ACTIVE, 2 = SETTLED, 3 = CANCELLED 
    const getRafflesByState = async (stateId = 1) => {
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
                    raffleMetadata['ticketPrice'], raffleMetadata['state'], raffleMetadata['endTime'], raffleMetadata['winner']]));
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
    const home = () => {
        window.location="/"
    }
    return(
        <div>
            <>
  <div className="nav">
  <button id="top-buttons" className="btn btn-primary m-3" onClick={home}><i class="bi bi-house"/></button>
    <br />
  </div>
  <style
  dangerouslySetInnerHTML={{ __html: "\n.nav {\n  padding: 20px;\n}\n" }}
/>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');\n\n\n\n*\n{\n  font-family: poppins;\n  text-decoration: none;\n  user-select: none;\n}\n\n.center\n{\n  padding:10px\n}\n\na\n{\n  color: #eee;\n}\n\n.crumb1 li\n{\n  display: inline-block;\n  padding: 15px;\n  background: #15172b;\n  transform: skew(-20deg);\n  cursor: pointer;\n  opacity: 0.8;\n}\n\n.crumb1 li:hover\n{\n  opacity: 1;\n}\n\n.crumb1 li a\n{\n  display: block;\n  transform: skew(20deg);\n}\n\n\n"
    }}
  />
</>
            <div className="center">
            <div className="btn-group" role="group" aria-label="Basic example">
                <button onClick={() => getRafflesByState(0)} type="button" className="btn btn-secondary">Show Pending Raffles</button>
                <button onClick={() => getRafflesByState(1)} type="button" className="btn btn-secondary">Show Active Raffles</button>
                <button onClick={() => getRafflesByState(2)} type="button" className="btn btn-secondary">Show Settled Raffles</button>
                <button onClick={() => getRafflesByState(3)} type="button" className="btn btn-secondary">Show Cancelled Raffles</button>
            </div>
            </div>
            <style
  dangerouslySetInnerHTML={{
    __html: "\n.center {\n  display: flex;\n  justify-content: center;\n}\n"
  }}
/>

            <h2 className='white' style={{margin: '20px'}}>{rafflesDisplayState}</h2>
            <div className='card-row'>
            {(rafflesDisplay.length == 0 && rafflesDisplayState != 'Choose Raffles State to View') 
              && <p className='white' style={{margin: '20px'}}>There are no raffles to display.</p>}
            {rafflesDisplay.map((raffle) => (
                    <div className='card' style={{width: '500px', padding: '50px', margin: '20px', align: 'center'}} key={`raffle-${raffle[0]}`}>
                        <img className='card-img-top' width='200' src={raffle[5]} alt="nft_image" id="itemImg"/>
                        <p className='white'><b className='white'>({raffle[0]}) Raffle at Address:</b> {raffle[1]}</p>
                        <p><b className='white'>{raffle[7]}</b></p>
                        <p><em className='white'>{raffle[6]}</em></p>
                        <p className='white'><b className='white'>Ticket Price:</b> {web3Utils.fromWei(raffle[10], 'ether')} {nativeToken}</p>
                        <p className='white'><b className='white'>Current State:</b> {raffle[11]}</p>
                        {raffle[12] > 0
                            ? <p className='white'><b className='white'>Ends At:</b> {(new Date(raffle[12] * 1000)).toLocaleString()}</p>
                            : <p className='white'><b className='white'>Ends At:</b> Not Started</p>
                        }
                        {/* {show winner} */}
                        {raffle[13] != "0x0000000000000000000000000000000000000000" &&
                            <p className='white'><b className='white'>Winner:</b> {raffle[13]}</p>
                        }
                        <p style={{color: 'blue'}}>
                            <a className='white' href={`https://testnets.opensea.io/assets/mumbai/${raffle[8]}/${raffle[9]}`}>View on Opensea</a>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a className='white' href={`https://mumbai.polygonscan.com/address/${raffle[1]}`}>View on Polyscan</a>
                        </p>
                        <button className='enter'><Link className='white' href={`/join-raffle/${raffle[1]}`}>Enter Raffle</Link></button>
                    </div>
                ))}
            </div>
<style
  dangerouslySetInnerHTML={{
    __html:
      "\nbody {\n  background-color: #000;\n}\n.card {\n  background-color: #15172b;\n}\n.white {\n  color: #eee;\n}\n.card-img-top {\n  max-height: 300px;\n  min-height: 150px;\n  object-fit: cover;\n}\n.btn {\n  background-color: #15172b;\n  border: none;\n}\n.enter {\n  background-color: #0d6efd;\n  border: none;\n}\n"
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