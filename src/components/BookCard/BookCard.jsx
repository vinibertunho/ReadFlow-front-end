import { Link } from 'react-router-dom';
import styles from './BookCard.module.css';

function BookCard({ dados }) {
    const {
        id,
        titulo,
        title,
        autor,
        author,
        capa_url,
        capaUrl,
        capa,
        genero_pt,
        generoPt,
        genero_en,
        generoEn,
        descricao_pt,
        descricaoPt,
        descricao_en,
        descricaoEn,
    } = dados || {};

    const tituloLivro = titulo || title || 'Título não disponível';
    const autorLivro = autor || author || 'Desconhecido';
    const capaLivro = capa_url || capaUrl || capa || '';
    const generoPT = genero_pt || generoPt;
    const generoEN = genero_en || generoEn;
    const descricaoPT = descricao_pt || descricaoPt || 'Sem descrição disponível.';
    const descricaoEN = descricao_en || descricaoEn || 'No description available.';
    const livroHref = id ? `/livro/${id}` : '/livro';

    function normalizeCover(url) {
        if (!url) return '';
        try {
            let s = String(url).trim();
            if (!/^https?:\/\//i.test(s)) s = 'https://' + s.replace(/^\/+/, '');
            // ibb.co short links -> try converting to i.ibb.co and change common bad extensions
            if (s.includes('ibb.co')) {
                s = s.replace('https://ibb.co/', 'https://i.ibb.co/').replace('http://ibb.co/', 'https://i.ibb.co/');
                s = s.replace(/\.peg$/i, '.png');
                if (!/\.(png|jpg|jpeg|gif)$/i.test(s)) s = s + '.png';
            }
            return s;
        } catch {
            return String(url);
        }
    }

    return (
        <Link to={livroHref} className={styles.card}>
            <div className={styles.capaWrapper}>
                <img
                    className={styles.foto}
                    src={normalizeCover(capaLivro) || 'https://via.placeholder.com/600x800?text=Capa+indispon%C3%ADvel'}
                    alt={`Capa de ${tituloLivro}`}
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/600x800?text=Capa+indispon%C3%ADvel'; }}
                />
            </div>

            <div className={styles.info}>
                <div className={styles.tags}>
                    {generoPT ? <span className={styles.genero}>{generoPT}</span> : null}
                    {generoEN ? <span className={styles.genero}>{generoEN}</span> : null}
                </div>

                <h2>{tituloLivro}</h2>
                <p className={styles.autor}>Por: {autorLivro}</p>

                <div className={styles.divisor} />

                <div style={{ marginBottom: '10px' }}>
                    <span className={styles.idiomaRotulo}>PORTUGUÊS</span>
                    <p className={styles.descricao}>{descricaoPT}</p>
                </div>

                <div>
                    <span className={styles.idiomaRotulo}>ENGLISH</span>
                    <p className={styles.descricao}>{descricaoEN}</p>
                </div>
            </div>
        </Link>
    );
}

export default BookCard;
