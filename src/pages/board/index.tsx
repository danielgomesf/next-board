import Head from 'next/head';
import styles from './styles.module.scss';
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock } from 'react-icons/fi';
import { SupportButton } from '@/components/SupportButton';

export default function Board(){
    return(
        <>
            <Head>
                <title>My tasks - Next Board</title>
            </Head>
            <main className={styles.container}>
                <form>
                    <input 
                        type="text"
                        placeholder="Write your task..."
                    />
                    <button type="submit">
                        <FiPlus size={25} color="#17181f" />
                    </button>
                </form>

                <h1>You have 2 tasks</h1>

                <section>
                    <article className={styles.taskList}>
                        <p>Learn to code on Next.JS</p>
                        <div className={styles.actions}>
                            <div>
                                <div>
                                    <FiCalendar size={20} color="#FFB800" />
                                    <time>15 Janeiro 2023</time>
                                </div>
                                <button>
                                    <FiEdit2 size={20} color="#FFF" />
                                    <span>Edit</span>
                                </button>
                            </div>
                            <button>
                                <FiTrash size={20} color="#FF3636" />
                                <span>Delete</span>
                            </button>
                        </div>
                    </article>
                </section>
            </main>

            <div className={styles.vipContainer}>
                <h3>Thank you for support this project.</h3>
                <div>
                    <FiClock size={28} color="#FFF"/>
                    <time>
                        Last donation was 3 days ago.
                    </time>
                </div>
            </div>

            <SupportButton />
        </>
    )
}