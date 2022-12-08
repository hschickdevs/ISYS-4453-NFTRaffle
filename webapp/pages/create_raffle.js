
import { useForm } from "react-hook-form";


export default function Create_Raffle(){
    const {register, handleSubmit} = useForm();

    const onSubmit = (data) => {
        console.log(data)
        // This is where you would interact with contract and create the raffle just do data.NFTaddress to get variable for example.

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