import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Simulados.module.css';

const URL_API = 'https://readflow-m8o6.onrender.com/api/questoes';

function Simulados({ idiomaDoSite = 'PT' }) {
    const [todasQuestoes, setTodasQuestoes] = useState([]);
    const [questoesFiltradas, setQuestoesFiltradas] = useState([]);
    const abaAtiva = String(idiomaDoSite).toUpperCase();

    const [indiceAtual, setIndiceAtual] = useState(0);
    const [respostas, setRespostas] = useState({});
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [simuladoConcluido, setSimuladoConcluido] = useState(false);
    const [pontuacao, setPontuacao] = useState(0);

    const questaoAtual = questoesFiltradas[indiceAtual] || null;

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
                        const alternativas = [
                            {
                                id: 'A',
                                texto: q.alternativaA?.startsWith('A)')
                                    ? q.alternativaA
                                    : `A) ${q.alternativaA || ''}`,
                            },
                            {
                                id: 'B',
                                texto: q.alternativaB?.startsWith('B)')
                                    ? q.alternativaB
                                    : `B) ${q.alternativaB || ''}`,
                            },
                            {
                                id: 'C',
                                texto: q.alternativaC?.startsWith('C)')
                                    ? q.alternativaC
                                    : `C) ${q.alternativaC || ''}`,
                            },
                            {
                                id: 'D',
                                texto: q.alternativaD?.startsWith('D)')
                                    ? q.alternativaD
                                    : `D) ${q.alternativaD || ''}`,
                            },
                        ];

                        if (q.alternativaE) {
                            alternativas.push({
                                id: 'E',
                                texto: q.alternativaE?.startsWith('E)')
                                    ? q.alternativaE
                                    : `E) ${q.alternativaE}`,
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
                        const codigoIdiomaFinal = ehIngles ? 'EN' : 'PT';

                        return {
                            id: q.id,
                            enunciado: enunciadoSeguro,
                            comentario:
                                q.comentarioResolucao ||
                                q.comentario ||
                                'Nenhum comentário disponível.',
                            alternativas,
                            respostaCorreta: q.gabarito || q.respostaCorreta || 'A',
                            idioma: codigoIdiomaFinal,
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const filtradas = todasQuestoes.filter((q) => q.idioma === abaAtiva);
        setQuestoesFiltradas(filtradas);
        setIndiceAtual(0);
    }, [abaAtiva, todasQuestoes]);

    const selecionarAlternativa = (alternativaId) => {
        if (!questaoAtual) return;
        setRespostas((prev) => ({
            ...prev,
            [questaoAtual.id]: alternativaId,
        }));
    };

    const finalizarSimulado = () => {
        let acertos = 0;
        questoesFiltradas.forEach((questao) => {
            const respostaUsuario = respostas[questao.id];
            if (
                respostaUsuario &&
                questao.respostaCorreta &&
                String(respostaUsuario).trim().toUpperCase() ===
                    String(questao.respostaCorreta).trim().toUpperCase()
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

    if (carregando) return <div className={styles.centralizado}>Carregando questões da API...</div>;
    if (erro) return <div className={`${styles.centralizado} text-red-500`}>⚠️ {erro}</div>;

    if (simuladoConcluido) {
        return (
            <div className={styles.container}>
                <Navbar />
                <div
                    className={styles.centralizado}
                    style={{ flexDirection: 'column', padding: '20px' }}>
                    <h2>Simulado Concluído! ({abaAtiva === 'PT' ? 'Português' : 'Inglês'})</h2>
                    <p style={{ fontSize: '1.2rem' }}>
                        Você acertou <strong>{pontuacao}</strong> de{' '}
                        <strong>{questoesFiltradas.length}</strong> questões.
                    </p>
                    <div
                        className={styles.porcentagemResultado}
                        style={{ fontSize: '2rem', fontWeight: 'bold', margin: '15px 0' }}>
                        {questoesFiltradas.length > 0
                            ? ((pontuacao / questoesFiltradas.length) * 100).toFixed(0)
                            : 0}
                        % de Aproveitamento
                    </div>

                    <h3 style={{ marginTop: '30px', alignSelf: 'flex-start' }}>
                        📋 Gabarito de Revisão:
                    </h3>
                    <div style={{ width: '100%', textAlign: 'left', marginTop: '10px' }}>
                        {questoesFiltradas.map((q, idx) => {
                            const respUser = respostas[q.id] || 'Não respondida';
                            const acertoQuestao =
                                String(respUser).trim().toUpperCase() ===
                                String(q.respostaCorreta).trim().toUpperCase();

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
                                        <strong>Questão {idx + 1}:</strong> {q.enunciado}
                                    </p>
                                    <p style={{ margin: '5px 0 0 0' }}>
                                        👉 Sua resposta:{' '}
                                        <strong style={{ color: acertoQuestao ? 'green' : 'red' }}>
                                            {respUser}
                                        </strong>
                                    </p>
                                    <p style={{ margin: '2px 0 0 0' }}>
                                        ✅ Gabarito oficial:{' '}
                                        <strong style={{ color: 'green' }}>
                                            {q.respostaCorreta}
                                        </strong>
                                    </p>
                                    <p
                                        style={{
                                            fontStyle: 'italic',
                                            marginTop: '8px',
                                            fontSize: '0.9rem',
                                            color: '#555',
                                        }}>
                                        💡 Explicação: {q.comentario}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        onClick={reiniciarSimulado}
                        className={styles.btnProxima}
                        style={{ marginTop: '20px' }}>
                        Refazer Simulado
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Navbar />
            <header className={styles.header}>
                <h1 className={styles.logo}>Clube do Livro</h1>
            </header>

            {questoesFiltradas.length === 0 ? (
                <div className={styles.centralizado}>
                    Nenhuma questão carregada para o idioma: {abaAtiva}.
                </div>
            ) : (
                <div className={styles.mainGrid}>
                    <div className={styles.questaoCard}>
                        <div>
                            <span className={styles.contextoTxt}>
                                Selecione o idioma desejado para realizar as questões. (Seção{' '}
                                {abaAtiva})
                            </span>
                            <h2 className={styles.tituloQuestao}>
                                Questão {indiceAtual + 1} de {questoesFiltradas.length}
                            </h2>

                            {questaoAtual && (
                                <>
                                    <p className={styles.enunciado}>{questaoAtual.enunciado}</p>

                                    <div className={styles.alternativasLista}>
                                        {questaoAtual.alternativas.map((alt) => {
                                            const selecionada =
                                                respostas[questaoAtual.id] === alt.id;
                                            return (
                                                <button
                                                    key={alt.id}
                                                    onClick={() => selecionarAlternativa(alt.id)}
                                                    className={`${styles.alternativaBtn} ${selecionada ? styles.alternativaSelecionada : ''}`}>
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
                                onClick={() => setIndiceAtual((prev) => Math.max(prev - 1, 0))}
                                disabled={indiceAtual === 0}
                                className={styles.btnRevisar}>
                                Questão Anterior
                            </button>
                            <button
                                onClick={() =>
                                    setIndiceAtual((prev) =>
                                        Math.min(prev + 1, questoesFiltradas.length - 1),
                                    )
                                }
                                disabled={indiceAtual === questoesFiltradas.length - 1}
                                className={styles.btnProxima}>
                                Próxima Questão
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className={styles.mapaCard}>
                            <h3 className={styles.mapaTitulo}>Mapa de Questões ({abaAtiva})</h3>
                            <div className={styles.mapaGrid}>
                                {questoesFiltradas.map((q, index) => {
                                    const respondida = respostas[q.id] !== undefined;
                                    const ativa = index === indiceAtual;

                                    let classeBotao = styles.badgeQuestao;
                                    if (ativa) classeBotao += ` ${styles.badgeAtiva}`;
                                    else if (respondida)
                                        classeBotao += ` ${styles.badgeRespondida}`;

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
                                Finalizar Seção {abaAtiva}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Simulados;
