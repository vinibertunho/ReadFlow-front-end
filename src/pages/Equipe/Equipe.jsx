import { useEffect, useState } from 'react';
import styles from './Equipe.module.css';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';

function Equipe() {
    const [membros, setMembros] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        fetch('...')
            .then((response) => response.json())
            .then(dados => {
                setMembros(dados.resultado);
                setCarregando(false);
            })
            .catch(erro => {
                console.error("Erro ao buscar a equipe:", erro);
                setCarregando(false);
            })
    })

    if (carregando) {
        return <h2 className={styles.loading}>Carregando equipe ...</h2>;
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <section className={styles.hero}>
                    <div className={styles.overlay}>
                        <span className={styles.bagge}>...</span>

                        <h1>Equipe</h1>
                        <p>Composta por alunos do SESI-SENAI</p>
                    </div>
                </section>

                <section className={styles.missao}>
                    <div className={styles.texto}>
                        <h2>Nossa Missao</h2>

                        <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>

                        <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
                    </div>

                    <div className={styles.objetivos}>
                        <h3>Objetivos</h3>
                        <ul>
                            <li>YYYYYYYYYYYYYYYYY</li>
                            <li>YYYYYYYYYYYYYYYYY</li>
                            <li>YYYYYYYYYYYYYYYYY</li>
                            <li>YYYYYYYYYYYYYYYYY</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.equipe}>
                    <h2>Membros da Equipe</h2>

                    <div className={styles.grid}>
                        {membros.map((item, index) => (
                            <div key={index} className={styles.card}>
                                <img src={item.picture.large} alt={item.name.first} />

                                <div className={styles.info}>
                                    <h3>
                                        {item.name.first} {item.name.last}
                                    </h3>

                                    <span>Desenvolvedor(a)</span>

                                    <p>YYYYYYYYYYYY</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}

export default Equipe;
