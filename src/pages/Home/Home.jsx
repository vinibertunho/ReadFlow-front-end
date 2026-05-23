import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Home.module.css';
import criancasCorrendo from '../../assets/criancas.jpg';
import { ExternalLink } from 'lucide-react';

const URL_API = 'https://readflow-m8o6.onrender.com/api/livros';
const CAPA_PADRAO =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="%23eef2ff"/><rect x="24" y="24" width="352" height="552" rx="16" fill="%23dbeafe"/><text x="200" y="300" text-anchor="middle" fill="%23334155" font-size="28" font-family="Arial">Sem capa</text></svg>';

const resolverUrlCapa = (url) => {
    if (!url) return '';
    return url;
};

function Home() {
    const [livros, setLivros] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(URL_API)
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

    const livroPrincipal = livros[0] || {};

    const capaUrlOriginal =
        livroPrincipal.capa_url ||
        livroPrincipal.imagem_url ||
        livroPrincipal.imagem ||
        livroPrincipal.capas ||
        livroPrincipal.foto ||
        '';

    const capaImagem = resolverUrlCapa(capaUrlOriginal);
    const titulo = livroPrincipal.titulo || 'Capitães da Areia';

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
                                        event.currentTarget.src = CAPA_PADRAO;
                                    }}
                                />
                            )}
                        </div>

                        <div className={styles.textoHeader}>
                            <h4>Obra de Jorge Amado</h4>
                            <h1>{titulo}</h1>
                            <p>{livroPrincipal.resumo || 'resumo do livro aqui rs'}</p>
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
                        <p>
                            Este projeto está sendo feito como uma atividade que liga o instituto
                            Sesi com Senai, como meio de aprendizagem entres as duas instituições,
                            utilizando a prática dos dois lados. O projeto consiste em uma
                            biblioteca virtual onde temos somente livros do vestibular, como foco do
                            nosso grupo sendo o livro "Capitães da areia".
                        </p>
                    </div>

                    <div className={styles.cards}>
                        <Link to="/livro" className={styles.explorarObra}>
                            <h4>Explorar obra</h4>
                            <p>
                                Acompanhe a narrativa desde a vida no Trapiche até os destinos
                                traçados pelo bando liderado por Pedro Bala.
                            </p>
                            <p>Ler Análise → </p>
                        </Link>

                        <Link to="/equipe" className={styles.equipe}>
                            <h4>Equipe</h4>
                            <p>
                                Conheça os desenvolvedores e mentes criativas por trás deste projeto
                                integrador.
                            </p>
                            <p>Conhecer → </p>
                        </Link>

                        <Link to="/vestibular" className={styles.vestibulandos}>
                            <h4>Vestibulandos</h4>
                            <p>
                                Encontre cronogramas, análises dos principais vestibulares e tudo o
                                que você precisa para gabaritar a prova.
                            </p>
                            <p>Estudar → </p>
                        </Link>

                        <Link to="/simulados" className={styles.simulados}>
                            <h4>Simulados e Quizes</h4>
                            <p>
                                Teste seus conhecimentos com questões exclusivas e prepare-se para o
                                formato real dos exames.
                            </p>
                            <p>Ver testes → </p>
                        </Link>

                        <Link to="/videoaulas" className={styles.videoaulas}>
                            <h4>Videoaulas</h4>
                            <p>
                                Assista a resumos em vídeo, análises de personagens e explicações
                                detalhadas sobre o contexto histórico.
                            </p>
                            <p>Ver Galeria → </p>
                        </Link>

                        <Link to="/curiosidades" className={styles.curiosidades}>
                            <h4>Curiosidades e Dicas</h4>
                            <p>
                                Descubra segredos dos bastidores da obra, fatos sobre Jorge Amado e
                                dicas valiosas de última hora para o seu estudo.
                            </p>
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

                            <Link
                                to="/biblioteca"
                                className={styles.verTodos}
                                onClick={() => setActiveLink('/biblioteca')}>
                                Ver Todos <ExternalLink size={25} />
                            </Link>
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
