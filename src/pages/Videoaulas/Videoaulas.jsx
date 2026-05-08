import styles from './Videoaulas.module.css';
import Navbar from '../../components/Navbar/Navbar';

function Videoaulas() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Navbar />
                <div className={styles.headerContent}>
                    <h1>Videoaulas</h1>
                    <p>Aprenda com vídeos educativos sobre as obras</p>
                </div>
            </header>
            <section className={styles.content}>
                <p>Página em desenvolvimento...</p>
            </section>
        </div>
    );
}

export default Videoaulas;
