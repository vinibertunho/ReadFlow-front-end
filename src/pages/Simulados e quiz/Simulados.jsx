import styles from './Simulados.module.css';
import Navbar from '../../components/Navbar/Navbar';

function Simulados() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Navbar />
                <div className={styles.headerContent}>
                    <h1>Simulados e Quiz</h1>
                    <p>Teste seus conhecimentos com questões interativas</p>
                </div>
            </header>
            <section className={styles.content}>
                <p>Página em desenvolvimento...</p>
            </section>
        </div>
    );
}

export default Simulados;
