import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Simulados.module.css';
import { useIdioma } from '../../context/IdiomaContext';

const URL_API = 'https://readflow-m8o6.onrender.com/api/questoes';

function ConteudoSimulado({ todasQuestoes, abaAtiva, ui }) {
    const [indiceAtual, setIndiceAtual] = useState(0);
    const [respostas, setRespostas] = useState({});
    const [simuladoConcluido, setSimuladoConcluido] = useState(false);
    const [pontuacao, setPontuacao] = useState(0);

    const questoesFiltradas = todasQuestoes.filter((q) => q.idioma === abaAtiva);
    const questaoAtual = questoesFiltradas[indiceAtual] || null;

    const irParaAnterior = () => setIndiceAtual((prev) => Math.max(prev - 1, 0));
    const irParaProxima = () =>
        setIndiceAtual((prev) => Math.min(prev + 1, questoesFiltradas.length - 1));

    const selecionarAlternativa = (alternativaId) => {
        if (!questaoAtual) return;
        setRespostas((prev) => ({ ...prev, [questaoAtual.id]: alternativaId }));
    };

    const finalizarSimulado = () => {
        let acertos = 0;
        questoesFiltradas.forEach((questao) => {
            const respostaUsuario = respostas[questao.id];
            if (
                respostaUsuario &&
                String(respostaUsuario).trim().toUpperCase() === questao.respostaCorreta
            ) {
                acertos++;
            }
        });
        setPontuacao(acertos);
        setSimuladoConcluido(true);
    };

    const reiniciarSimulado = () => {
        setRespostas({});
        setIndiceAtual(0);
        setSimuladoConcluido(false);
        setPontuacao(0);
    };

    if (questoesFiltradas.length === 0) {
        return (
            <div className={styles.centralizado}>
                {ui.nenhumaQuestao} {abaAtiva}.
            </div>
        );
    }

    if (simuladoConcluido) {
        return (
            <div
                className={styles.centralizado}
                style={{ flexDirection: 'column', padding: '20px' }}>
                <h2>
                    {ui.concluido} ({abaAtiva === 'PT' ? ui.portugues : ui.ingles})
                </h2>
                <p style={{ fontSize: '1.2rem' }}>
                    {ui.acertou} <strong>{pontuacao}</strong> {ui.de}{' '}
                    <strong>{questoesFiltradas.length}</strong> {ui.questoes}.
                </p>
                <div
                    className={styles.porcentagemResultado}
                    style={{ fontSize: '2rem', fontWeight: 'bold', margin: '15px 0' }}>
                    {((pontuacao / questoesFiltradas.length) * 100).toFixed(0)}% {ui.aproveitamento}
                </div>

                <h3 style={{ marginTop: '30px', alignSelf: 'flex-start' }}>📋 {ui.gabarito}</h3>
                <div style={{ width: '100%', textAlign: 'left', marginTop: '10px' }}>
                    {questoesFiltradas.map((q, idx) => {
                        const respUser = respostas[q.id] || ui.naoRespondida;
                        const acertoQuestao =
                            String(respUser).trim().toUpperCase() === q.respostaCorreta;

                        return (
                            <div
                                key={q.id}
                                style={{
                                    padding: '15px',
                                    borderBottom: '1px solid #ddd',
                                    marginBottom: '10px',
                                    backgroundColor: acertoQuestao ? '#e8f5e9' : '#ffebee',
                                    borderRadius: '6px',
                                }}>
                                <p>
                                    <strong>
                                        {ui.questao} {idx + 1}:
                                    </strong>{' '}
                                    {q.enunciado}
                                </p>
                                <p style={{ margin: '5px 0 0 0' }}>
                                    👉 {ui.suaResposta}:{' '}
                                    <strong style={{ color: acertoQuestao ? 'green' : 'red' }}>
                                        {respUser}
                                    </strong>
                                </p>
                                <p style={{ margin: '2px 0 0 0' }}>
                                    ✅ {ui.gabaritoOficial}:{' '}
                                    <strong style={{ color: 'green' }}>{q.respostaCorreta}</strong>
                                </p>
                                <p
                                    style={{
                                        fontStyle: 'italic',
                                        marginTop: '8px',
                                        fontSize: '0.9rem',
                                        color: '#555',
                                    }}>
                                    💡 {ui.explicacao}: {q.comentario}
                                </p>
                            </div>
                        );
                    })}
                </div>
                <button
                    onClick={reiniciarSimulado}
                    className={styles.btnProxima}
                    style={{ marginTop: '20px' }}>
                    {ui.refazer}
                </button>
            </div>
        );
    }

    return (
        <div className={styles.mainGrid}>
            <div className={styles.questaoCard}>
                <div>
                    <span className={styles.contextoTxt}>
                        {ui.selecioneIdioma} ({ui.secao} {abaAtiva})
                    </span>
                    <h2 className={styles.tituloQuestao}>
                        {ui.questao} {indiceAtual + 1} {ui.de} {questoesFiltradas.length}
                    </h2>

                    {questaoAtual && (
                        <>
                            <p className={styles.enunciado}>{questaoAtual.enunciado}</p>
                            <div className={styles.alternativasLista}>
                                {questaoAtual.alternativas.map((alt) => {
                                    const selecionada = respostas[questaoAtual.id] === alt.id;
                                    return (
                                        <button
                                            key={alt.id}
                                            onClick={() => selecionarAlternativa(alt.id)}
                                            className={`${styles.alternativaBtn} ${
                                                selecionada ? styles.alternativaSelecionada : ''
                                            }`}>
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
                        </>
                    )}
                </div>

                <div className={styles.navegacaoFooter}>
                    <button
                        onClick={irParaAnterior}
                        disabled={indiceAtual === 0}
                        className={styles.btnRevisar}>
                        {ui.anterior}
                    </button>
                    <button
                        onClick={irParaProxima}
                        disabled={indiceAtual === questoesFiltradas.length - 1}
                        className={styles.btnProxima}>
                        {ui.proxima}
                    </button>
                </div>
            </div>

            <div className={styles.mapaCard}>
                <h3 className={styles.mapaTitulo}>
                    {ui.mapaQuestoes} ({abaAtiva})
                </h3>
                <div className={styles.mapaGrid}>
                    {questoesFiltradas.map((q, index) => {
                        const respondida = respostas[q.id] !== undefined;
                        const ativa = index === indiceAtual;
                        let classeBotao = styles.badgeQuestao;
                        if (ativa) classeBotao += ` ${styles.badgeAtiva}`;
                        else if (respondida) classeBotao += ` ${styles.badgeRespondida}`;

                        return (
                            <button
                                key={q.id}
                                onClick={() => setIndiceAtual(index)}
                                className={classeBotao}>
                                {index + 1}
                            </button>
                        );
                    })}
                </div>
                <button onClick={finalizarSimulado} className={styles.btnFinalizar}>
                    {ui.finalizar} {abaAtiva}
                </button>
            </div>
        </div>
    );
}

function Simulados() {
    const [todasQuestoes, setTodasQuestoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const { idioma } = useIdioma();
    const abaAtiva = idioma; // PT ou EN — sincronizado com o botão global

    const ui = {
        carregando:
            idioma === 'PT' ? 'Carregando questões da API...' : 'Loading questions from API...',
        nenhumaQuestao:
            idioma === 'PT'
                ? 'Nenhuma questão carregada para o idioma:'
                : 'No questions loaded for language:',
        concluido: idioma === 'PT' ? 'Simulado Concluído!' : 'Quiz Completed!',
        portugues: idioma === 'PT' ? 'Português' : 'Portuguese',
        ingles: idioma === 'PT' ? 'Inglês' : 'English',
        acertou: idioma === 'PT' ? 'Você acertou' : 'You got',
        de: idioma === 'PT' ? 'de' : 'out of',
        questoes: idioma === 'PT' ? 'questões' : 'questions',
        aproveitamento: idioma === 'PT' ? 'de Aproveitamento' : 'Score',
        gabarito: idioma === 'PT' ? 'Gabarito de Revisão:' : 'Answer Key Review:',
        naoRespondida: idioma === 'PT' ? 'Não respondida' : 'Not answered',
        questao: idioma === 'PT' ? 'Questão' : 'Question',
        suaResposta: idioma === 'PT' ? 'Sua resposta' : 'Your answer',
        gabaritoOficial: idioma === 'PT' ? 'Gabarito oficial' : 'Official answer',
        explicacao: idioma === 'PT' ? 'Explicação' : 'Explanation',
        refazer: idioma === 'PT' ? 'Refazer Simulado' : 'Retake Quiz',
        selecioneIdioma:
            idioma === 'PT'
                ? 'Selecione o idioma desejado na barra de navegação para realizar as questões.'
                : 'Select the desired language in the navigation bar to answer the questions.',
        secao: idioma === 'PT' ? 'Seção' : 'Section',
        anterior: idioma === 'PT' ? 'Questão Anterior' : 'Previous Question',
        proxima: idioma === 'PT' ? 'Próxima Questão' : 'Next Question',
        mapaQuestoes: idioma === 'PT' ? 'Mapa de Questões' : 'Question Map',
        finalizar: idioma === 'PT' ? 'Finalizar Seção' : 'Finish Section',
        tituloHeader: idioma === 'PT' ? 'Clube do Livro' : 'Book Club',
    };

    useEffect(() => {
        const carregarDadosDaApi = async () => {
            try {
                setCarregando(true);
                setErro(null);

                const response = await fetch(URL_API);

                if (!response.ok) {
                    throw new Error(
                        `Erro ${response.status}: Não foi possível conectar com a API.`,
                    );
                }

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('O servidor não retornou dados no formato JSON esperado.');
                }

                const dadosQuiz = await response.json();
                const listaDeQuestoes = Array.isArray(dadosQuiz) ? dadosQuiz : dadosQuiz.questoes;

                if (listaDeQuestoes && listaDeQuestoes.length > 0) {
                    const questoesFormatadas = listaDeQuestoes.map((q) => {
                        const formatarPrefixo = (texto, letra) => {
                            if (!texto) return '';
                            const textoLimpo = texto.trim();
                            const regexInicio = new RegExp(`^${letra}\\s*[-.)]\\s*`, 'i');
                            return regexInicio.test(textoLimpo)
                                ? textoLimpo
                                : `${letra}) ${textoLimpo}`;
                        };

                        const alternativas = [
                            { id: 'A', texto: formatarPrefixo(q.alternativaA, 'A') },
                            { id: 'B', texto: formatarPrefixo(q.alternativaB, 'B') },
                            { id: 'C', texto: formatarPrefixo(q.alternativaC, 'C') },
                            { id: 'D', texto: formatarPrefixo(q.alternativaD, 'D') },
                        ];

                        if (q.alternativaE) {
                            alternativas.push({
                                id: 'E',
                                texto: formatarPrefixo(q.alternativaE, 'E'),
                            });
                        }

                        const enunciadoSeguro = q.enunciado || '';
                        const altASegura = q.alternativaA || '';
                        const altBSegura = q.alternativaB || '';
                        const textoCompletoQuestao =
                            `${enunciadoSeguro} ${altASegura} ${altBSegura}`.toLowerCase();

                        const termosEmIngles = [
                            /\bthe\b/,
                            /\bof\b/,
                            /\bwhat\b/,
                            /\bwho\b/,
                            /\bis\b/,
                            /\babout\b/,
                            /\bin\b/,
                        ];
                        const ehIngles = termosEmIngles.some((regex) =>
                            regex.test(textoCompletoQuestao),
                        );

                        return {
                            id: q.id,
                            enunciado: enunciadoSeguro,
                            comentario:
                                q.comentarioResolucao ||
                                q.comentario ||
                                'Nenhum comentário disponível.',
                            alternativas,
                            respostaCorreta: String(q.gabarito || q.respostaCorreta || 'A')
                                .trim()
                                .toUpperCase(),
                            idioma: ehIngles ? 'EN' : 'PT',
                        };
                    });

                    setTodasQuestoes(questoesFormatadas);
                } else {
                    throw new Error(
                        'A API respondeu com sucesso, mas a lista de questões veio vazia.',
                    );
                }
            } catch (err) {
                console.error(err);
                setErro(err.message);
            } finally {
                setCarregando(false);
            }
        };

        carregarDadosDaApi();
    }, []);

    if (carregando) return <div className={styles.centralizado}>{ui.carregando}</div>;
    if (erro) return <div className={`${styles.centralizado} text-red-500`}>⚠️ {erro}</div>;

    return (
        <div className={styles.container}>
            <Navbar />
            <header className={styles.header}>
                <h1 className={styles.logo}>{ui.tituloHeader}</h1>
            </header>

            <ConteudoSimulado
                key={abaAtiva}
                todasQuestoes={todasQuestoes}
                abaAtiva={abaAtiva}
                ui={ui}
            />
        </div>
    );
}

export default Simulados;
