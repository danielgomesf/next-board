import styles from './styles.module.scss';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { getSession } from 'next-auth/react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import firebase from '../../services/firebaseConnection';
import Image from 'next/image';
import rocket from '../../../public/images/rocket.svg';

interface DonateProps{
   user: {
    name: string,
    id: string,
    image: string,
   }
}

export default function Donate({ user }: DonateProps){
    const [ vip, setVip ] = useState(false);

    async function handleSaveDonate(){
        await firebase.firestore().collection('users')
            .doc(user.id)
            .set({
                donate: true,
                lastDonate: new Date(),
                image: user.image
            })
            .then(() => {
                setVip(true);
            })
    }


    return(
        <>
            <Head>
                <title>Help the plataform NextBoard stay online!</title>
            </Head>
            <main className={styles.container}>
                <Image src={rocket} alt='Be a donater'  />

                {vip && (
                    <div className={styles.vip}>
                        <Image width={50} height={50} src={user.image} alt='Vip supporter'/>
                        <span>Congratulations, you are a new supporter!</span>
                    </div>
                )}

                <h1>Be a supporter for this project! 🏆</h1>
                <h3>Support with only <span>R$1,00</span></h3>
                <strong>Be on our home, have exclusive functionalities.</strong>

                <PayPalButtons 
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount:{
                                    value: '1'
                                }
                            }]
                        })
                    }}  
                    onApprove={(data, actions) => {
                        return actions.order!.capture().then(function(details){
                            console.log('Compra aprovada:' + details.payer.name?.given_name);
                            handleSaveDonate();
                        })
                    }}
                />

            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req });

    if(!session?.id){
        return{
            redirect:{
                destination: '/',
                permanent: false
            }
        }
    }

    const user = {
        name: session?.user.name,
        id: session?.id,
        image: session?.user.image
    }

    return{
        props:{
            user
        }
    }
}