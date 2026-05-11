import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './Livro.module.css';

const API_URL = "https://readflow-m8o6.onrender.com/api/livros";
const FALLBACK_COVER =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="%23eef2ff"/><rect x="24" y="24" width="352" height="552" rx="16" fill="%23dbeafe"/><text x="200" y="300" text-anchor="middle" fill="%23334155" font-size="28" font-family="Arial">Sem capa</text></svg>';

function resolveCoverUrl(url) {
    if (!url || typeof url !== 'string') return '';
    const value = url.trim();
    if (!value) return '';
    if (value.includes('ibb.co/') && !value.includes('i.ibb.co/')) return '';
    return value;
}

function Livro() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [livro, setLivro] = useState(location.state?.livro || null);
    const [carregando, setCarregando] = useState(!livro);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        // Se não temos os dados do livro, buscar da API
        if (!livro && id) {
            async function fetchLivro() {
                try {
                    setCarregando(true);
                    const response = await fetch(`${API_URL}/${id}`);
                    if (!response.ok) {
                        throw new Error('Livro não encontrado');
                    }
                    const data = await response.json();
                    setLivro(data);
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

    if (carregando) {
        return <div className={styles.corpo}><p style={{ textAlign: 'center', marginTop: '50px' }}>Carregando...</p></div>;
    }

    if (erro || !livro) {
        return (
            <div className={styles.corpo}>
                <div className={styles.container}>
                    <p>{erro || 'Livro não encontrado'}</p>
                    <button onClick={() => navigate(-1)} className={styles.botaoRoxo}>Voltar</button>
                </div>
            </div>
        );
    }

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
    } = livro;

    // Tenta puxar a capa de varios campos possiveis
    const capaImagem = resolveCoverUrl(capa_url || imagem_url || imagem || capas || foto || '');
    const ano = ano_publicacao || anoPublicacao;
    const rating = avaliacao || media_avaliacao || avaliacao_media || 4.6;
    const sinopseFinal = sinopse || descricao_pt || 'Sinopse não disponível.';

    return (
        <div className={styles.corpo}>
            <div className={styles.container}>
                <button onClick={() => navigate(-1)} className={styles.voltarBtn}>
                    ← Voltar ao catálogo
                </button>

                <div className={styles.secaoTopo}>
                    <img 
                        src={capaImagem || FALLBACK_COVER} 
                        alt={titulo}
                        className={styles.fotoLivro}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_COVER;
                        }}
                    />

                    <div className={styles.infoLivro}>
                        {(genero_pt || genero_en) && <span className={styles.tag}>{genero_pt || genero_en}</span>}
                        <h1 className={styles.titulo}>{titulo || 'Título não disponível'}</h1>
                        <p className={styles.autor}>por {autor || 'Desconhecido'}</p>

                        <div className={styles.rating}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <svg
                                    key={i}
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ marginRight: '4px' }}
                                >
                                    <path
                                        d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.17L12 18.896l-7.336 3.872 1.402-8.17L.132 9.21l8.2-1.192z"
                                        fill={i <= Math.round(rating) ? '#fbbf24' : '#e5e7eb'}
                                    />
                                </svg>
                            ))}
                            <span style={{ marginLeft: '8px', fontWeight: '600' }}>{rating.toFixed(1)}</span>
                        </div>

                        <div className={styles.metaInfo}>
                            {ano && <span>📅 {ano}</span>}
                            {paginas && <span>📄 {paginas} páginas</span>}
                            {genero_en && <span>🌍 {genero_en}</span>}
                        </div>
                    </div>
                </div>

                <div className={styles.blocoBranco}>
                    <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>Sinopse</h2>
                    <p className={styles.sinopse}>{sinopseFinal}</p>
                </div>

                {contexto_pt && (
                    <div className={styles.blocoBranco}>
                        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>Contexto</h2>
                        <p className={styles.sinopse}>{contexto_pt}</p>
                    </div>
                )}

                {detalhes_autor_pt && (
                    <div className={styles.blocoBranco}>
                        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>Detalhes do Autor</h2>
                        <p className={styles.sinopse}>{detalhes_autor_pt}</p>
                    </div>
                )}

                {estilo_escrita_pt && (
                    <div className={styles.blocoBranco}>
                        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>Estilo de Escrita</h2>
                        <p className={styles.sinopse}>{estilo_escrita_pt}</p>
                    </div>
                )}

                {verossimilhanca_pt && (
                    <div className={styles.blocoBranco}>
                        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>Verossimilhança</h2>
                        <p className={styles.sinopse}>{verossimilhanca_pt}</p>
                    </div>
                )}

                {caracteristicas_literarias_pt && (
                    <div className={styles.blocoBranco}>
                        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>Características Literárias</h2>
                        <p className={styles.sinopse}>{caracteristicas_literarias_pt}</p>
                    </div>
                )}

                {conclusao_pt && (
                    <div className={styles.blocoBranco}>
                        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>Conclusão</h2>
                        <p className={styles.sinopse}>{conclusao_pt}</p>
                    </div>
                )}

                {descricao_en && (
                    <div className={styles.blocoBranco}>
                        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>Description (EN)</h2>
                        <p className={styles.sinopse}>{descricao_en}</p>
                    </div>
                )}

                {contexto_en && (
                    <div className={styles.blocoBranco}>
                        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>Context (EN)</h2>
                        <p className={styles.sinopse}>{contexto_en}</p>
                    </div>
                )}

                {detalhes_autor_en && (
                    <div className={styles.blocoBranco}>
                        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>Author Details (EN)</h2>
                        <p className={styles.sinopse}>{detalhes_autor_en}</p>
                    </div>
                )}

                {estilo_escrita_en && (
                    <div className={styles.blocoBranco}>
                        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>Writing Style (EN)</h2>
                        <p className={styles.sinopse}>{estilo_escrita_en}</p>
                    </div>
                )}

                {verossimilhanca_en && (
                    <div className={styles.blocoBranco}>
                        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>Verisimilitude (EN)</h2>
                        <p className={styles.sinopse}>{verossimilhanca_en}</p>
                    </div>
                )}

                {caracteristicas_literarias_en && (
                    <div className={styles.blocoBranco}>
                        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>Literary Features (EN)</h2>
                        <p className={styles.sinopse}>{caracteristicas_literarias_en}</p>
                    </div>
                )}

                {conclusao_en && (
                    <div className={styles.blocoBranco}>
                        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>Conclusion (EN)</h2>
                        <p className={styles.sinopse}>{conclusao_en}</p>
                    </div>
                )}

                {video_url && (
                    <div className={styles.blocoBranco}>
                        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>Video</h2>
                        <a href={video_url} target="_blank" rel="noreferrer">Assistir video</a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Livro;
