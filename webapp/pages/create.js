import styles from '../styles/Home.module.css'



// This page will list deployed raffles the owner has, it also has a button to create a new one.

export default function Create(){
    return(
        <div>
            <button><a href='/create_raffle'>Create Raffle</a></button>
            Your Raffles:
            {/* Figure out later just need cards and a for loop for each one the owner has deployed. */}
        </div>
    )
}