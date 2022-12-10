
import { useForm } from "react-hook-form";
import createRaffle from './Web3Client'

// the selectedAccount variable is not in this file so may need to do that
// need to eithier send this data to web3client or bring stuff over from web3client

export default function Create_Raffle(){
    const {register, handleSubmit} = useForm();
    const onSubmit = (data) => {
        console.log(data)
        // just do data.NFTaddress to get particular variable for example. may need to assign this data to a variable for it to work in the contract call

        
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