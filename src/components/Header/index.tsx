import Link from 'next/link';
import styles from './styles.module.scss';
import { SignInButton } from '../SignInButton';
import Image from 'next/image';
import logo from '../../../public/images/logo.svg';

export function Header(){
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/" >
                    <Image src={logo} alt='Logo Next Board'/> 
                </Link>  
                <nav>
                    <Link href="/" >
                        Home
                    </Link>
                    <Link href="/board" >
                        My Board
                    </Link>
 
                </nav>
                <SignInButton />
                
            </div>
        </header>
    )
}