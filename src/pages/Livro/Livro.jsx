import { useState, useEffect } from 'react';
import styles from './Livro.module.css';

export default function Livro() {
    const [livro, setLivro] = useState({
        titulo: 'Capitães da Areia',
        autor: 'Jorge Amado',
        ano: '1937',
        genero: 'Modernismo Brasileiro',
        citacao:
            'Vestidos de farrapos, sujos, semitransparentes de fome, os Capitães da Areia dominavam a cidade da Bahia, donos dos trapiches, dos areias e do mar.',
        resumo: 'Resumo da Obra',
        analiseTitulo: 'O Romance de Formação e a Denúncia Social',
        analiseTexto:
            "A obra se destaca pela humanização dos 'meninos de rua', termo que Jorge Amado evita em favor de uma visão mais romântica e heroica, mas não menos crítica. O trapiche funciona como um microcosmo da sociedade soteropolitana da época.",
        cards: [
            {
                titulo: 'Simbolismo',
                desc: 'O trapiche como refúgio e o mar como horizonte de liberdade são metáforas centrais na obra.',
            },
            {
                titulo: 'Engajamento',
                desc: 'Reflete o alinhamento ideológico de Jorge Amado com o Partido Comunista na década.',
            },
            {
                titulo: 'Tema Chave',
                desc: '• Liberdade vs Opressão\n• Solidariedade de Grupo\n• Sincretismo Religioso',
            },
        ],
    });

    useEffect(() => {
        fetch('API')
            .then((res) => res.json())
            .then((dados) => setLivro(dados));
    }, []);

    return (
        <div className={styles.corpo}>
            <header></header>

            <main className={styles.container}>
                <section className={styles.secaoTopo}>
                    <div className={styles.molduraFoto}>
                        <img src="" alt="" />
                    </div>

                    <div className={styles.infoLivro}>
                        <span className={styles.tag}>{livro.genero}</span>
                        <h1 className={styles.tituloPrincipal}>{livro.titulo}</h1>
                        <p className={styles.autorAno}>
                            {livro.autor}, {livro.ano}
                        </p>
                        <p className={styles.citacaoTexto}>"{livro.citacao}</p>

                        <div className={styles.caixaResumo}>
                            <strong>Resumo da Obra</strong>
                            <p>{livro.resumo}</p>
                        </div>

                        <div className={styles.botoes}>
                            <button className={styles.bntRoxo}>Videoaulas</button>
                            <button className={styles.btnBranco}>Curiosidades</button>
                        </div>
                    </div>
                </section>

                <div className={styles.abas}>
                    <span className={styles.abaAtiva}>Análise da Obra</span>
                    <span>Personagens</span>
                    <span>Contexto Histórico</span>
                </div>

                <section className={styles.blocoAnalise}>
                    <h2>{livro.analiseTitulo}</h2>
                    <p className={styles.textoAnalise}>{livro.analiseTexto}</p>

                    <div className={styles.gradeCards}>
                        {livro.cards.map((card, i) => (
                            <div key={i} className={styles.cardRoxo}>
                                <strong className={styles.tituloCard}>{card.titulo}</strong>
                                <p>{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <footer></footer>
        </div>
    );
}
