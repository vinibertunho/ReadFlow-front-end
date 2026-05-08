import styles from './Vestibular.module.css';
import Navbar from '../../components/Navbar/Navbar';

function Vestibular() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Navbar />
                <div className={styles.headerContent}>
                    <h1>Preparação Vestibular</h1>
                    <p>Prepare-se com conteúdo direcionado para o ENEM e vestibulares</p>
                </div>
            </header>
            <section className={styles.content}>
                <p>Página em desenvolvimento...</p>
            </section>
        </div>
    );
}

export default Vestibular;
