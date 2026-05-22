import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Home.module.css';
import criancasCorrendo from '../../assets/criancas.jpg';
import { ExternalLink } from 'lucide-react';

const API_URL = 'https://readflow-m8o6.onrender.com/api/livros';

const FALLBACK_COVER =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="%23eef2ff"/><rect x="24" y="24" width="352" height="552" rx="16" fill="%23dbeafe"/><text x="200" y="300" text-anchor="middle" fill="%23334155" font-size="28" font-family="Arial">Sem capa</text></svg>';

const resolveCoverUrl = (url) => {
    if (!url || url.trim() === '') return FALLBACK_COVER;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }
    return `https://readflow-m8o6.onrender.com${url.startsWith('/') ? '' : '/'}${url}`;
};

function Home() {
    const [livros, setLivros] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'projetoamods',
                'x-api-key': 'projetoamods',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setLivros(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Erro ao buscar livros:', err);
                setLoading(false);
            });
    }, []);

    const libroPrincipal = livros[0] || {};

    const getCapa = (livro) => {
        if (!livro) return '';
        return (
            livro.capa_url || livro.imagem_url || livro.imagem || livro.capas || livro.foto || ''
        );
    };

    const capaImagemPrincipal = resolveCoverUrl(getCapa(libroPrincipal));
    const tituloPrincipal = libroPrincipal.titulo || 'Capitães da Areia';

    return (
        <>
            <Navbar />

            <main className={styles.homeContainer}>
                <section className={styles.header}>
                    <div className={styles.conteudoHeader}>
                        <div className={styles.capaLivro}>
                            {!loading && (
                                <img
                                    src={capaImagemPrincipal}
                                    alt={tituloPrincipal}
                                    className={styles.coverImage}
                                    onError={(event) => {
                                        event.currentTarget.onerror = null;
                                        event.currentTarget.src = FALLBACK_COVER;
                                    }}
                                />
                            )}
                        </div>

                        <div className={styles.textoHeader}>
                            <h4>Obra de Jorge Amado</h4>

                            <h1>{tituloPrincipal}</h1>

                            <p>{libroPrincipal.resumo || 'resumo do livro aqui rs'}</p>

                            <Link to="/livro" className={styles.button}>
                                <button>
                                    <p>Explorar mais</p>
                                </button>
                            </Link>
                        </div>

                        <div className={styles.criancasCorrendo}>
                            <img
                                src={criancasCorrendo}
                                alt="Crianças correndo"
                                className={styles.criancas}
                            />
                        </div>
                    </div>
                </section>

                <section className={styles.destaques}>
                    <div className={styles.apresentacao}>
                        <h3>Apresentação do Projeto</h3>
                        <p>Apresentacao do projeto aqui</p>
                    </div>

                    <div className={styles.cards}>
                        <Link to="/livro" className={styles.explorarObra}>
                            <h4>Explorar obra</h4>
                            <p>Acompanhe a narrativa...</p>
                            <p>Ler Análise → </p>
                        </Link>

                        <Link to="/equipe" className={styles.equipe}>
                            <h4>Equipe</h4>
                            <p>Conheça a equipe por trás do projeto...</p>
                            <p>Conhecer → </p>
                        </Link>

                        <Link to="/vestibular" className={styles.vestibulandos}>
                            <h4>Vestibulandos</h4>
                            <p>Página dedicada aos vestibulandos...</p>
                            <p>Estudar → </p>
                        </Link>

                        <Link to="/simulados" className={styles.simulados}>
                            <h4>Simulados e Quizes</h4>
                            <p>Uooooou</p>
                            <p>Ver testes → </p>
                        </Link>

                        <Link to="/videoaulas" className={styles.videoaulas}>
                            <h4>Videoaulas</h4>
                            <p>Assista às videoaulas...</p>
                            <p>Ver Galeria → </p>
                        </Link>

                        <Link to="/curiosidades" className={styles.curiosidades}>
                            <h4>Curiosidades e Dicas</h4>
                            <p>Descubra curiosidades sobre o autor e a obra...</p>
                            <p>Explorar → </p>
                        </Link>
                    </div>
                </section>

                <section className={styles.biblioteca}>
                    <div className={styles.fraseBonitaAesthetic}>
                        <h6>
                            "Eram os donos do trapiche e da cidade, pois a cidade de Salvador lhes
                            pertencia por direito, a eles que não tinham nada e tinham tudo."
                        </h6>

                        <p> — Jorge Amado, 1937 </p>
                    </div>

                    <div className={styles.bibliotecaRealOficial}>
                        <div className={styles.topBiblioteca}>
                            <div>
                                <h3>Biblioteca de Livros</h3>
                                <p>Explore as obras analisadas por outras equipes do projeto.</p>
                            </div>

                            <a href="#" className={styles.verTodos}>
                                Ver Todos <ExternalLink size={16} />
                            </a>
                        </div>

                        <div className={styles.cardsLivro}>
                            {!loading &&
                                livros.map((livro) => {
                                    const capaItem = resolveCoverUrl(getCapa(livro));
                                    const slug =
                                        livro.slug ||
                                        livro.titulo
                                            ?.toLowerCase()
                                            .normalize('NFD')
                                            .replace(/[\u0300-\u036f]/g, '')
                                            .replace(/[^a-z0-9]+/g, '-') ||
                                        livro.id;

                                    return (
                                        <Link
                                            to={`/${slug}`}
                                            key={livro.id || livro._id}
                                            className={styles.cardLivro}>
                                            <div className={styles.capaLivroBiblioteca}>
                                                <img
                                                    src={capaItem}
                                                    alt={livro.titulo}
                                                    onError={(event) => {
                                                        event.currentTarget.onerror = null;
                                                        event.currentTarget.src = FALLBACK_COVER;
                                                    }}
                                                />
                                            </div>

                                            <div className={styles.infoLivro}>
                                                <h4>{livro.titulo}</h4>
                                                <span>
                                                    {livro.autor ||
                                                        livro.escritor ||
                                                        'Autor desconhecido'}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Home;
