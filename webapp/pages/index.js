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
          Welcome to <a href="">raffle.eth!</a>
        </h1>

        <p className={styles.description}>
          Test the routes:
        </p>

        <div className={styles.grid}>
          <Link href="/create-raffle" className={styles.card}>
            <h2>Create Raffle &rarr;</h2>
            <p>Test the /pages/create-raffle route</p>
          </Link>

          <Link href="/marketplace" className={styles.card}>
            <h2>Raffle Marketplace &rarr;</h2>
            <p>Test the /pages/marketplace route</p>
          </Link>

          <Link href="/raffle" className={styles.card}>
            <h2>Raffle &rarr;</h2>
            <p>Test the /pages/raffle route</p>
          </Link>

        </div>
      </main>

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  )
}
