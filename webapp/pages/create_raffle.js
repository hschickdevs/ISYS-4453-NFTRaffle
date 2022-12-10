
import { useForm } from "react-hook-form";
import createRaffle from './Web3Client'
import React, {useEffect} from 'react'
import { init, getNFTRaffleFactory, getNFTRaffle, getSelectedAccount } from './Web3Client'
import * as web3Utils from 'web3-utils';

// the selectedAccount variable is not in this file so may need to do that
// need to eithier send this data to web3client or bring stuff over from web3client

export default function Create_Raffle(){
    useEffect(() => {
        init();

    }, []);
    const {register, handleSubmit} = useForm();
    const onSubmit = async (data) => {
        console.log(data)

        // Get the contract instance
        const NFTRaffleFactoryContract = await getNFTRaffleFactory();

        // Attempt to send the transaction with the form data
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="NFT Address" name="NFTaddress" {...register("NFTaddress", {required: true})}/>
            <input type="text" placeholder="NFT Token ID" name="Tokenid" {...register("Tokenid", {required: true})}/>
            <input type="email" placeholder="Email" name="Email" {...register("Email", {required: true})}/>
            <input type="text" placeholder="Ticket Price(In Eth)" name="Ticketprice" {...register("Ticketprice", {required: true})}/>
            <input type="text" placeholder="Duration(In Minutes)" name="Duration" {...register("Duration", {required: true})}/>
            <input type="submit"/>

        </form>


    )
}
// call contract may need to move to web3client if you choose to do the work over there.
export const raffleCreate = () => {
    return createRaffle.methods.createRaffle().call(data.NFTaddress,data.Tokenid,data.Email,data,Ticketprice,data.Duration)
}