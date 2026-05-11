import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BookCard.module.css';

const FALLBACK_COVER =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="%23eef2ff"/><rect x="24" y="24" width="352" height="552" rx="16" fill="%23dbeafe"/><text x="200" y="300" text-anchor="middle" fill="%23334155" font-size="28" font-family="Arial">Sem capa</text></svg>';

function resolveCoverUrl(url) {
    if (!url || typeof url !== 'string') return '';
    const value = url.trim();
    if (!value) return '';
    // ibb.co geralmente aponta para uma pagina, nao para a imagem direta.
    if (value.includes('ibb.co/') && !value.includes('i.ibb.co/')) return '';
    return value;
}

function BookCard({ dados }) {
    const navigate = useNavigate();
    const {
        id,
        titulo,
        autor,
        anoPublicacao,
        ano_publicacao,
        sinopse,
        capa_url,
        imagem,
        imagem_url,
        capas,
        foto,
        genero_pt,
        genero_en,
    } = dados || {};

    // Tenta puxar a capa de varios campos possiveis
    const capaImagem = resolveCoverUrl(capa_url || imagem_url || imagem || capas || foto || '');
    const [imgSrc, setImgSrc] = useState(capaImagem || FALLBACK_COVER);

    const rating = useMemo(() => {
        const r = dados?.avaliacao || dados?.media_avaliacao || dados?.avaliacao_media || 4.6;
        return typeof r === 'number' ? r : parseFloat(r) || 4.6;
    }, [dados]);

    const handleClick = () => {
        if (id) {
            navigate(`/livro/${id}`, { state: { livro: dados } });
        }
    };

    return (
        <article className={styles.card} onClick={handleClick} style={{ cursor: 'pointer' }}>
            <div className={styles.media}> 
                {dados?.destaque && <span className={styles.badge}>Destaque</span>}
                <img
                    className={styles.foto}
                    src={imgSrc}
                    alt={titulo || 'Capa'}
                    onError={() => setImgSrc(FALLBACK_COVER)}
                />
            </div>

            <div className={styles.info}>
                <div className={styles.tags}>
                    {genero_pt || genero_en ? (
                        <span className={styles.genero}>{genero_pt || genero_en}</span>
                    ) : null}
                </div>

                <h2 className={styles.titulo}>{titulo || 'Título não disponível'}</h2>
                <p className={styles.autor}>{autor || 'Desconhecido'}</p>
                {(ano_publicacao || anoPublicacao) ? (
                    <p className={styles.autor}>{ano_publicacao || anoPublicacao}</p>
                ) : null}
                {sinopse ? (
                    <p className={styles.autor}>{sinopse.slice(0, 90)}...</p>
                ) : null}

                <div className={styles.ratingRow}>
                    <div className={styles.stars} aria-hidden>
                        {[1,2,3,4,5].map((i) => (
                            <svg key={i} viewBox="0 0 24 24" width="14" height="14" className={styles.star} xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.17L12 18.896l-7.336 3.872 1.402-8.17L.132 9.21l8.2-1.192z" fill={i <= Math.round(rating) ? '#f59e0b' : '#e6e6e6'} />
                            </svg>
                        ))}
                    </div>
                    <span className={styles.ratingNumber}>{rating.toFixed(1)}</span>
                </div>

            </div>
        </article>
    );
}

export default BookCard;