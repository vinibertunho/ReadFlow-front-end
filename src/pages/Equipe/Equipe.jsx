import styles from './Equipe.module.css';
import Navbar from '../../components/Navbar/Navbar';

function Equipe() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Navbar />
                <div className={styles.headerContent}>
                    <h1>Nossa Equipe</h1>
                    <p>Conheça os criadores do ReadFlow</p>
                </div>
            </header>
            <section className={styles.content}>
                <p>Página em desenvolvimento...</p>
            </section>
        </div>
    );
}

export default Equipe;
