import Navbar from '../../components/Navbar/Navbar';
import styles from './Home.module.css';

function Home() {
    return (
        <>
            <Navbar />
            <main>
                <section className={styles.header}>
                    <div className={styles.criancasCorrendo}>
                        
                    </div>
                </section>
                <section className={styles.destaques}>
                    <div className={styles.apresentacao}>
                        <h3>Apresentação do Projeto</h3>
                        <p>Apresentacao do projeto aqui</p>
                    </div>
                    <div className={styles.cards}>
                        <div className={styles.explorarObra}>
                            <h4>Explorar obra</h4>
                            <p>Acompanhe a narrativa...</p>
                            <p>Ler Análise → </p>
                        </div>
                        <div className={styles.equipe}>
                            <h4>Equipe</h4>
                            <p>Conheça a equipe por trás do projeto...</p>
                            <p>Conhecer → </p>
                        </div>
                        <div className={styles.vestibulandos}>
                            <h4>Vestibulandos</h4>
                            <p>Página dedicada aos vestibulandos...</p>
                            <p>Estudar → </p>
                        </div>
                        <div className={styles.simulados}>
                            <h4>Simulados e Quizes</h4>
                            <p>Uooooou</p>
                            <p>Ver tester → </p>
                        </div>
                        <div className={styles.videoaulas}>
                            <h4>Videoaulas</h4>
                            <p>Assista às videoaulas...</p>
                            <p>Ver Galeria → </p>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Home;
