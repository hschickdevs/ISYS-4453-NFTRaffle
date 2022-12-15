
import { useForm } from "react-hook-form";
import React, {useEffect, useState} from 'react'
import { init, getNFTRaffleFactory, getNFTRaffle, getSelectedAccount, getNativeTokenSymbol } from './Web3Client'
import * as web3Utils from 'web3-utils'
import Link from 'next/link'

// the selectedAccount variable is not in this file so may need to do that
// need to eithier send this data to web3client or bring stuff over from web3client

export default function Create_Raffle(){
    const [nativeToken, setNativeToken] = useState('...');

    const waitForWeb3AndWallet = function (callback) {
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
        waitForWeb3AndWallet(console.log);
        getNativeTokenSymbol().then((symbol) => {
            setNativeToken(symbol);
        });
    }, []);

    const {register, handleSubmit} = useForm();
    const onSubmit = async (data) => {
        console.log(data)

        // Get the contract instance
        const NFTRaffleFactoryContract = await getNFTRaffleFactory();

        // Attempt to send the transaction to deploy new NFTRaffle contract with the form data
        try {
            const raffleAddress = await NFTRaffleFactoryContract.methods.createRaffle(
                data.NFTaddress,
                data.Tokenid,
                data.Email,
                web3Utils.toWei(data.Ticketprice, 'ether'),
                Number(data.Duration) * 60,
            ).send({
                from: getSelectedAccount(),
            })
            console.log(raffleAddress);  // The address of the newly created raffle
        } catch(err) {
            alert(err.message);
        }
    }
    
    return(
        // form to get info for creating a raffle
    <div>

        <form onSubmit={handleSubmit(onSubmit)}>

        <div className="form">
        <div className="title">Create Raffle</div>
        <div className="subtitle">Raffle will not show up in your raffle listings until transaction has been confirmed.</div>
            <div className="input-container ic1">
            <div className="subtitle">NFT Address</div>
                <input id="firstname" className="input" type="text" name="NFTaddress" {...register("NFTaddress", {required: true})} placeholder="" />
            </div>
            <div className="input-container ic2">
                <div className="subtitle">NFT Token ID</div>
                <input id="lastname" className="input" type="text" name="Tokenid" {...register("Tokenid", {required: true})} placeholder=" " />
            </div>
            <div className="input-container ic2">
                <div className="subtitle">Email</div>
                <input id="email" className="input" type="email" aria-describedby="emailHelp" name="Email" {...register("Email", {required: true})} placeholder=" " />
            </div>
            <div className="input-container ic2">
                <div className="subtitle">Ticket Price(In {nativeToken})</div>
                <input id="email" className="input" type="text" name="Ticketprice" {...register("Ticketprice", {required: true})} placeholder="" />
            </div>
            <div className="input-container ic2">
                <div className="subtitle">Duration(In Minutes)</div>
                <input id="email" className="input" type="text" name="Duration" {...register("Duration", {required: true})} placeholder=" " />
            </div>
            <button type="text" className="submit">
                Submit
            </button>
            <button className="submit"><Link className='subtitle' href="/create">Exit</Link></button>
        </div>
        <style
        dangerouslySetInnerHTML={{
            __html:
            "\n      body {\n  align-items: center;\n  background-color: #000;\n  display: flex;\n  justify-content: center;\n  height: 100vh;\n}\n\n.form {\n  background-color: #15172b;\n  border-radius: 20px;\n  box-sizing: border-box;\n  height: 775px;\n  padding: 20px;\n  width: 500px;\n}\n\n.title {\n  color: #eee;\n  font-family: sans-serif;\n  font-size: 36px;\n  font-weight: 600;\n  margin-top: 30px;\n}\n\n.subtitle {\n  color: #eee;\n  font-family: sans-serif;\n  font-size: 16px;\n  font-weight: 600;\n  margin-top: 10px;\n}\n\n.input-container {\n  height: 50px;\n  position: relative;\n  width: 100%;\n}\n\n.ic1 {\n  margin-top: 40px;\n}\n\n.ic2 {\n  margin-top: 30px;\n}\n\n.input {\n  background-color: #303245;\n  border-radius: 12px;\n  border: 0;\n  box-sizing: border-box;\n  color: #eee;\n  font-size: 18px;\n  height: 100%;\n  outline: 0;\n  padding: 4px 20px 0;\n  width: 100%;\n}\n\n.cut {\n  background-color: #15172b;\n  border-radius: 10px;\n  height: 20px;\n  left: 20px;\n  position: absolute;\n  top: -20px;\n  transform: translateY(0);\n  transition: transform 200ms;\n  width: 76px;\n}\n\n.cut-short {\n  width: 50px;\n}\n\n.input:focus ~ .cut,\n.input:not(:placeholder-shown) ~ .cut {\n  transform: translateY(8px);\n}\n\n.placeholder {\n  color: #65657b;\n  font-family: sans-serif;\n  left: 20px;\n  line-height: 14px;\n  pointer-events: none;\n  position: absolute;\n  transform-origin: 0 50%;\n  transition: transform 200ms, color 200ms;\n  top: 20px;\n}\n\n.input:focus ~ .placeholder,\n.input:not(:placeholder-shown) ~ .placeholder {\n  transform: translateY(-30px) translateX(10px) scale(0.75);\n}\n\n.input:not(:placeholder-shown) ~ .placeholder {\n  color: #808097;\n}\n\n.input:focus ~ .placeholder {\n  color: #dc2f55;\n}\n\n.submit {\n  background-color: #08d;\n  border-radius: 12px;\n  border: 0;\n  box-sizing: border-box;\n  color: #eee;\n  cursor: pointer;\n  font-size: 18px;\n  height: 50px;\n  margin-top: 38px;\n  // outline: 0;\n  text-align: center;\n  width: 100%;\n}\n\n.submit:active {\n  background-color: #06b;\n}\n\n    "
        }}
        />
        </form>
    </div>


    )
}
// call contract may need to move to web3client if you choose to do the work over there.
export const raffleCreate = () => {
    return createRaffle.methods.createRaffle().call(data.NFTaddress,data.Tokenid,data.Email,data,Ticketprice,data.Duration)
}