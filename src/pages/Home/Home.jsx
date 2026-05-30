import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Home.module.css';
import criancasCorrendo from '../../assets/criancas.jpg';
import capa from '../../assets/capa.png';
import { ExternalLink } from 'lucide-react';

export default function Home() {
    const [titulo] = useState('Capitães da Areia');
    const [livroPrincipal] = useState({
        resumo: 'Acompanhe a vida dos meninos de rua que lutam pela sobrevivência nas ruas de Salvador.',
    });
    const [livro] = useState({
        titulo: 'Capitães da Areia',
        autor: 'Jorge Amado',
    });

    const obterClasseLink = (path) => {
            return location.pathname === path ? `${styles.navLink} ${styles.active}` : styles.navLink;
        };

    return (
        <>
            <Navbar />

            <main className={styles.homeContainer}>
                <section className={styles.header}>
                    <div className={styles.conteudoHeader}>
                        <div className={styles.capaLivro}>
                            <img
                                src={capa}
                                alt="Capa do livro Capitães de Areia"
                                className={styles.coverImage}
                            />
                        </div>

                        <div className={styles.textoHeader}>
                            <h4>Obra de Jorge Amado</h4>
                            <h1>{titulo}</h1>
                            <p>{livroPrincipal.resumo || 'resumo do livro aqui rs'}</p>
                            <li>
                                <Link to="/livro" className={obterClasseLink('/livro')}>
                                    <button>Explorar Obra</button>
                                </Link>
                            </li>

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

                <section className={styles.cardsSection}>
                    <div className={styles.cards}>
                        <Link
                            to={`/livro/${livroPrincipal.slug || livroPrincipal.titulo?.toLowerCase().replace(/\s+/g, '-') || 'livro'}`}
                            className={styles.explorarObra}
                        >
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

                            <Link to="/biblioteca" className={styles.verTodos}>
                                Ver Todos <ExternalLink size={25} />
                            </Link>
                        </div>

                        <div className={styles.cardsLivro}>
                            <Link to="/biblioteca">
                                <div className={styles.capaLivroBiblioteca}>
                                    <img src={capa} alt={livro.titulo} />
                                </div>

                                <div className={styles.infoLivro}>
                                    <h4>{livro.titulo}</h4>
                                    <span>{livro.autor || 'Autor desconhecido'}</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
