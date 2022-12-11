import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { init, getNFTRaffleFactory, getNFTRaffle, getSelectedAccount } from '../../Web3Client'
import * as web3Utils from 'web3-utils';



export default function Join_Raffle() {

    const [raffleData, setRaffleData] = useState(null);

    const router = useRouter();

    const raffleAddress = router.query.address;
    const { register, handleSubmit } = useForm();

    var waitForRouterandWeb3 = function (callback) {
        if (typeof router.query.address !== 'undefined' && typeof window.ethereum !== 'undefined') {
            console.log('Router and Web3 Detected!')
            callback();
        } else {
            var wait_callback = function () {
                waitForRouterandWeb3(callback);
            };
            setTimeout(wait_callback, 100);
        }
    }

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        waitForRouterandWeb3(getRaffleData);
    }, [router.query.address]);

    const getRaffleData = async () => {
        console.log(router.query.address)
        const NFTRaffleContract = await getNFTRaffle(raffleAddress);
        const data = {};

        // Get NFT metadata
        data.NFTaddress = await NFTRaffleContract.methods.nftAddress().call();
        data.NFTtokenID = await NFTRaffleContract.methods.nftTokenID().call();
        const uri = await NFTRaffleContract.methods.nftTokenURI().call();
        const metadata = await fetch(uri).then(response => response.json());
        data.NFTimage = metadata['image'];
        data.NFTname = metadata['name'];
        data.NFTdescription = metadata['description'];

        // Get raffle metadata
        data.owner = await NFTRaffleContract.methods.owner().call();
        data.ownerEmail = await NFTRaffleContract.methods.ownerEmail().call();
        data.ticketPrice = await NFTRaffleContract.methods.ticketPrice().call();
        data.startTime = await NFTRaffleContract.methods.startTime().call();
        data.endTime = await NFTRaffleContract.methods.endTime().call();

        data.state = await NFTRaffleContract.methods.getStateString().call();
        data.totalTickets = await NFTRaffleContract.methods.size().call();
        data.ticketsOwned = await NFTRaffleContract.methods.ticketCounts(getSelectedAccount()).call();

        setRaffleData(data);

        console.log(data);
    }


    const buyTickets = async (data) => {
        // This is where you would interact with contract and create the raffle just do data.NFTaddress to get variable for example.
        // Get the contract instance
        const NFTRaffleContract = await getNFTRaffle(raffleAddress);

        // Require that the owner of the NFT is the contract
        const state = await NFTRaffleContract.methods.getStateString().call();
        if (state != "Active") {
            alert(`This raffle is in the ${state} state.\nTickets can only be purchased for Active raffles.`);
            return;
        }

        // Get the ticket price and
        const ticketPrice = await NFTRaffleContract.methods.ticketPrice().call();
        const totalEntryPrice = ticketPrice * data.Numberoftickets;
        const totalEntryPriceInETH = web3Utils.fromWei(String(ticketPrice * data.Numberoftickets), 'ether');
        console.log(totalEntryPriceInETH, totalEntryPrice);

        // Attempt to send the transaction to deploy new NFTRaffle contract with the form data
        try {
            await NFTRaffleContract.methods.purchaseTickets(
                data.Numberoftickets, data.ContactEmail
            ).send({
                from: getSelectedAccount(),
                value: totalEntryPrice,
            })
            alert(`Successfully purchased ${data.Numberoftickets} tickets for ${totalEntryPriceInETH} ETH!`);
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div>
            <button><Link href="/join">Go Back</Link></button>
            <h2 style={{margin: '20px'}}>View Raffle</h2>
            {raffleData == null
                ? <h2>Please wait for Raffle data to load...</h2>
                : <div style={{ width: '500px', border: '5px solid black', padding: '50px', margin: '20px', align: 'center' }}>
                    <a href={`https://testnets.opensea.io/assets/mumbai/${raffleData.NFTaddress}/${raffleData.NFTtokenID}`} ><img width='200' src={raffleData.NFTimage} alt="nft_image" id="itemImg" /></a>
                    <p><b>{raffleData.NFTname}</b></p>
                    <p><em>{raffleData.NFTdescription}</em></p>
                    <p><b>Ticket Price:</b> {web3Utils.fromWei(String(raffleData.ticketPrice), 'ether')} ETH</p>
                    <p><b>Current State:</b> {raffleData.state}</p>
                    {raffleData.endTime > 0
                        ? <p><b>Ends At:</b> {(new Date(raffleData.endTime * 1000)).toLocaleString()}</p>
                        : <p><b>Ends At:</b> Not Started</p>
                    }
                    <p><b>Owner Contact:</b><br/>{raffleData.ownerEmail}</p>
                    <p><b>Owner Address:</b><br/>{raffleData.owner}</p>
                    {/* <p style={{ color: 'blue' }}><a href={`https://testnets.opensea.io/assets/mumbai/${raffleData.NFTaddress}/${raffleData.NFTtokenID}`}>View on Opensea</a></p> */}
                    {raffleData.state == "Active" &&
                        <div>
                            <p><b>Enter Raffle:</b></p>
                            <form onSubmit={handleSubmit(buyTickets)}>
                                <input type="number" placeholder="Number of Tickets" name="Numberoftickets" {...register("Numberoftickets", { required: true })} />
                                <input type="email" placeholder="Contact Email" name="ContactEmail" {...register("ContactEmail", { required: true })} />
                                <input type="submit" value="Buy Tickets" />
                            </form>
                        </div>
                    }
                    {raffleData.state != "Active" &&
                        <p style={{ color: 'red' }}>Cannot join raffle unless it is currently Active.</p>
                    }
                    
                    {/* <form onSubmit={handleSubmit(buyTickets)}>
                        <input type="number" placeholder="Number of Tickets" name="Numberoftickets" {...register("Numberoftickets", { required: true })} />
                        <input type="email" placeholder="Contact Email" name="ContactEmail" {...register("ContactEmail", { required: true })} />
                        {raffleData.state == "Active"
                            ? <input type="submit" value="Buy Tickets" />
                            : <div>
                                <input disabled type="submit" value="Buy Tickets" />
                                <p style={{ color: 'red' }}>Cannot join raffle unless it is currently Active.</p>
                              </div>

                        }
                    </form> */}
                  </div>
            }
        </div>
    )
}