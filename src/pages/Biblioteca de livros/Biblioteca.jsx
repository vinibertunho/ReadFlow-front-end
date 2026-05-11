import { useEffect, useState } from 'react';
import styles from './Biblioteca.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Card from '../../components/Card/Card';

const BOOKS_URL = 'https://readflow-m8o6.onrender.com/api/livros';

function Biblioteca() {
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const controller = new AbortController();

		async function loadBooks() {
			try {
				setLoading(true);
				setError('');

				const response = await fetch(BOOKS_URL, {
					signal: controller.signal,
				});

				if (!response.ok) {
					throw new Error('Não foi possível carregar os livros agora.');
				}

				const data = await response.json();
				const normalizedBooks = Array.isArray(data)
					? data
					: data.books || data.items || data.data || [];

				setBooks(normalizedBooks);
			} catch (requestError) {
				if (requestError.name !== 'AbortError') {
					setError(requestError.message || 'Erro ao buscar livros.');
				}
			} finally {
				setLoading(false);
			}
		}

		loadBooks();

		return () => controller.abort();
	}, []);

	return (
		<div className={styles.page}>
			<Navbar />

			<main className={styles.main}>
				<header className={styles.header}>
					<span className={styles.kicker}>Biblioteca</span>
					<h1>Livros em destaque</h1>
					<p>
						Os cards desta seção são alimentados pela sua API em Render.
					</p>
				</header>

				{loading ? (
					<p className={styles.status}>Carregando livros...</p>
				) : error ? (
					<p className={styles.statusError}>{error}</p>
				) : (
					<section className={styles.grid}>
						{books.map((book) => (
							<Card key={book.id} book={book} />
						))}
					</section>
				)}
			</main>
		</div>
	);
}

export default Biblioteca;
