import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import firebase from "../../services/firebaseConnection";
import { format } from 'date-fns';

import Head from "next/head";
import styles from './task.module.scss';
import { FiCalendar } from 'react-icons/fi';


type Task = {
    id: string;
    created: string | Date;
    createdFormated?: string;
    taskDescription: string;
    userId: string;
    name: string;
}

interface TaskListProps{
    data: string;
}


export default function Task({ data }: TaskListProps){
    const task = JSON.parse(data) as Task;

    return(
        <>
            <Head>
                <title>Details of your task</title>
            </Head>
            <article className={styles.container}>
                <div className={styles.actions}>
                    <div>
                        <FiCalendar size={30} color="#FFF" />
                        <span>Created task:</span>
                        <time>{task.createdFormated}</time>
                    </div>
                </div>
                <p>{task.taskDescription}</p>
            </article>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    //@ts-ignore
    const { id } = params;
    const session = await getSession({ req });

    if(!session?.id){
        return{
            redirect:{
                destination: '/board',
                permanent: false
            } 
        }
    }

    const data = await firebase.firestore().collection('tasks')
        .doc(String(id))
        .get()
        .then((snapshot) => {
            const data = {
                id: snapshot.id,
                created: snapshot.data()?.created,
                createdFormated: format(snapshot.data()?.created.toDate(), 'dd MMMM yyyy'),
                taskDescription: snapshot.data()?.taskDescription,
                userId: snapshot.data()?.userId,
                name: snapshot.data()?.name
            }

            return JSON.stringify(data);
        })

    return{
        props:{
            data
        }
    }
}