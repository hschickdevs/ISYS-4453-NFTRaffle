import { useForm } from "react-hook-form";


export default function Join_Raffle(){
    const {register, handleSubmit} = useForm();

    const onSubmit = (data) => {
        console.log(data.Numberoftickets)
        // This is where you would interact with contract and create the raffle just do data.NFTaddress to get variable for example.


    }

    return(
            <div>
                Ticket Price: 
                {/* form to get info for creating a raffle */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" placeholder="Number of Tickets" name="Numberoftickets" {...register("Numberoftickets", { required: true })} />
                    <input type="submit" />

                </form>
            </div>
    )
}