import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Home.module.css';
import criancasCorrendo from '../../assets/criancas.jpg';
import capa from '../../assets/capa.png';
import { ExternalLink, Library } from 'lucide-react';

const OBRA_DESTAQUE_SLUG = import.meta.env.VITE_OBRA_DESTAQUE_SLUG || 'capitaes-da-areia';
const OBRA_DESTAQUE_TITULO = import.meta.env.VITE_OBRA_DESTAQUE_TITULO || 'Capitães da Areia';
const OBRA_DESTAQUE_AUTOR = import.meta.env.VITE_OBRA_DESTAQUE_AUTOR || 'Jorge Amado';
const OBRA_DESTAQUE_RESUMO =
    import.meta.env.VITE_OBRA_DESTAQUE_RESUMO ||
    'Acompanhe a vida dos meninos de rua que lutam pela sobrevivência nas ruas de Salvador.';

export default function Home() {
    const [titulo] = useState(OBRA_DESTAQUE_TITULO);
    const [livroPrincipal] = useState({
        slug: OBRA_DESTAQUE_SLUG,
        resumo: OBRA_DESTAQUE_RESUMO,
    });
    const [livro] = useState({
        titulo: OBRA_DESTAQUE_TITULO,
        autor: OBRA_DESTAQUE_AUTOR,
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
                                <Link to={`/livro/${livroPrincipal.slug || OBRA_DESTAQUE_SLUG}`} className={obterClasseLink(`/livro/${livroPrincipal.slug || OBRA_DESTAQUE_SLUG}`)}>
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

                {/* Seção 'destaques' agrupando a Apresentação e os Cards */}
                <section className={styles.destaques}>
                    <div className={styles.apresentacao}>
                        <h3>Apresentação do Projeto</h3>
                        <p>Apresentação do projeto aqui (partedo povo do sesi)</p>
                    </div>

                    <div className={styles.cards}>
                        <Link
                            to={`/livro/${livroPrincipal.slug || OBRA_DESTAQUE_SLUG}`}
                            className={styles.explorarObra}
                        >
                            <h4>Explorar obra</h4>
                            <p>
                                Acompanhe a narrativa desde a vida no Trapiche até os destinos
                                traçados pelo bando liderado por Pedro Bala.
                            </p>
                            <p>Ler Análise &rarr; </p>
                        </Link>

                        <Link to="/equipe" className={styles.equipe}>
                            <h4>Equipe</h4>
                            <p>
                                Conheça os desenvolvedores e mentes criativas por trás deste projeto
                                integrador.
                            </p>
                            <p>Conhecer &rarr; </p>
                        </Link>

                        <Link to="/vestibular" className={styles.vestibulandos}>
                            <h4>Vestibulandos</h4>
                            <p>
                                Encontre cronogramas, análises dos principais vestibulares e tudo o
                                que você precisa para gabaritar a prova.
                            </p>
                            <p>Estudar &rarr; </p>
                        </Link>

                        <Link to="/simulados" className={styles.simulados}>
                            <h4>Simulados e Quizes</h4>
                            <p>
                                Teste seus conhecimentos com questões exclusivas e prepare-se para o
                                formato real dos exames.
                            </p>
                            <p>Ver testes &rarr; </p>
                        </Link>

                        <Link to="/videoaulas" className={styles.videoaulas}>
                            <h4>Videoaulas</h4>
                            <p>
                                Assista a resumos em vídeo, análises de personagens e explicações
                                detalhadas sobre o contexto histórico.
                            </p>
                            <p>Ver Galeria &rarr; </p>
                        </Link>

                        <Link to="/curiosidades" className={styles.curiosidades}>
                            <h4>Curiosidades e Dicas</h4>
                            <p>
                                Descubra segredos dos bastidores da obra, fatos sobre Jorge Amado e
                                dicas valiosas de última hora para o seu estudo.
                            </p>
                            <p>Explorar &rarr; </p>
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

                    <div className={styles.containerBibliotecaCard}>
                        <Link to="/biblioteca" className={styles.cardzaoBiblioteca}>
                            <div className={styles.conteudoCardzao}>
                                <h3>Biblioteca de Livros</h3>
                                <p>
                                    O universo literário não para por aqui. Conheça e explore as análises 
                                    completas de outras obras incríveis desenvolvidas pelas equipes do projeto.
                                </p>
                                <span className={styles.botaoCardzao}>
                                    Acessar Acervo Completo <ExternalLink size={20} />
                                </span>
                            </div>
                            
                            {/* Troca dos espaços brancos por um ícone estilizado no CSS */}
                            <div className={styles.decoracaoIcone}>
                                <Library size={180} strokeWidth={1} />
                            </div>
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}