import { useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import styles from '../styles/styles.module.scss';

import firebase from '../services/firebaseConnection';
import Image from 'next/image';
import mainImage from '../../public/images/board-user.svg';

type Data = {
  id: string;
  donate: boolean;
  lastDonate: Date;
  image: string;
}

interface HomeProps{
  data: string;
}

export default function Home({ data }: HomeProps) {
  const [ donaters, setDonaters ] = useState<Data[]>(JSON.parse(data));

  return (
    <>
      <Head>
        <title>Next Board</title>
      </Head>
      <main className={styles.contentContainer}>
        <Image src={mainImage} alt='Next Board'/>

        <section className={styles.callToAction}>
          <h1>A tool for your day to day. Write, plan and organize...</h1>
          <p>
            <span>100% Free</span> and online.
          </p>
        </section>

        {donaters.length !==0 && <h3>Supporters:</h3>}
        <div className={styles.donaters}>
          {donaters.map( item => (
            <Image width={65} height={65} key={item.id} src={item.image} alt={item.id} />
          ))}
          
        </div>

      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const donaters = await firebase.firestore().collection('users').get();
  const data = JSON.stringify(donaters.docs.map( item => {
    return{
      id: item.id,
      ...item.data(),
    }
  }))
  
  return {
    props: {
      data
    },
    revalidate: 60 * 60
  }

}
