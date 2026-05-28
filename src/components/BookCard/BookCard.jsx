import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BookCard.module.css';

const CAPA_PADRAO =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="%23eef2ff"/><rect x="24" y="24" width="352" height="552" rx="16" fill="%23dbeafe"/><text x="200" y="300" text-anchor="middle" fill="%23334155" font-size="28" font-family="Arial">Sem capa</text></svg>';

function resolverUrlCapa(url) {
    if (!url || typeof url !== 'string') return '';
    const value = url.trim();
    if (!value) return '';

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

    // Normaliza autor quando a API retorna um objeto ao invés de string
    const autorLabel = typeof autor === 'string'
        ? autor
        : (autor && typeof autor === 'object')
            ? (autor.nome || autor.name || autor.autor || 'Desconhecido')
            : 'Desconhecido';

    // Garante que sinopse seja string antes de usar slice
    const sinopseText = typeof sinopse === 'string' ? sinopse : (sinopse && typeof sinopse === 'object' ? (sinopse.text || sinopse.descricao || JSON.stringify(sinopse)) : '');


    const capaImagem = resolverUrlCapa(capa_url || imagem_url || imagem || capas || foto || '');
    const [imgSrc, setImgSrc] = useState(capaImagem || CAPA_PADRAO);

    const r = dados?.avaliacao || dados?.media_avaliacao || dados?.avaliacao_media || 4.6;
    const rating = typeof r === 'number' ? r : parseFloat(r) || 4.6;

    const handleClick = () => {
        const criarSlug = (text) => {
            if (!text) return '';
            return String(text)
                .toLowerCase()
                .normalize('NFD')
                .replace(/\p{Diacritic}/gu, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        };

        const routeParam = id ? String(id) : criarSlug(titulo || dados?.title || dados?.tituloDoLivro || dados?.slug || '');
        if (routeParam) navigate(`/livro/${routeParam}`, { state: { livro: dados } });
    };

    return (
        <article className={styles.card} onClick={handleClick} style={{ cursor: 'pointer' }}>
            <div className={styles.media}> 
                {dados?.destaque && <span className={styles.badge}>Destaque</span>}
                <img
                    className={styles.foto}
                    src={imgSrc}
                    alt={titulo || 'Capa'}
                    onError={() => setImgSrc(CAPA_PADRAO)}
                />
            </div>

            <div className={styles.info}>
                <div className={styles.tags}>
                    {genero_pt || genero_en ? (
                        <span className={styles.genero}>{genero_pt || genero_en}</span>
                    ) : null}
                </div>

                <h2 className={styles.titulo}>{titulo || 'Título não disponível'}</h2>
                <p className={styles.autor}>{autorLabel}</p>
                {(ano_publicacao || anoPublicacao) ? (
                    <p className={styles.autor}>{ano_publicacao || anoPublicacao}</p>
                ) : null}
                {sinopseText ? (
                    <p className={styles.autor}>{sinopseText.slice(0, 90)}...</p>
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
