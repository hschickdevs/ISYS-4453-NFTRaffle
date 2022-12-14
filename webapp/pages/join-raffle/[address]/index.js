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
        data.winner = await NFTRaffleContract.methods.winner().call();

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
            {raffleData == null
                ?<>
                <div className="progress">
                  <div className="progress-value" />
                </div>
                <style
                  dangerouslySetInnerHTML={{
                    __html:
                      "\nbody {\n  background-color: #000;\n}\n.card {\n  background-color: #15172b;\n}\n.white {\n  color: #eee;\n}\n.card-img-top {\n  max-height: 300px;\n  min-height: 150px;\n  object-fit: cover;\n}\n.btn {\n  background-color: #15172b;\n  border: none;\n}\n.enter {\n  background-color: #0d6efd;\n  border: none;\n}\n.btn-group {\n  margin: 0 auto;\n}\nbody {\n  justify-content: center;\n  align-items: center;\n  background: #000;\n  display: flex;\n  height: 100vh;\n  padding: 0;\n  margin: 0;\n}\n\n.progress {\n  background: rgba(255,255,255,0.1);\n  justify-content: flex-start;\n  border-radius: 100px;\n  align-items: center;\n  position: relative;\n  padding: 0 5px;\n  display: flex;\n  height: 40px;\n  width: 500px;\n}\n\n.progress-value {\n  animation: load .3s normal forwards;\n  box-shadow: 0 10px 40px -10px #fff;\n  border-radius: 100px;\n  background: #fff;\n  height: 30px;\n  width: 0;\n}\n\n@keyframes load {\n  0% { width: 0; }\n  100% { width: 68%; }\n}\n"
                  }}
                />
              </>
                :   <div>
                    <div className='card' style={{ width: '500px', padding: '50px', margin: '20px', align: 'center' }}>
                    <a href={`https://testnets.opensea.io/assets/mumbai/${raffleData.NFTaddress}/${raffleData.NFTtokenID}`} ><img className='card-img-top' width='200' src={raffleData.NFTimage} alt="nft_image" id="itemImg" /></a>
                    <p><b className='white'>{raffleData.NFTname}</b></p>
                    <p><em className='white'>{raffleData.NFTdescription}</em></p>
                    <p className='white'><b className='white'>Ticket Price:</b> {web3Utils.fromWei(String(raffleData.ticketPrice), 'ether')} ETH</p>
                    <p className='white'><b className='white'>Current State:</b> {raffleData.state}</p>
                    {raffleData.endTime > 0
                        ? <p className='white'><b className='white'>Ends At:</b> {(new Date(raffleData.endTime * 1000)).toLocaleString()}</p>
                        : <p className='white'><b className='white'>Ends At:</b> Not Started</p>
                    }
                    <p className='white'><b className='white'>Owner Contact:</b><br/>{raffleData.ownerEmail}</p>
                    <p className='white'><b className='white'>Owner Address:</b><br/>{raffleData.owner}</p>
                    {raffleData.winner != "0x0000000000000000000000000000000000000000" &&
                            <p className='white'><b className='white'>Winner:</b> {raffleData.winner}</p>
                        }
                    {/* <p style={{ color: 'blue' }}><a href={`https://testnets.opensea.io/assets/mumbai/${raffleData.NFTaddress}/${raffleData.NFTtokenID}`}>View on Opensea</a></p> */}
                    {raffleData.state == "Active" &&
                        <div>
                            <p className='white'><b className='white'>Enter Raffle:</b></p>
                            <form onSubmit={handleSubmit(buyTickets)}>
                                <div className='white'>Number of Tickets</div>
                                <input className="input" type="number" placeholder="" name="Numberoftickets" {...register("Numberoftickets", { required: true })} />
                                <div className='white'>Contact Email</div>
                                <input className="input" type="email" placeholder="" name="ContactEmail" {...register("ContactEmail", { required: true })} />
                                <input className="submit" type="submit" value="Buy Tickets" />
                                <button className="submit"><Link className='white' href="/join">Exit</Link></button>
                            </form>
                        </div>
                    }
                    {raffleData.state != "Active" &&
                        <p style={{ color: 'red' }}>Cannot join raffle unless it is currently Active.</p>
                    }
                    <style
  dangerouslySetInnerHTML={{
    __html:
      "\nbody {\n  background-color: #000;\n}\n.card {\n  background-color: #15172b;\n}\n.white {\n  color: #eee;\n}\n.card-img-top {\n  max-height: 300px;\n  min-height: 150px;\n  object-fit: cover;\n}\n.btn {\n  background-color: #15172b;\n  border: none;\n}\n.enter {\n  background-color: #0d6efd;\n  border: none;\n}\n"
  }}
/>
<style
  dangerouslySetInnerHTML={{
    __html:
      "\n  .input-container {\n  height: 50px;\n  position: relative;\n  width: 100%;\n}\n.input {\n  background-color: #303245;\n  border-radius: 12px;\n  border: 0;\n  box-sizing: border-box;\n  color: #eee;\n  font-size: 18px;\n  height: 130%;\n  outline: 0;\n  padding: 4px 20px 0;\n  width: 100%;\n}\n.submit {\n  background-color: #08d;\n  border-radius: 12px;\n  border: 0;\n  box-sizing: border-box;\n  color: #eee;\n  cursor: pointer;\n  font-size: 18px;\n  height: 50px;\n  margin-top: 38px;\n  // outline: 0;\n  text-align: center;\n  width: 100%;\n}\nbody {\n  align-items: center;\n  display: flex;\n  justify-content: center;\n}\n"
  }}
/>

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
                  </div>
            }
        </div>
    )
}