import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Home.module.css';
import criancasCorrendo from '../../assets/criancas.jpg';

const API_URL = 'https://readflow-m8o6.onrender.com/api/livros';
const FALLBACK_COVER =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="%23eef2ff"/><rect x="24" y="24" width="352" height="552" rx="16" fill="%23dbeafe"/><text x="200" y="300" text-anchor="middle" fill="%23334155" font-size="28" font-family="Arial">Sem capa</text></svg>';

const resolveCoverUrl = (url) => {
    if (!url) return '';
    return url;
};

function Home() {
    const [livros, setLivros] = useState([]);

    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => {
                setLivros(data);
            })
            .catch((err) => {
                console.error('Erro ao buscar livros:', err);
            });
    }, []);

    const libroPrincipal = livros[0] || {};

    const capaUrlOriginal =
        libroPrincipal.capa_url ||
        libroPrincipal.imagem_url ||
        libroPrincipal.imagem ||
        libroPrincipal.capas ||
        libroPrincipal.foto ||
        '';

    const capaImagem = resolveCoverUrl(capaUrlOriginal);
    const titulo = libroPrincipal.titulo || 'Capitães da Areia';

    return (
        <>
            <Navbar />
            <main className={styles.homeContainer}>
                <section className={styles.header}>
                    <div className={styles.conteudoHeader}>
                        <div className={styles.capaLivro}>
                            {capaImagem ? (
                                <img
                                    src={capaImagem}
                                    alt={titulo}
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
                        <div className={styles.textoHeader}>
                            <h4>Obra de Jorge Amado</h4>
                            <h1>{titulo}</h1>
                            <p>{libroPrincipal.resumo || 'resumo do livro aqui rs'}</p>
                            <button>Explorar mais</button>
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
                        <div className={styles.explorarObra}>
                            <h4>Explorar obra</h4>
                            <p>Acompanhe a narrativa...</p>
                            <p>Ler Análise → </p>
                        </div>
                        <div className={styles.equipe}>
                            <h4>Equipe</h4>
                            <p>Conheça a equipe por trás do projeto...</p>
                            <p>Conhecer → </p>
                        </div>
                        <div className={styles.vestibulandos}>
                            <h4>Vestibulandos</h4>
                            <p>Página dedicada aos vestibulandos...</p>
                            <p>Estudar → </p>
                        </div>
                        <div className={styles.simulados}>
                            <h4>Simulados e Quizes</h4>
                            <p>Uooooou</p>
                            <p>Ver testes → </p>
                        </div>
                        <div className={styles.videoaulas}>
                            <h4>Videoaulas</h4>
                            <p>Assista às videoaulas...</p>
                            <p>Ver Galeria → </p>
                        </div>
                        <div className={styles.curiosidades}>
                            <h4>Curiosidades e Dicas</h4>
                            <p>Descubra curiosidades sobre o autor e a obra...</p>
                            <p>Explorar → </p>
                        </div>
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
                                Ver Todos ↗
                            </a>
                        </div>

                        <div className={styles.cardsLivro}>
                            <div className={styles.cardLivro}>
                                <div className={styles.capaLivroBiblioteca}>
                                    <img
                                        src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop"
                                        alt="O Cortiço"
                                    />
                                </div>

                                <div className={styles.infoLivro}>
                                    <h4>O Cortiço</h4>
                                    <span>Aluísio Azevedo</span>
                                </div>
                            </div>

                            <div className={styles.cardLivro}>
                                <div className={styles.capaLivroBiblioteca}>
                                    <img
                                        src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1200&auto=format&fit=crop"
                                        alt="Dom Casmurro"
                                    />
                                </div>

                                <div className={styles.infoLivro}>
                                    <h4>Dom Casmurro</h4>
                                    <span>Machado de Assis</span>
                                </div>
                            </div>

                            <div className={styles.cardLivro}>
                                <div className={styles.capaLivroBiblioteca}>
                                    <img
                                        src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1200&auto=format&fit=crop"
                                        alt="Macunaíma"
                                    />
                                </div>

                                <div className={styles.infoLivro}>
                                    <h4>Macunaíma</h4>
                                    <span>Mário de Andrade</span>
                                </div>
                            </div>

                            <div className={styles.cardLivro}>
                                <div className={styles.capaLivroBiblioteca}>
                                    <img
                                    src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200&auto=format&fit=crop"
                                        alt="A Relíquia"
                                    />
                                </div>

                                <div className={styles.infoLivro}>
                                    <h4>A Relíquia</h4>
                                    <span>Eça de Queirós</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Home;
