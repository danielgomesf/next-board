import { useState, FormEvent } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import styles from './styles.module.scss';
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock, FiX } from 'react-icons/fi';
import { SupportButton } from '@/components/SupportButton';
import { format, formatDistance } from 'date-fns';
import { enUS } from 'date-fns/locale';
 
import firebase from '../../services/firebaseConnection';
import Link from 'next/link';

type TaskList = {
    id: string;
    created: string | Date;
    createdFormated?: string;
    taskDescription: string;
    userId: string;
    name: string;
}

interface BoardProps{
    user: {
        name: string;
        id: string;
        vip: boolean;
        lastDonate: string | Date;
    }
    data: string;
}

export default function Board({ user, data }:BoardProps ){
    const [ input, setInput ] = useState('');
    const [ taskList, setTaskList ] = useState<TaskList[]>(JSON.parse(data));
    const [ taskEdit, setTaskEdit ] = useState<TaskList | null>(null);
    
    async function handleAddTask(e: FormEvent) {
        e.preventDefault();

        if(input === ''){
            alert('Write some task!')
            return;
        }

        if(taskEdit){
            await firebase.firestore().collection('tasks')
                .doc(taskEdit.id)
                .update({
                    taskDescription: input
                })
                .then(() => {
                    let data = taskList;
                    let taskIndex = taskList.findIndex(item => item.id === taskEdit.id);
                    data[taskIndex].taskDescription = input;

                    setTaskList(data);
                    setTaskEdit(null);
                    setInput('');
                })

            return;
        }

        await firebase.firestore().collection('tasks')
            .add({
                created: new Date(),
                taskDescription: input,
                userId: user.id,
                name: user.name
            }) 
            .then((doc: any) => {
                console.log('Cadastrado com sucesso')
                let data = {
                    id: doc.id,
                    created: new Date(),
                    createdFormated: format(new Date(), 'dd MMMM yyyy'),
                    taskDescription: input,
                    userId: user.id,
                    name: user.name
                };

                setTaskList([...taskList, data]);
                setInput('');
        
            })
            .catch((err: Error) => {
                console.log('Erro ao cadastrar', err)
            })
    }

    async function handleDelete(id: string){
        await firebase.firestore().collection('tasks').doc(id)
            .delete()
            .then(() => {
                console.log('Delete successfull')
                let taskDeleted = taskList.filter( item => {
                    return (item.id !== id)
                });

                setTaskList(taskDeleted);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleEditTask(task: TaskList) {
        setInput(task.taskDescription);
        setTaskEdit(task);
    }

    function handleCancelEdit() {
        setInput('');
        setTaskEdit(null);
    }

    return(
        <>
            <Head>
                <title>My tasks - Next Board</title>
            </Head>
            <main className={styles.container}>

                {taskEdit && (
                    <span className={styles.editWarning}>
                        <button onClick={handleCancelEdit}>
                            <FiX size={30} color="#FF3636" /> 
                        </button>
                        You are editing a task!
                    </span>
                )}

                <form onSubmit={handleAddTask}>
                    <input 
                        type="text"
                        placeholder="Write your task..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit">
                        <FiPlus size={25} color="#17181f" />
                    </button>
                </form>

                <h1>You have {taskList.length} {taskList.length === 1 ? 'task' : 'tasks'}</h1>

                <section>
                    {taskList.map( task => (
                        <article  key={task.id} className={styles.taskList}>
                            <Link href={`/board/${task.id}`}>
                                <p>{task.taskDescription}</p>
                            </Link>
                            <div className={styles.actions}>
                                <div>
                                    <div>
                                        <FiCalendar size={20} color="#FFB800" />
                                        <time>{task.createdFormated}</time>
                                    </div>
                                    {user.vip && (
                                        <button onClick={() => handleEditTask(task)}>
                                            <FiEdit2 size={20} color="#FFF" />
                                            <span>Edit</span>
                                        </button> 
                                    )}
                                    
                                </div>
                                <button onClick={ () => handleDelete(task.id)}>
                                    <FiTrash size={20} color="#FF3636" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
            
            {user.vip && (
                <div className={styles.vipContainer}>
                    <h3>Thank you for support this project.</h3>
                    <div>
                        <FiClock size={28} color="#FFF"/>
                        <time>
                            Last donation was {formatDistance(new Date(user.lastDonate), new Date(), { locale: enUS })}
                        </time>
                    </div>
                </div>
            )}

            <SupportButton />
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req });
    if(!session?.id) {
        return{ 
            redirect:{
                destination: '/',
                permanent: false
            }
        }
    }

    const tasks = await firebase.firestore().collection('tasks')
        .where('userId', '==', session?.id)
        .orderBy('created', 'asc').get();

    const data = JSON.stringify(tasks.docs.map( item => {
        return {
            id: item.id,
            createdFormated: format(item.data().created.toDate(), 'dd MMMM yyyy'),
            ...item.data()
        }
    }))

    const user = {
        name: session?.user?.name,
        id: session.id,
        vip: session?.vip,
        lastDonate: session?.lastDonate

    }

    console.log(user);

    return{
        props: {
            user,
            data
        }
    }
}