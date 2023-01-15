import styles from './styles.module.scss';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

export function SignInButton(){

    const session = false;

    return session ? (
        <button
            type='button'
            className={styles.signInButton}
            onClick={() => {}}
        >
            <img src='https://sujeitoprogramador.com/steve.png' alt='User photo' />
            Hello Daniel
            <FiX color="#737380" className={styles.closeIcon} />
        </button>
    ) : (
        <button
            type='button'
            className={styles.signInButton}
            onClick={() => {}}
        >
            <FaGithub color="#FFB800" />
            Login with Github
        </button>
    )
}