import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import  styles from './Simulados.module.css'

function Simulados() {
    const [quiz, setQuiz] = useState(null);
    const [questoes, setQuestoes] = useState([]);
    const [indiceAtual, setIndiceAtual] = useState(0);
    const [respostas, setRespostas] = useState({});
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        const carregarDadosDaApi = async () => {
            try {
                setCarregando(true);

                const response = await fetch('URL_API/quiz/1');

                if (!response.ok) {
                    throw new Error('Não foi possível carregar o simulado.');
                }

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('O servidor não retornou um formato de dados válido (JSON).');
                }

                const dadosQuiz = await response.json();
                setQuiz(dadosQuiz);

                if (dadosQuiz.questoes && dadosQuiz.questoes.length > 0) {
                    const questoesFormatadas = dadosQuiz.questoes.map((q) => {
                        const alternativas = [
                            { id: 'A', texto: `A) ${q.alternativaA}` },
                            { id: 'B', texto: `B) ${q.alternativaB}` },
                            { id: 'C', texto: `C) ${q.alternativaC}` },
                            { id: 'D', texto: `D) ${q.alternativaD}` },
                        ];

                        if (q.alternativaE) {
                            alternativas.push({ id: 'E', texto: `E) ${q.alternativaE}` });
                        }

                        return {
                            id: q.id,
                            enunciado: q.enunciado,
                            comentario: q.comentarioResolucao,
                            alternativas: alternativas
                        };
                    });

                    setQuestoes(questoesFormatadas);
                }

            } catch (err) {
                setErro(err.message);
            } finally {
                setCarregando(false);
            }
        };

        carregarDadosDaApi();
    }, []);

    if (carregando)
        return (
            <div className={styles.centralizado}>
                Carregando simulado...
            </div>
        );

    if (erro)
        return (
            <div className={`${styles.centralizado} text-red-500`}>
                Erro: {erro}
            </div>
        );

    if (questoes.length === 0)
        return (
            <div className={styles.centralizado}>
                Nenhuma questão encontrada para este quiz.
            </div>
        );

    const questaoAtual = questoes[indiceAtual];

    const irParaProxima = () => {
        if (indiceAtual < questoes.length - 1) setIndiceAtual(indiceAtual + 1);
    };

    const irParaAnterior = () => {
        if (indiceAtual > 0) {
            setIndiceAtual(indiceAtual - 1);
        }
    };

    const selecionarAlternativa = (alternativaId) => {
        setRespostas({
            ...respostas,
            [questaoAtual.id]: alternativaId
        });
    };

    return (
        <div className={styles.container}>

            <Navbar />

            <header className={styles.header}>
                <h1 className={styles.logo}>Clube do Livro</h1>

                <nav className={styles.nav}>
                    <span className={styles.navLinkActive}>
                        {quiz?.titulo || 'Quiz'}
                    </span>
                </nav>
            </header>

            <div className={styles.mainGrid}>

                <div className={styles.questaoCard}>

                    <div>
                        <span className={styles.contextoTxt}>
                            {quiz?.descricao || "Simulado da Obra"}
                        </span>

                        <h2 className={styles.tituloQuestao}>
                            Questão {indiceAtual + 1} de {questoes.length}
                        </h2>

                        <p className={styles.enunciado}>
                            {questaoAtual.enunciado}
                        </p>

                        <div className={styles.alternativasLista}>
                            {questaoAtual.alternativas.map((alt) => {

                                const selecionada =
                                    respostas[questaoAtual.id] === alt.id;

                                return (
                                    <button
                                        key={alt.id}
                                        onClick={() => selecionarAlternativa(alt.id)}
                                        className={`${styles.alternativaBtn} ${selecionada
                                            ? styles.alternativaSelecionada
                                            : ''
                                            }`}
                                    >
                                        <div className={styles.radioCircle}>
                                            {selecionada && (
                                                <div className={styles.radioInner} />
                                            )}
                                        </div>

                                        <div>
                                            <p className={styles.textoAlternativa}>
                                                {alt.texto}
                                            </p>
                                        </div>

                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.navegacaoFooter}>

                        <button
                            onClick={irParaAnterior}
                            disabled={indiceAtual === 0}
                            className={styles.btnNavegar}
                        >
                            ← Anterior
                        </button>

                        <div className={styles.grupoBotoesDireita}>

                            <button className={styles.btnRevisar}>
                                Revisar Depois
                            </button>

                            <button
                                onClick={irParaProxima}
                                disabled={indiceAtual === questoes.length - 1}
                                className={styles.btnProxima}
                            >
                                Próxima Questão →
                            </button>

                        </div>
                    </div>
                </div>

                <div>

                    <div className={styles.mapaCard}>

                        <h3 className={styles.mapaTitulo}>
                            Mapa de Questões
                        </h3>

                        <div className={styles.mapaGrid}>
                            {questoes.map((q, index) => {

                                const respondida =
                                    respostas[q.id] !== undefined;

                                const ativa =
                                    index === indiceAtual;

                                let classeBotao =
                                    styles.badgeQuestao;

                                if (ativa) {
                                    classeBotao += ` ${styles.badgeAtiva}`;
                                } else if (respondida) {
                                    classeBotao += ` ${styles.badgeRespondida}`;
                                }

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setIndiceAtual(index)}
                                        className={classeBotao}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>

                        <button className={styles.btnFinalizar}>
                            Finalizar Simulado
                        </button>

                    </div>

                    {questaoAtual.comentario && (
                        <div className={styles.dicaCard}>

                            <h4 className={styles.dicaTitulo}>
                                Comentário / Ajuda
                            </h4>

                            <p className={styles.dicaTexto}>
                                {questaoAtual.comentario}
                            </p>

                        </div>
                    )}
            </div>
            </div>
        </div>
    );
}

export default Simulados;
