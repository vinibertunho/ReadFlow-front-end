import { Link } from 'react-router-dom';
import styles from './Card.module.css';

function Card({ book, image, title, author, category, alt, description }) {
	const volumeInfo = book?.volumeInfo;
	const coverImage =
		book?.capa_url ||
		volumeInfo?.imageLinks?.thumbnail ||
		volumeInfo?.imageLinks?.smallThumbnail ||
		image ||
		'';
	const bookTitle = book?.titulo || volumeInfo?.title || title || 'Título indisponível';
	const bookAuthor = book?.autor || volumeInfo?.authors?.join(', ') || author || 'Autor não informado';
	const bookCategory = book?.genero_pt || volumeInfo?.categories?.[0] || category;
	const bookDescription = book?.sinopse || book?.descricao_pt || description || volumeInfo?.description || 'Descrição indisponível.';
	const bookAlt = alt || book?.titulo || volumeInfo?.title || title || 'Capa do livro';
	const normalizedCover = coverImage ? String(coverImage).replace(/^http:\/\//, 'https://') : '';
	const bookId = book?.id || volumeInfo?.id;

	return (
		<article className={styles.card}>
			<div className={styles.coverWrap}>
				{bookCategory ? <span className={styles.category}>{bookCategory}</span> : null}
				{normalizedCover ? (
					<img className={styles.cover} src={normalizedCover} alt={bookAlt} />
				) : (
					<div className={styles.coverFallback} aria-hidden="true">
						<span>Sem capa</span>
					</div>
				)}
			</div>

			<div className={styles.content}>
				<h3 className={styles.title}>{bookTitle}</h3>
				<p className={styles.description}>{bookDescription}</p>

				<div className={styles.footerCard}>
					<div className={styles.meta}>
						<span className={styles.cardHint}>Autor</span>
						<strong className={styles.author}>{bookAuthor}</strong>
					</div>
					<Link className={styles.button} to={`/livro/${bookId}`}>
						Ver detalhes
					</Link>
				</div>
			</div>
		</article>
	);
}

export default Card;
