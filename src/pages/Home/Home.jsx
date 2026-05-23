import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Home.module.css';
import criancasCorrendo from '../../assets/criancas.jpg';

const URL_API = 'https://readflow-m8o6.onrender.com/api/livros';
const CAPA_PADRAO =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="%23eef2ff"/><rect x="24" y="24" width="352" height="552" rx="16" fill="%23dbeafe"/><text x="200" y="300" text-anchor="middle" fill="%23334155" font-size="28" font-family="Arial">Sem capa</text></svg>';

const resolverUrlCapa = (url) => {
    if (!url) return '';
    return url;
};

function Home() {
    const [livros, setLivros] = useState([]);

    useEffect(() => {
        fetch(URL_API)
            .then((res) => res.json())
            .then((data) => {
                setLivros(data);
            })
            .catch((err) => {
                console.error('Erro ao buscar livros:', err);
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
                            {capaImagem ? (
                                <img
                                    src={capaImagem}
                                    alt={titulo}
                                    className={styles.coverImage}
                                    onError={(event) => {
                                        event.currentTarget.onerror = null;
                                        event.currentTarget.src = CAPA_PADRAO;
                                    }}
                                />
                            ) : (
                                <div className={styles.coverFallback}>Sem capa</div>
                            )}
                        </div>
                        <div className={styles.textoHeader}>
                            <h4>Obra de Jorge Amado</h4>
                            <h1>{titulo}</h1>
                            <p>{livroPrincipal.resumo || 'resumo do livro aqui rs'}</p>
                            <button>Explorar mais</button>
                        </div>
                        <div className={styles.criancasCorrendo}>
                            <img src={criancasCorrendo} alt="Crianças correndo" className={styles.criancas} />
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
                        <h3>Biblioteca de Livros</h3>
                        <p>Explore as obras analisadas por outras equipes do projeto.</p>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Home;
