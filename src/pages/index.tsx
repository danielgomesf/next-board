import { GetStaticProps } from 'next';
import Head from 'next/head';
import styles from '../styles/styles.module.scss';

export default function Home() {
  return (
    <>
      <Head>
        <title>Next Board</title>
      </Head>
      <main className={styles.contentContainer}>
        <img src='/images/board-user.svg' alt='Next Board'/>

        <section className={styles.callToAction}>
          <h1>A tool for your day to day. Write, plan and organize...</h1>
          <p>
            <span>100% Free</span> and online.
          </p>
        </section>

        <div className={styles.donaters}>
          <img src='https://sujeitoprogramador.com/steve.png' alt='User 1' />
        </div>

      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  
  return {
    props: {},
    revalidate: 60 * 60
  }

}
