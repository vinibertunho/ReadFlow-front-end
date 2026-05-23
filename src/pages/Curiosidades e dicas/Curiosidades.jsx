import { useEffect, useState } from 'react';
import  styles from './Curiosidades.module.css';
import Navbar from '../../components/Navbar/Navbar';
import cidadeImg from '../../assets/cidade.png';
import capitaesImg from '../../assets/capitaes.jpg';
import downloadImg from '../../assets/download.jpg'

const URL_API = 'https://readflow-m8o6.onrender.com/api/curiosidades';

export default function Curiosidades() {
    const [carregando, setCarregando] = useState(true);
    const [dados, setDados] = useState(null);

    useEffect(() => {
        fetch(URL_API)
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

    const data = (Array.isArray(dados) ? dados[0] : dados) || {};

    const { titulo, texto } = data;

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <section className={styles.sectionTwoColumns}>
                    <div className={styles.heroTextContainer}>
                        <span className={styles.sectionSubtitle}>Exploração Literária</span>
                        <h2 className={styles.sectionTitle}>
                            {titulo || 'Curiosidade e Contexto:'}
                        </h2>

                        <p className={styles.bodyText}>{texto || 'Carregando informações contextuais:'}</p>
                    </div>

                    <div className={styles.heroImageWrapper}>
                        <img src={cidadeImg} alt="Cenário Real" className={styles.heroImage} />

                        <div className={styles.imageCaption}>
                            <strong>Cenário Real</strong>
                            <span>Salvador, Anos 30</span>
                        </div>
                    </div>
                </section>

                <div className={styles.cardGrid}>
                    <section className={styles.cardCensure}>
                        <div className={styles.cardText}>
                            <div className={styles.cardTitleContainer}>
                                <span className={styles.cardIcon}>📖</span>
                                <h3 className={styles.cardTitle}>Impacto Social e Censura</h3>
                            </div>
                            <p className={styles.bodyText}>Em 1937, logo após seu lançamento, "Capitães da Areia" foi considerado subversivo pela ditadura pelo Estado novo</p>
                            <div className={styles.alertBox}>
                                <span className={styles.alertTitle}>FATO HISTÓRICO</span>
                                <p className={styles.alertText}>Cerca de 808 exemplares do livro foram queimados em praça pública em Salvador pelas autoridades locais</p>
                            </div>
                        </div>

                        <div className={styles.censureImageContainer}>
                            <img src={capitaesImg} alt="Ilustração de Censura" />
                        </div>
                    </section>

                    <section className={styles.darkCard}>
                        <div className={styles.cardTitleContainer}>
                            <span className={styles.cardIconWhite}>⚓</span>
                            <h3 className={styles.darkCardTitle}>A Bahia de 1930</h3>
                        </div>
                        <p className={styles.darkCardTitle}></p>
                        <ul className={styles.bulletList}>
                            <li className={styles.bulletItem}>Urbanização precária</li>
                            <li className={styles.bulletItem}>Decadência do cacau</li>
                            <li className={styles.bulletItem}>Segregação especial</li>
                        </ul>
                    </section>
                </div>

                <section className={styles.timelineSection}>
                    <h2 className={styles.timelineSubtitle}>Cronologia: O Pai dos Capitães</h2>
                    <p className={styles.timelineSubtitle}>
                        A trajetória de Jorge Amado e a criação de sua obra-prima.
                    </p>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineLeft}>
                            <h4 className={styles.timelineTitleText}>Nascimento</h4>
                            <p className={styles.timelineBody}>Jorge Amado nasce em Itabuna, no sul da Bahia.</p>
                        </div>
                        <div className={styles.timelineCenter}>
                            <div className={styles.timelineBadge}>1912</div>
                        </div>
                        <div className={styles.timelineRight}>
                            <div className={styles.timelineCardContent}>
                                <h4 className={styles.timelineTitleText}>A ORIGEM</h4>
                                <p className={styles.timelineBody}>Sua infância no ambiente cacueiro inspirou diversas de suas futuras obras.</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.timelineItem}>
                        <div className={styles.timelineLeft}>
                            <div className={styles.timelineCardContentLeft}>
                                <h4 className={styles.timelineTitleText}>CAPITÂES DA AREIA</h4>
                                <p className={styles.timelineBody}>Publicação do livro que retrata a vidas dos menores abandonados em Salvador. </p>
                            </div>
                        </div>
                        <div className={styles.timelineCenter}>
                            <div className={styles.timelineBadge}>1937</div>
                        </div>
                        <div className={styles.timelineRight}>
                                <h4 className={styles.timelineTitleText}>A Obra-Prima</h4>
                                <p className={styles.timelineBody}>A obra choca a sociedade e se torna um marco do Modernismo brasileiro.</p>
                            </div>
                        </div>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineLeft}>
                            <h4 className={styles.timelineTitleText}>Academia Brasileira</h4>
                            <p className={styles.timelineBody}>Eleito para a cadeira número 23 da ABL.</p>
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

                <section className={styles.religiosidadeSection}>
                    <div className={styles.religiosidadeTextContent}>
                        <h2 className={styles.religiosidadeTitle}>Religiosidade e o Candomblé</h2>
                        <p className={styles.religiosidadeBodyText}>Jorge Amado sempre defendeu a liberdade religiosa e trouxe a rica cosmologia do Candomblé para o centro de suas narrativas cotidianas.</p>

                        <div className={styles.tagContainer}>
                            <span className={styles.tag}>Iemanjá</span>
                            <span className={styles.tag}>Ogum</span>
                            <span className={styles.tag}>Resistência Cultural</span>
                            <span className={styles.tag}>Identidade Afro</span>
                        </div>
                    </div>
                    <div className={styles.religiosidadeImageContainer}>
                        <img
                            src={downloadImg}
                            alt="Mandala / Padrão Afro brasileiro"
                            className={styles.religiosidadeImage}
                        />
                    </div>
                </section>
            </div>
            <div className={styles.footerTextContent}></div>
            <div className={styles.footerImageContainer}></div>
        </>
    );
}
