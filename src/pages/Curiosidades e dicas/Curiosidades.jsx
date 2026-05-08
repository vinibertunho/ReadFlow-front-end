import styles from './Curiosidades.module.css';
import Navbar from '../../components/Navbar/Navbar';

function Curiosidades() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Navbar />
                <div className={styles.headerContent}>
                    <h1>Curiosidades e Dicas</h1>
                    <p>Descubra fatos interessantes sobre a literatura clássica</p>
                </div>
            </header>
            <section className={styles.content}>
                <p>Página em desenvolvimento...</p>
            </section>
        </div>
    );
}

export default Curiosidades;
