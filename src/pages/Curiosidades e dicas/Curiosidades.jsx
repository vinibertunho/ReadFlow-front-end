import { useEffect, useState } from 'react';
import  styles from './Curiosidades.module.css';
import Navbar from '../../components/Navbar/Navbar';
import cidadeImg from '../../assets/cidade.png'

const API_URL = 'https://readflow-m8o6.onrender.com/api/curiosidades';

export default function Curiosidades() {
    const [carregando, setCarregando] = useState(true);
    const [dados, setDados] = useState(null);

    useEffect(() => {
        fetch(API_URL)
            .then((resposta) => resposta.json())
            .then((resultado) => {
                setDados(resultado);
                setCarregando(false);
            })

            .catch((erro) => {
                console.error('Erro ao buscar dados:', erro);
                setCarregando(false);
            });
    }, []);

    if (carregando) {
        return <h2 className={styles.loading}>Carregando Curiosidades e dicas...</h2>;
    }

    if (!dados || (Array.isArray(dados) && dados.length === 0)) {
        return <h2 className={styles.loading}>Nenhum dado encontrado.</h2>;
    }

    /*const data = (Array.isArray(dados) ? dados[0] : dados) || {};

    const {
        id,
        livroId,
        titulo,
        texto,
        autorUsuarioId,
        publicado = false,
        criadoEm = '',
        atualizadoEm = '',
        livro = data.livro || {},
        autor = data.autor || {},
    } = data || {}; */

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <section className={styles.sectionTwoColumns}>
                    <div className={styles.heroTextContainer}>
                        <span className={styles.sectionSubtitle}>Exploração Literária</span>
                        <h2 className={styles.sectionTitle}>Curiosidade e Contexto:</h2>

                        <p className={styles.bodyText}></p>
                    </div>

                    <div className={styles.heroImageWrapper}>
                        <img
                            src={cidadeImg}
                            alt="Cenário Real"
                            className={styles.heroImage}
                        />

                        <div className={styles.imageCaption}>
                            <strong>Cenário Real</strong>
                            <span>Salvador, Anos 30</span>
                        </div>
                    </div>
                </section>

                <div className={styles.cardGrid}>
                    <section className={styles.cardCensura}>
                        <div className={styles.censuraText}>
                            <div className={styles.cardTitleContainer}>
                                <span className={styles.cardIcon}>📖</span>
                                <h3 className={styles.cardTitle}>Impacto Social e Censura</h3>
                            </div>
                            <p className={styles.bodyText}></p>
                            <div className={styles.alertBox}>
                                <span className={styles.alertTitle}>FATO HISTÓRICO</span>
                                <p className={styles.alertText}></p>
                            </div>
                        </div>

                        <div className={styles.censuraImageContainer}>
                            <img src="" alt="Ilustração de Censura" />
                        </div>
                    </section>

                    <section className={styles.darkCard}>
                        <div className={styles.cardTitleContainer}>
                            <span className={styles.cardIconWhite}>⚓</span>
                            <h3 className={styles.darkCardTitle}>A Bahia de 1930</h3>
                        </div>
                        <p className={styles.darkcardTitle}></p>
                        <ul className={styles.bulletList}>
                            <li className={styles.bulletItem}>Urbanização precária</li>
                            <li className={styles.bulletItem}>Decadêncua do cacau</li>
                            <li className={styles.bulletItem}>Segregação especial</li>
                        </ul>
                    </section>
                </div>

                <section className={styles.timelineSection}>
                    <h2 className={styles.timelineSubtitle}>Cronologia: O Pai dos Capitães</h2>
                    <p className={styles.timelineSubtitle}>
                        A trajetória de Jorge Amado e a criação de sua obra-prima
                    </p>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineLeft}>
                            <h4 className={styles.timelineTitleText}>Nascimento</h4>
                            <p className={styles.timelineBody}></p>
                        </div>
                        <div className={styles.timelineCenter}>
                            <div className={styles.timelineBadge}>1912</div>
                        </div>
                        <div className={styles.timelineRight}>
                            <div className={styles.timelineCardContent}>
                                <h4 className={styles.timelineTitleText}>A ORIGEM</h4>
                                <p className={styles.timelineBody}></p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.timelineItem}>
                        <div className={styles.timelineLeft}>
                            <h4 className={styles.timelineTitleText}>CAPITÂES DA AREIA</h4>
                            <p className={styles.timelineBody}></p>
                        </div>
                        <div className={styles.timelineCenter}>
                            <div className={styles.timelineBadge}>1937</div>
                        </div>
                        <div className={styles.timelineRight}>
                            <div className={styles.timelineCardContent}>
                                <h4 className={styles.timelineTitleText}>A Obra-Prima</h4>
                                <p className={styles.timelineBody}></p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineLeft}>
                            <h4 className={styles.timelineTitleText}>Academia Brasileira</h4>
                            <p className={styles.timelineBody}></p>
                        </div>
                        <div className={styles.timelineCenter}>
                            <div className={styles.timelineBadge}>1961</div>
                        </div>
                        <div className={styles.timelineRight}>
                            <div className={styles.timelineCardContent}>
                                <p className={styles.timelineBody}></p>
                                <strong className={styles.academyTag}>
                                    ACADEMIA BRASILEIRA DE LETRAS
                                </strong>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.footerSection}>
                    <div className={styles.footerTextContent}>
                        <h2 className={styles.sectionTitle}>Religiosidade e o Candomblé</h2>
                        <p className={styles.bodyText}></p>

                        <div className={styles.tagContainer}>
                            <span className={styles.tag}>Iemanjá</span>
                            <span className={styles.tag}>Ogum</span>
                            <span className={styles.tag}>Resistência Cultural</span>
                            <span className={styles.tag}>Identidade Afro</span>
                        </div>
                    </div>
                    <div className={styles.footerImageContainer}>
                        <img
                            src="https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&w=800&q=80"
                            alt="Mandala / Padrão Afro brasileiro"
                            className={styles.footerImage}
                        />
                    </div>
                </section>
            </div>
        </>
    );
}
