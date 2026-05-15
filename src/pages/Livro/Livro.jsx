import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './Livro.module.css';

const BOOKS_URL = 'https://readflow-m8o6.onrender.com/api/livros';

function Field({ label, children }) {
    if (!children) return null;
    return (
        <div className={styles.field}>
            <h4 className={styles.fieldLabel}>{label}</h4>
            <div className={styles.fieldValue}>{children}</div>
        </div>
    );
}

export default function Livro() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            try {
                setLoading(true);
                setError('');

                // CORREÇÃO: Mudado de aspas simples para crases (Template Literals)
                const url = id ? `${BOOKS_URL}/${id}` : BOOKS_URL;
                const res = await fetch(url, {
                    signal: controller.signal,
                });

                if (!res.ok) throw new Error('Não foi possível carregar o livro.');

                const data = await res.json();
                const selectedBook = Array.isArray(data)
                    ? data[0]
                    : data?.livro || data?.book || data;

                setBook(selectedBook);
            } catch (err) {
                if (err.name !== 'AbortError') setError(err.message || 'Erro');
            } finally {
                setLoading(false);
            }
        }

        load();
        return () => controller.abort();
    }, [id]);

    if (loading) return <div className={styles.container}><p className={styles.status}>Carregando livro...</p></div>;
    if (error) return <div className={styles.container}><p className={styles.error}>{error}</p></div>;
    if (!book) return <div className={styles.container}><p className={styles.status}>Nenhum livro encontrado.</p></div>;

    const data = book.volumeInfo || book;
    const rawCover = data.capa_url || data.imageLinks?.thumbnail || '';
    function normalizeCover(url) {
        if (!url) return '';
        let s = String(url).trim();
        if (!/^https?:\/\//i.test(s)) s = 'https://' + s.replace(/^\/+/, '');
        if (s.includes('ibb.co')) {
            s = s.replace('https://ibb.co/', 'https://i.ibb.co/').replace('http://ibb.co/', 'https://i.ibb.co/');
            s = s.replace(/\.peg$/i, '.png');
            if (!/\.(png|jpg|jpeg|gif)$/i.test(s)) s = s + '.png';
        }
        return s.replace(/^http:\/\//, 'https://');
    }
    const coverSrc = rawCover ? normalizeCover(rawCover) : '';

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Link to="/biblioteca" className={styles.backLink}>← Voltar</Link>

                <header className={styles.hero}>
                    <div className={styles.coverCard}>
                        {rawCover ? (
                            <img src={coverSrc} alt={data.titulo || data.title} className={styles.cover} />
                        ) : (
                            <div className={styles.coverFallback}>Sem capa</div>
                        )}
                    </div>

                    <div className={styles.heroInfo}>
                        <span className={styles.subtitle}>{data.genero_pt || data.genero_en || 'Biblioteca ReadFlow'}</span>
                        <h1 className={styles.title}>{data.titulo || data.title}</h1>
                        <p className={styles.author}>{data.autor || (data.authors && data.authors.join(', '))}</p>
                        <p className={styles.meta}>{data.anoPublicacao || data.publishedDate || ''}</p>

                        <div className={styles.heroActions}>
                            <a href="#conteudo" className={styles.primaryButton}>Ver conteúdo</a>
                            {data.video_url ? <a href={data.video_url} className={styles.secondaryButton} target="_blank" rel="noreferrer">Assistir vídeo</a> : null}
                        </div>
                    </div>
                </header>

                <main id="conteudo" className={styles.main}>
                    <section className={styles.introCard}>
                        <h2 className={styles.sectionTitle}>Visão geral</h2>
                        <Field label="Sinopse">{data.sinopse || data.description}</Field>
                    </section>

                    <section className={styles.grid}>
                        <Field label="Gênero (PT)">{data.genero_pt}</Field>
                        <Field label="Gênero (EN)">{data.genero_en}</Field>
                        <Field label="Contexto (PT)">{data.contexto_pt}</Field>
                        <Field label="Contexto (EN)">{data.contexto_en}</Field>
                        <Field label="Descrição (PT)">{data.descricao_pt}</Field>
                        <Field label="Descrição (EN)">{data.descricao_en}</Field>
                        <Field label="Detalhes do autor (PT)">{data.detalhes_autor_pt}</Field>
                        <Field label="Detalhes do autor (EN)">{data.detalhes_autor_en}</Field>
                        <Field label="Estilo de escrita (PT)">{data.estilo_escrita_pt}</Field>
                        <Field label="Estilo de escrita (EN)">{data.estilo_escrita_en}</Field>
                        <Field label="Verossimilhança (PT)">{data.verossimilhanca_pt}</Field>
                        <Field label="Verossimilhança (EN)">{data.verossimilhanca_en}</Field>
                        <Field label="Características literárias (PT)">{data.caracteristicas_literarias_pt}</Field>
                        <Field label="Características literárias (EN)">{data.caracteristicas_literarias_en}</Field>
                        <Field label="Conclusão (PT)">{data.conclusao_pt}</Field>
                        <Field label="Conclusão (EN)">{data.conclusao_en}</Field>
                    </section>

                    <section className={styles.listSection}>
                        <Field label="Personagens">
                            {book.personagens && book.personagens.length > 0 ? (
                                <ul className={styles.list}>
                                    {book.personagens.map((p) => (
                                        <li key={p.id}>{p.nome || p.nome_pt || JSON.stringify(p)}</li>
                                    ))}
                                </ul>
                            ) : (
                                '—'
                            )}
                        </Field>

                        <Field label="Quizzes">
                            {book.quizzes && book.quizzes.length > 0 ? (
                                <ul className={styles.list}>
                                    {book.quizzes.map((q) => (
                                        <li key={q.id}>{q.titulo || q.title || JSON.stringify(q)}</li>
                                    ))}
                                </ul>
                            ) : (
                                '—'
                            )}
                        </Field>

                        <Field label="Curiosidades">
                            {book.curiosidades && book.curiosidades.length > 0 ? (
                                <ul className={styles.list}>
                                    {book.curiosidades.map((c) => (
                                        <li key={c.id}>{c.titulo || c.title || JSON.stringify(c)}</li>
                                    ))}
                                </ul>
                            ) : (
                                '—'
                            )}
                        </Field>
                    </section>
                </main>
            </div>
        </div>
    );
}