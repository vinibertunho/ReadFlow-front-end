import { useEffect, useState, useMemo } from 'react';
import styles from './Equipe.module.css';
import Navbar from '../../components/Navbar/Navbar.jsx';
import { useIdioma } from '../../context/IdiomaContext.jsx';

const API_URL = 'https://randomuser.me/api/?results=6&nat=br,pt,us';

function Equipe() {
    const [membros, setMembros] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const { idioma } = useIdioma();

    useEffect(() => {
        fetch(API_URL)
            .then((response) => {
                if (!response.ok) throw new Error('Falha na requisição');
                return response.json();
            })
            .then((dados) => {
                setMembros(dados.results);
                setCarregando(false);
            })
            .catch((erro) => {
                console.error('Erro ao buscar a equipe:', erro);
                setErro(erro.message);
                setCarregando(false);
            });
    }, []);

    const ui = useMemo(() => {
        const en = idioma === 'EN';
        return {
            carregando: en ? 'Loading team...' : 'Carregando equipe...',
            erro: en ? 'Error loading team' : 'Erro ao carregar equipe',
            badge: 'ReadFlow',
            heroTitle: en ? 'Team' : 'Equipe',
            heroSub: en ? 'Made up of SESI-SENAI students' : 'Composta por alunos do SESI-SENAI',

            missaoTitle: en ? 'Our Mission' : 'Nossa Missão',
            missaoText: en
                ? 'Our mission is to create a study environment focused on books required for university entrance exams, helping students with their study schedules. We transform access to mandatory reading into an interactive, educational and accessible experience. Our team also aims to offer content in both Portuguese and English, so students can access a wider variety of resources and perspectives on literary works, enriching their cultural and literary repertoire.'
                : 'Nossa missão é criar um ambiente de estudos voltado a livros de vestibulares, para auxiliar os alunos em seus cronogramas de estudos. Transformando o acesso à leitura obrigatória em uma experiência interativa, didática e acessível. E além de tudo isso nossa equipe gostaria de oferecer um site tanto com conteúdos na língua portuguesa quanto na língua inglesa, para que os alunos possam ter um maior acesso a variedade de recursos e perspectivas sobre as obras literárias, enriquecendo assim seu repertório cultural e literário.',

            objetivosTitle: en ? 'System Objectives' : 'Objetivos do Sistema',
            obj1: en
                ? 'Platform Stability: Ensure the site handles traffic spikes (common before exams) without performance loss.'
                : 'Estabilidade de Plataforma: Garantir que o site suporte picos de acesso (comuns em vésperas de provas) sem perda de performance.',
            obj2: en
                ? 'Synthesize complex works: Translate the density of required books into clear analyses without losing the critical depth needed for exams.'
                : 'Sintetizar obras complexas: Traduzir a densidade dos livros obrigatórios em análises claras, sem perder a profundidade crítica necessária para as provas.',
            obj3: en
                ? 'Specialized Curation: Ensure that video lessons and tips are always aligned with exam trends (such as FUVEST, UNICAMP and ENEM).'
                : 'Curadoria Especializada: Garantir que as videoaulas e dicas estejam sempre alinhadas com as tendências das bancas examinadoras (como FUVEST, UNICAMP e ENEM).',
            obj4: en
                ? "Inclusion: Become a support tool for students who don't have access to expensive private prep courses."
                : 'Inclusão: Tornar-se uma ferramenta de apoio para alunos que não possuem acesso a cursinhos particulares de alto custo.',

            membrosTitle: en ? 'Team Members' : 'Membros da Equipe',
        };
    }, [idioma]);

    if (carregando) {
        return <h2 className={styles.loading}>{ui.carregando}</h2>;
    }

    if (erro) {
        return (
            <>
                <Navbar />
                <h2 className={styles.erro}>{ui.erro}</h2>
                <p>{erro}</p>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <section className={styles.hero}>
                    <div className={styles.overlay}>
                        <span className={styles.badge}>{ui.badge}</span>
                        <h1>{ui.heroTitle}</h1>
                        <p>{ui.heroSub}</p>
                    </div>
                </section>

                <section className={styles.texto}>
                    <div className={styles.missao}>
                        <h3>{ui.missaoTitle}</h3>
                        <p>{ui.missaoText}</p>
                    </div>

                    <div className={styles.objetivos}>
                        <h3>{ui.objetivosTitle}</h3>
                        <ul>
                            <li>{ui.obj1}</li>
                            <li>{ui.obj2}</li>
                            <li>{ui.obj3}</li>
                            <li>{ui.obj4}</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.equipe}>
                    <h2>{ui.membrosTitle}</h2>
                    <div className={styles.grid}>
                        {membros.map((item, index) => (
                            <div key={index} className={styles.card}>
                                <img src={item.picture.large} alt={`${item.name.first} ${item.name.last}`} />
                                <div className={styles.info}>
                                    <h3>
                                        {item.name.first} {item.name.last}
                                    </h3>
                                    <span>{idioma === 'EN' ? 'Developer' : 'Desenvolvedor(a)'}</span>
                                    <p>YYYYYYYYYYYY</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}

export default Equipe;
