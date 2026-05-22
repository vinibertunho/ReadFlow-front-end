import { useEffect, useState } from 'react';
import styles from './Equipe.module.css';
import Navbar from '../../components/Navbar/Navbar.jsx';

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
                        <span className={styles.badge}>ReadFlow</span>

                        <h1>Equipe</h1>
                        <p>Composta por alunos do SESI-SENAI</p>
                    </div>
                </section>

                <section className={styles.missao}>
                    <div className={styles.texto}>
                        <h2>Nossa Missao</h2>

                        <p>
                            Nossa missão é criar um ambiente de estudos voltado a livros de
                            vestibulares, para auxiliar os alunos em seus cronogramas de estudos.
                            Transformando o acesso à leitura obrigatória em uma experiência
                            interativa, didática e acessível. E além de tudo isso nossa equipe
                            gostaria de oferecer um site tanto com conteúdos na língua portuguesa
                            quanto na língua inglesa, para que os alunos possam ter um maior acesso
                            a variedade de recursos e perspectivas sobre as obras literárias,
                            enriquecendo assim seu repertório cultural e literário.
                        </p>
                    </div>

                    <div className={styles.objetivos}>
                        <h3>Objetivos do Sistema</h3>
                        <ul>
                            <li>
                                Estabilidade de Plataforma: Garantir que o site suporte picos de
                                acesso (comuns em vésperas de provas) sem perda de performance.
                            </li>
                            <li>
                                Sintetizar obras complexas: Traduzir a densidade dos livros
                                obrigatórios em análises claras, sem perder a profundidade crítica
                                necessária para as provas.
                            </li>
                            <li>
                                Curadoria Especializada: Garantir que as videoaulas e dicas estejam
                                sempre alinhadas com as tendências das bancas examinadoras (como
                                FUVEST, UNICAMP e ENEM).
                            </li>
                            <li>
                                Inclusão: Tornar-se uma ferramenta de apoio para alunos que não
                                possuem acesso a cursinhos particulares de alto custo.
                            </li>
                        </ul>
                    </div>
                </section>

                <section className={styles.equipe}>
                    <h2>Membros da Equipe</h2>

                    <div className={styles.grid}>
                        {membros.map((item, index) => (
                            <div key={index} className={styles.card}>
                                <img src={item.picture.large} alt={item.nome.first} />

                                <div className={styles.info}>
                                    <h3>
                                        {item.nome.first} {item.nome.last}
                                    </h3>

                                    <span>Desenvolvedor(a)</span>

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
