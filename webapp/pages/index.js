import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>raffle.eth</title>
        <meta name="description" content="Raffle off ERC721 NFTs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Raffle.eth!
        </h1>
        <p className={styles.description}>
        </p>

        <div className={styles.grid}>
          <a href="/join" className={styles.card}>
            <h2>Join Raffle &rarr;</h2>
            <p>Join a raffle and purchase tickets!</p>
          </a>

          <a href="/create" className={styles.card}>
            <h2>Create Raffle &rarr;</h2>
            <p>Create an NFT raffle and manage your raffles</p>
          </a>
        </div>
      </main>
    </div>
  )
}
