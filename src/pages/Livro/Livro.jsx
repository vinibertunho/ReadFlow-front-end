import { useParams } from 'react-router-dom';
import styles from './Livro.module.css';
import Navbar from '../../components/Navbar/Navbar';

function Livro() {
    const { id } = useParams();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Navbar />
                <div className={styles.headerContent}>
                    <h1>Detalhes do Livro</h1>
                    <p>Explorando a obra #{id}</p>
                </div>
            </header>
            <section className={styles.content}>
                <p>Página em desenvolvimento...</p>
            </section>
        </div>
    );
}

export default Livro;
