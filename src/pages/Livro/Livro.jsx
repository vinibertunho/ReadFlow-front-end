
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './Livro.module.css';

const API_URL = 'https://readflow-m8o6.onrender.com/api/livros';
const FALLBACK_COVER =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="%23eef2ff"/><rect x="24" y="24" width="352" height="552" rx="16" fill="%23dbeafe"/><text x="200" y="300" text-anchor="middle" fill="%23334155" font-size="28" font-family="Arial">Sem capa</text></svg>';

function resolveCoverUrl(url) {
    if (!url || typeof url !== 'string') return '';
    const value = url.trim();
    if (!value) return '';
    if (value.includes('ibb.co/') && !value.includes('i.ibb.co/')) return '';
    return value;
}

function firstText(...values) {
    return values.find((value) => typeof value === 'string' && value.trim())?.trim() || '';
}

function normalizeParagraphs(value) {
    if (!value) return [];
    if (Array.isArray(value)) {
        return value
            .flatMap((item) => String(item).split(/\n+/))
            .map((item) => item.trim())
            .filter(Boolean);
    }

    if (typeof value === 'string') {
        return value
            .split(/\n+|\s*;\s*/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
}

function Livro() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [livro, setLivro] = useState(location.state?.livro || null);
    const [carregando, setCarregando] = useState(!livro);
    const [erro, setErro] = useState(null);

    const [listaPersonagens, setListaPersonagens] = useState(() =>
        normalizeParagraphs(
            location.state?.livro?.personagens ||
                location.state?.livro?.personagens_pt ||
                location.state?.livro?.personagens_en ||
                ''
        )
    );

    useEffect(() => {
        if (!livro && id) {
            async function fetchLivro() {
                try {
                    setCarregando(true);
                    const key = import.meta.env.VITE_API_KEY_LOCAL || import.meta.env.VITE_API_KEY;
                    const options = {};
                    if (key) options.headers = { 'x-api-key': key };
                    const response = await fetch(`${API_URL}/${id}`, options);
                    if (!response.ok) {
                        throw new Error('Livro não encontrado');
                    }
                    const data = await response.json();
                    setLivro(data);
                    setListaPersonagens(
                        normalizeParagraphs(data?.personagens || data?.personagens_pt || data?.personagens_en || '')
                    );
                } catch (error) {
                    setErro(error.message);
                    console.error('Erro ao buscar livro:', error);
                } finally {
                    setCarregando(false);
                }
            }

            fetchLivro();
        }
    }, [id, livro]);

    const data = livro || {};

    const {
        titulo,
        autor,
        capa_url,
        imagem,
        imagem_url,
        capas,
        foto,
        genero_pt,
        genero_en,
        sinopse,
        descricao_pt,
        descricao_en,
        contexto_pt,
        contexto_en,
        detalhes_autor_pt,
        detalhes_autor_en,
        estilo_escrita_pt,
        estilo_escrita_en,
        verossimilhanca_pt,
        verossimilhanca_en,
        caracteristicas_literarias_pt,
        caracteristicas_literarias_en,
        conclusao_pt,
        conclusao_en,
        video_url,
        ano_publicacao,
        anoPublicacao,
        paginas,
        avaliacao,
        media_avaliacao,
        avaliacao_media,
        criadoEm,
        atualizadoEm,
    } = data;

    const capaImagem = resolveCoverUrl(capa_url || imagem_url || imagem || capas || foto || '');
    const ano = ano_publicacao || anoPublicacao;
    const rating = Number(avaliacao || media_avaliacao || avaliacao_media || 4.6);
    const resumo = firstText(sinopse, descricao_pt, descricao_en);
    const contexto = firstText(contexto_pt, contexto_en);
    const detalhesAutor = firstText(detalhes_autor_pt, detalhes_autor_en);
    const estilo = firstText(estilo_escrita_pt, estilo_escrita_en);
    const verossimilhanca = firstText(verossimilhanca_pt, verossimilhanca_en);
    const caracteristicas = firstText(caracteristicas_literarias_pt, caracteristicas_literarias_en);
    const conclusao = firstText(conclusao_pt, conclusao_en);

    // Analysis fields for the 'Análise da obra' tab
    const analiseTexto = firstText(detalhesAutor, conclusao, resumo, contexto);
    const simbolismoLines = normalizeParagraphs(caracteristicas || '');
    const engajamentoLines = normalizeParagraphs(detalhesAutor || estilo || '');
    const temasLines = normalizeParagraphs(contexto || caracteristicas || '');

    // Tabs: ensure 'Personagens' and 'Contexto histórico' tabs are present
    const hasFicha = Boolean(
        detalhesAutor || estilo || verossimilhanca || caracteristicas || conclusao || paginas || ano
    );

    const tabs = [];
    if (resumo) tabs.push({ id: 'resumo', label: 'Resumo' });
    // always include personagens and contexto tabs (content may be empty)
    tabs.push({ id: 'personagens', label: 'Personagens' });
    tabs.push({ id: 'contexto', label: 'Contexto histórico' });
    if (hasFicha) tabs.push({ id: 'ficha', label: 'Ficha técnica' });
    if (video_url) tabs.push({ id: 'video', label: 'Vídeo' });
    tabs.push({ id: 'dados', label: 'Análise da obra' });

    const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'dados');

    if (carregando) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <p className={styles.status}>Carregando livro...</p>
                </div>
            </div>
        );
    }

    if (erro || !livro) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <p className={styles.error}>{erro || 'Livro não encontrado'}</p>
                    <button onClick={() => navigate(-1)} className={styles.botaoRoxo}>Voltar</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <button onClick={() => navigate(-1)} className={styles.voltarBtn}>
                    ← Voltar ao catálogo
                </button>

                <section className={styles.hero}>
                    <div className={styles.coverCard}>
                        {capaImagem ? (
                            <img
                                src={capaImagem}
                                alt={titulo || 'Capa do livro'}
                                className={styles.coverImage}
                                onError={(event) => {
                                    event.currentTarget.onerror = null;
                                    event.currentTarget.src = FALLBACK_COVER;
                                }}
                            />
                        ) : (
                            <div className={styles.coverFallback}>Sem capa</div>
                        )}
                    </div>

                    <div className={styles.heroContent}>
                        {(genero_pt || genero_en) && <span className={styles.tag}>{genero_pt || genero_en}</span>}
                        <h1 className={styles.title}>{titulo || 'Título não disponível'}</h1>
                        

                        <div className={styles.ratingRow}>
                            <div className={styles.ratingStars} aria-hidden>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <svg key={i} viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.17L12 18.896l-7.336 3.872 1.402-8.17L.132 9.21l8.2-1.192z"
                                            fill={i <= Math.round(rating) ? '#fbbf24' : '#e5e7eb'}
                                        />
                                    </svg>
                                ))}
                            </div>
                            <span className={styles.ratingNumber}>{Number.isFinite(rating) ? rating.toFixed(1) : '4.6'}</span>
                        </div>

                        <div className={styles.metaInfo}>
                            {ano && <span>📅 {ano}</span>}
                            {paginas && <span>📄 {paginas} páginas</span>}
                            {genero_en && <span>🌍 {genero_en}</span>}
                            {autor && <span>Autor: <strong>{autor}</strong></span>}
                        </div>

                        <div className={styles.actions}>
                            {video_url && (
                                <a className={styles.primaryButton} href={video_url} target="_blank" rel="noreferrer">
                                    Assistir vídeo
                                </a>
                            )}
                            <button className={styles.secondaryButton} onClick={() => navigate('/biblioteca')}>
                                Ver catálogo
                            </button>
                        </div>
                    </div>
                </section>

                <main className={styles.main}>
                    <div className={styles.tabsBar} role="tablist" aria-label="Seções do livro">
                        {tabs.map((t) => (
                            <button
                                key={t.id}
                                role="tab"
                                aria-selected={activeTab === t.id}
                                className={activeTab === t.id ? styles.tabActive : styles.tab}
                                onClick={() => setActiveTab(t.id)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div className={styles.tabContent}>
                        {activeTab === 'resumo' && resumo && (
                            <section className={styles.introCard}>
                                <h2 className={styles.sectionTitle}>Resumo da obra</h2>
                                <p className={styles.fieldValue}>{resumo}</p>
                            </section>
                        )}

                        {activeTab === 'personagens' && (
                            <section className={styles.introCard}>
                                <h2 className={styles.sectionTitle}>Personagens</h2>
                                {listaPersonagens.length > 0 ? (
                                    <ul className={styles.list}>
                                        {listaPersonagens.map((personagem) => (
                                            <li key={personagem}>{personagem}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div />
                                )}
                            </section>
                        )}

                        {activeTab === 'contexto' && (
                            <section className={styles.introCard}>
                                <h2 className={styles.sectionTitle}>Contexto histórico</h2>
                                {contexto ? <p className={styles.fieldValue}>{contexto}</p> : <div />}
                            </section>
                        )}

                        {activeTab === 'ficha' && hasFicha && (
                            <section className={styles.grid}>
                                {contexto && (
                                    <article className={styles.field}>
                                        <p className={styles.fieldLabel}>Contexto</p>
                                        <p className={styles.fieldValue}>{contexto}</p>
                                    </article>
                                )}
                                {detalhesAutor && (
                                    <article className={styles.field}>
                                        <p className={styles.fieldLabel}>Sobre o autor</p>
                                        <p className={styles.fieldValue}>{detalhesAutor}</p>
                                    </article>
                                )}
                                {estilo && (
                                    <article className={styles.field}>
                                        <p className={styles.fieldLabel}>Estilo de escrita</p>
                                        <p className={styles.fieldValue}>{estilo}</p>
                                    </article>
                                )}
                                {verossimilhanca && (
                                    <article className={styles.field}>
                                        <p className={styles.fieldLabel}>Verossimilhança</p>
                                        <p className={styles.fieldValue}>{verossimilhanca}</p>
                                    </article>
                                )}
                                {caracteristicas && (
                                    <article className={styles.field}>
                                        <p className={styles.fieldLabel}>Características literárias</p>
                                        <p className={styles.fieldValue}>{caracteristicas}</p>
                                    </article>
                                )}
                                {conclusao && (
                                    <article className={styles.field}>
                                        <p className={styles.fieldLabel}>Conclusão</p>
                                        <p className={styles.fieldValue}>{conclusao}</p>
                                    </article>
                                )}
                            </section>
                        )}

                        {activeTab === 'video' && video_url && (
                            <section className={styles.introCard}>
                                <h2 className={styles.sectionTitle}>Vídeo</h2>
                                <a href={video_url} target="_blank" rel="noreferrer">Assistir vídeo</a>
                            </section>
                        )}

                        {activeTab === 'dados' && (
                            <section>
                                {analiseTexto && (
                                    <div className={styles.analysisIntro}>
                                        <p className={styles.fieldValue}>{analiseTexto}</p>
                                    </div>
                                )}

                                <div className={styles.analysisGrid}>
                                    <div className={styles.analysisCard}>
                                        <h3 className={styles.analysisCardTitle}>Simbolismo</h3>
                                        <div className={styles.analysisCardContent}>
                                            {simbolismoLines.length > 0 ? (
                                                simbolismoLines.map((line, idx) => (
                                                    <p key={idx} className={styles.fieldValue}>{line}</p>
                                                ))
                                            ) : (
                                                <div />
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.analysisCard}>
                                        <h3 className={styles.analysisCardTitle}>Engajamento</h3>
                                        <div className={styles.analysisCardContent}>
                                            {engajamentoLines.length > 0 ? (
                                                engajamentoLines.map((line, idx) => (
                                                    <p key={idx} className={styles.fieldValue}>{line}</p>
                                                ))
                                            ) : (
                                                <div />
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.analysisCard}>
                                        <h3 className={styles.analysisCardTitle}>Temas chave</h3>
                                        <div className={styles.analysisCardContent}>
                                            {temasLines.length > 0 ? (
                                                temasLines.map((line, idx) => (
                                                    <p key={idx} className={styles.fieldValue}>{line}</p>
                                                ))
                                            ) : (
                                                <div />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.introCard}>
                                    <h2 className={styles.sectionTitle}>Metadados</h2>
                                    <ul className={styles.list}>
                                        {titulo && <li><strong>Título:</strong> {titulo}</li>}
                                        {autor && <li><strong>Autor:</strong> {autor}</li>}
                                        {ano && <li><strong>Ano:</strong> {ano}</li>}
                                        {criadoEm && <li><strong>Criado em:</strong> {new Date(criadoEm).toLocaleDateString('pt-BR')}</li>}
                                        {atualizadoEm && <li><strong>Atualizado em:</strong> {new Date(atualizadoEm).toLocaleDateString('pt-BR')}</li>}
                                    </ul>
                                </div>
                            </section>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Livro;
