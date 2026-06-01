import { useEffect, useState } from 'react';
import styles from './Curiosidades.module.css';
import Navbar from '../../components/Navbar/Navbar';
import cidadeImg from '../../assets/cidade.png';
import fotoImg from '../../assets/foto.jpg';
import downloadImg from '../../assets/download.jpg';
import { useIdioma } from '../../context/IdiomaContext';

const URL_API = 'https://readflow-m8o6.onrender.com/api/curiosidades';

export default function Curiosidades() {
    const [carregando, setCarregando] = useState(true);
    const [dados, setDados] = useState(null);
    const { idioma } = useIdioma();
    const en = idioma === 'EN';

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

    const ui = {
        carregando: en ? 'Loading Facts & Tips...' : 'Carregando Curiosidades e dicas...',
        semDados: en ? 'No data found.' : 'Nenhum dado encontrado.',
        subtitulo: en ? 'Literary Exploration' : 'Exploração Literária',
        tituloDefault: en ? 'Curiosity and Context:' : 'Curiosidade e Contexto:',
        textoDefault: en
            ? 'Loading contextual information:'
            : 'Carregando informações contextuais:',

        cenarioReal: en ? 'Real Setting' : 'Cenário Real',
        cenarioSub: en ? 'Salvador, 1930s' : 'Salvador, Anos 30',

        impactoTitle: en ? 'Social Impact and Censorship' : 'Impacto Social e Censura',
        impactoText: en
            ? 'In 1937, shortly after its release, "Captains of the Sands" was deemed subversive by the Estado Novo dictatorship.'
            : 'Em 1937, logo após seu lançamento, "Capitães da Areia" foi considerado subversivo pela ditadura pelo Estado novo.',
        fatoHistorico: en ? 'HISTORICAL FACT' : 'FATO HISTÓRICO',
        fatoText: en
            ? "Around 808 copies of the book were publicly burned in Salvador's main square by local authorities."
            : 'Cerca de 808 exemplares do livro foram queimados em praça pública em Salvador pelas autoridades locais.',

        bahiaTitle: en ? 'Bahia in 1930' : 'A Bahia de 1930',
        bullet1: en ? 'Precarious urbanization' : 'Urbanização precária',
        bullet2: en ? 'Decline of cacao farming' : 'Decadência do cacau',
        bullet3: en ? 'Spatial segregation' : 'Segregação especial',

        cronologiaTitle: en
            ? 'Chronology: The Father of the Captains'
            : 'Cronologia: O Pai dos Capitães',
        cronologiaSub: en
            ? 'The journey of Jorge Amado and the creation of his masterpiece.'
            : 'A trajetória de Jorge Amado e a criação de sua obra-prima.',

        ano1912Title: en ? 'Birth' : 'Nascimento',
        ano1912Text: en
            ? 'Jorge Amado is born in Itabuna, in southern Bahia.'
            : 'Jorge Amado nasce em Itabuna, no sul da Bahia.',
        ano1912Right: en ? 'THE ORIGIN' : 'A ORIGEM',
        ano1912Desc: en
            ? 'His childhood in the cacao environment inspired many of his future works.'
            : 'Sua infância no ambiente cacueiro inspirou diversas de suas futuras obras.',

        ano1937Left: en ? 'CAPTAINS OF THE SANDS' : 'CAPITÃES DA AREIA',
        ano1937LeftDesc: en
            ? 'Publication of the book depicting the lives of abandoned minors in Salvador.'
            : 'Publicação do livro que retrata a vida dos menores abandonados em Salvador.',
        ano1937Right: en ? 'The Masterpiece' : 'A Obra-Prima',
        ano1937Desc: en
            ? 'The work shocks society and becomes a landmark of Brazilian Modernism.'
            : 'A obra choca a sociedade e se torna um marco do Modernismo brasileiro.',

        ano1961Title: en ? 'Brazilian Academy' : 'Academia Brasileira',
        ano1961Text: en
            ? 'Elected to chair number 23 of the ABL.'
            : 'Eleito para a cadeira número 23 da ABL.',
        academyTag: en ? 'BRAZILIAN ACADEMY OF LETTERS' : 'ACADEMIA BRASILEIRA DE LETRAS',

        religiosidadeTitle: en ? 'Religiosity and Candomblé' : 'Religiosidade e o Candomblé',
        religiosidadeText: en
            ? 'Jorge Amado always defended religious freedom and brought the rich cosmology of Candomblé to the center of his everyday narratives.'
            : 'Jorge Amado sempre defendeu a liberdade religiosa e trouxe a rica cosmologia do Candomblé para o centro de suas narrativas cotidianas.',
        tag1: 'Iemanjá',
        tag2: 'Ogum',
        tag3: en ? 'Cultural Resistance' : 'Resistência Cultural',
        tag4: en ? 'Afro Identity' : 'Identidade Afro',
    };

    if (carregando) {
        return <h2 className={styles.loading}>{ui.carregando}</h2>;
    }

    if (!dados || (Array.isArray(dados) && dados.length === 0)) {
        return <h2 className={styles.loading}>{ui.semDados}</h2>;
    }

    const data = (Array.isArray(dados) ? dados[0] : dados) || {};

    // Usa campo em EN se disponível, senão PT
    const titulo = en ? data.titulo_en || data.titulo : data.titulo;
    const texto = en ? data.texto_en || data.texto : data.texto;

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <section className={styles.sectionTwoColumns}>
                    <div className={styles.heroTextContainer}>
                        <span className={styles.sectionSubtitle}>{ui.subtitulo}</span>
                        <h2 className={styles.sectionTitle}>{titulo || ui.tituloDefault}</h2>
                        <p className={styles.bodyText}>{texto || ui.textoDefault}</p>
                    </div>

                    <div className={styles.heroImageWrapper}>
                        <img src={cidadeImg} alt={ui.cenarioReal} className={styles.heroImage} />
                        <div className={styles.imageCaption}>
                            <strong>{ui.cenarioReal}</strong>
                            <span>{ui.cenarioSub}</span>
                        </div>
                    </div>
                </section>

                <div className={styles.cardGrid}>
                    <section className={styles.cardCensure}>
                        <div className={styles.cardText}>
                            <div className={styles.cardTitleContainer}>
                                <span className={styles.cardIcon}>📖</span>
                                <h3 className={styles.cardTitle}>{ui.impactoTitle}</h3>
                            </div>
                            <p className={styles.bodyText}>{ui.impactoText}</p>
                            <div className={styles.alertBox}>
                                <span className={styles.alertTitle}>{ui.fatoHistorico}</span>
                                <p className={styles.alertText}>{ui.fatoText}</p>
                            </div>
                        </div>

                        <div className={styles.censureImageContainer}>
                            <img src={fotoImg} alt={ui.impactoTitle} />
                        </div>
                    </section>

                    <section className={styles.darkCard}>
                        <div className={styles.cardTitleContainer}>
                            <span className={styles.cardIconWhite}>⚓</span>
                            <h3 className={styles.darkCardTitle}>{ui.bahiaTitle}</h3>
                        </div>
                        <ul className={styles.bulletList}>
                            <li className={styles.bulletItem}>{ui.bullet1}</li>
                            <li className={styles.bulletItem}>{ui.bullet2}</li>
                            <li className={styles.bulletItem}>{ui.bullet3}</li>
                        </ul>
                    </section>
                </div>

                <section className={styles.timelineSection}>
                    <h2 className={styles.timelineSubtitle}>{ui.cronologiaTitle}</h2>
                    <p className={styles.timelineSubtitle}>{ui.cronologiaSub}</p>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineCardTransparentLeft}>
                            <h4 className={styles.timelineTitleText}>{ui.ano1912Title}</h4>
                            <p className={styles.timelineBody}>{ui.ano1912Text}</p>
                        </div>
                        <div className={styles.timelineCenter}>
                            <div className={styles.timelineBadge}>1912</div>
                        </div>
                        <div className={styles.timelineRight}>
                            <div className={styles.timelineCardContent}>
                                <h4 className={styles.timelineTitleText}>{ui.ano1912Right}</h4>
                                <p className={styles.timelineBody}>{ui.ano1912Desc}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineLeft}>
                            <div className={styles.timelineCardContentLeft}>
                                <h4 className={styles.timelineTitleText}>{ui.ano1937Left}</h4>
                                <p className={styles.timelineBody}>{ui.ano1937LeftDesc}</p>
                            </div>
                        </div>
                        <div className={styles.timelineCenter}>
                            <div className={styles.timelineBadge}>1937</div>
                        </div>
                        <div className={styles.timelineCardTransparentRight}>
                            <h4 className={styles.timelineTitleText}>{ui.ano1937Right}</h4>
                            <p className={styles.timelineBody}>{ui.ano1937Desc}</p>
                        </div>
                    </div>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineCardTransparentLeft}>
                            <h4 className={styles.timelineTitleText}>{ui.ano1961Title}</h4>
                            <p className={styles.timelineBody}>{ui.ano1961Text}</p>
                        </div>
                        <div className={styles.timelineCenter}>
                            <div className={styles.timelineBadge}>1961</div>
                        </div>
                        <div className={styles.timelineRight}>
                            <div className={styles.timelineCardContent}>
                                <strong className={styles.academyTag}>{ui.academyTag}</strong>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.religiosidadeSection}>
                    <div className={styles.religiosidadeTextContent}>
                        <h2 className={styles.religiosidadeTitle}>{ui.religiosidadeTitle}</h2>
                        <p className={styles.religiosidadeBodyText}>{ui.religiosidadeText}</p>
                        <div className={styles.tagContainer}>
                            <span className={styles.tag}>{ui.tag1}</span>
                            <span className={styles.tag}>{ui.tag2}</span>
                            <span className={styles.tag}>{ui.tag3}</span>
                            <span className={styles.tag}>{ui.tag4}</span>
                        </div>
                    </div>
                    <div className={styles.religiosidadeImageContainer}>
                        <img
                            src={downloadImg}
                            alt={ui.religiosidadeTitle}
                            className={styles.religiosidadeImage}
                        />
                    </div>
                </section>
            </div>
        </>
    );
}
