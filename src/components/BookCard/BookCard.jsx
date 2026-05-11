import { useState } from 'react';
import styles from './BookCard.module.css';

function BookCard({ dados }) {
    const {
        titulo,
        autor,
        capa_url,
        genero_pt,
        genero_en,
        descricao_pt,
        descricao_en,
    } = dados || {};

    const placeholder = 'https://via.placeholder.com/400x600?text=Sem+Capa';
    const [imgSrc, setImgSrc] = useState(capa_url || placeholder);

    return (
        <article className={styles.card}>
            <img
                className={styles.foto}
                src={imgSrc}
                alt={titulo || 'Capa'}
                onError={() => setImgSrc(placeholder)}
            />

            <div className={styles.info}>
                <div className={styles.tags}>
                    {genero_pt ? (
                        <span className={styles.genero}>{genero_pt}</span>
                    ) : null}
                    {genero_en ? (
                        <span className={styles.genero}>{genero_en}</span>
                    ) : null}
                </div>

                <h2>{titulo || 'Título não disponível'}</h2>
                <p className={styles.autor}>Por: {autor || 'Desconhecido'}</p>

                <div className={styles.divisor} />

                <div style={{ marginBottom: '10px' }}>
                    <span className={styles.idiomaRotulo}>PORTUGUÊS</span>
                    <p className={styles.descricao}>{descricao_pt || 'Sem descrição disponível.'}</p>
                </div>

                <div>
                    <span className={styles.idiomaRotulo}>ENGLISH</span>
                    <p className={styles.descricao}>{descricao_en || 'No description available.'}</p>
                </div>
            </div>
        </article>
    );
}

export default BookCard;