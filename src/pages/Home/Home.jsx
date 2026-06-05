import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Home.module.css';
import criancasCorrendo from '../../assets/criancas.jpg';
import capa from '../../assets/capa.png';
import { ExternalLink, Library } from 'lucide-react';
import { useIdioma } from '../../context/IdiomaContext';

const API_SOBRE_PROJETO_URL = 'https://readflow-m8o6.onrender.com/api/sobre-projeto';
const API_KEY = import.meta.env.VITE_API_KEY;
const AUTH_HEADERS = {
    'Content-Type': 'application/json',
    ...(API_KEY ? { 'x-api-key': API_KEY, Authorization: `Bearer ${API_KEY}` } : {}),
};

// Extrai título e texto do /api/sobre-projeto tolerando diferentes formatos de resposta
function extrairSobreProjeto(resposta, en) {
    if (!resposta) return null;
    let dado = resposta.data ?? resposta;
    if (Array.isArray(dado)) dado = dado[0];
    if (!dado || typeof dado !== 'object') return null;

    const pick = (...chaves) => {
        for (const c of chaves) {
            const v = dado[c];
            if (typeof v === 'string' && v.trim()) return v.trim();
        }
        return '';
    };

    const titulo = en
        ? pick('titulo_en', 'title_en', 'title', 'titulo', 'nome')
        : pick('titulo', 'titulo_pt', 'title', 'nome');
    const texto = en
        ? pick(
              'descricao_en',
              'description_en',
              'conteudo_en',
              'content_en',
              'texto_en',
              'descricao',
              'description',
              'conteudo',
              'content',
              'texto',
          )
        : pick(
              'descricao_pt',
              'descricao',
              'description',
              'conteudo',
              'content',
              'texto',
              'descricao_en',
              'description_en',
          );

    if (!titulo && !texto) return null;
    return { titulo, texto };
}

const OBRA_DESTAQUE_SLUG = import.meta.env.VITE_OBRA_DESTAQUE_SLUG || 'capitaes-da-areia';
const OBRA_DESTAQUE_TITULO = import.meta.env.VITE_OBRA_DESTAQUE_TITULO || 'Capitães da Areia';
const OBRA_DESTAQUE_AUTOR = import.meta.env.VITE_OBRA_DESTAQUE_AUTOR || 'Jorge Amado';
const OBRA_DESTAQUE_RESUMO_PT =
    import.meta.env.VITE_OBRA_DESTAQUE_RESUMO ||
    'Acompanhe a vida dos meninos de rua que lutam pela sobrevivência nas ruas de Salvador.';
const OBRA_DESTAQUE_RESUMO_EN =
    import.meta.env.VITE_OBRA_DESTAQUE_RESUMO_EN ||
    'Follow the lives of street children who fight for survival on the streets of Salvador.';

function criarTextos(idioma) {
    return {
            autorLabel: idioma === 'PT' ? 'Obra de Jorge Amado' : 'Work by Jorge Amado',
            titulo: OBRA_DESTAQUE_TITULO,
            resumo: idioma === 'PT' ? OBRA_DESTAQUE_RESUMO_PT : OBRA_DESTAQUE_RESUMO_EN,
            explorar: idioma === 'PT' ? 'Explorar Obra' : 'Explore Book',

            apresentacaoTitulo: idioma === 'PT' ? 'Apresentação do Projeto' : 'Project Overview',
            apresentacaoTexto:
                idioma === 'PT'
                    ? 'Apresentação do projeto aqui (parte do povo do sesi)'
                    : 'Project presentation here (by the SESI team)',

            cardExplorar: idioma === 'PT' ? 'Explorar obra' : 'Explore the book',
            cardExplorarDesc:
                idioma === 'PT'
                    ? 'Acompanhe a narrativa desde a vida no Trapiche até os destinos traçados pelo bando liderado por Pedro Bala.'
                    : "Follow the story from life at the Trapiche to the destinies shaped by Pedro Bala's gang.",
            cardExplorarLink: idioma === 'PT' ? 'Ler Análise →' : 'Read Analysis →',

            cardEquipe: idioma === 'PT' ? 'Equipe' : 'Team',
            cardEquipeDesc:
                idioma === 'PT'
                    ? 'Conheça os desenvolvedores e mentes criativas por trás deste projeto integrador.'
                    : 'Meet the developers and creative minds behind this integrative project.',
            cardEquipeLink: idioma === 'PT' ? 'Conhecer →' : 'Meet them →',

            cardVestibular: idioma === 'PT' ? 'Vestibulandos' : 'Exam Students',
            cardVestibularDesc:
                idioma === 'PT'
                    ? 'Encontre cronogramas, análises dos principais vestibulares e tudo o que você precisa para gabaritar a prova.'
                    : 'Find schedules, analyses of major exams and everything you need to ace the test.',
            cardVestibularLink: idioma === 'PT' ? 'Estudar →' : 'Study →',

            cardSimulados: idioma === 'PT' ? 'Simulados e Quizes' : 'Mock Exams & Quizzes',
            cardSimuladosDesc:
                idioma === 'PT'
                    ? 'Teste seus conhecimentos com questões exclusivas e prepare-se para o formato real dos exames.'
                    : 'Test your knowledge with exclusive questions and prepare for the real exam format.',
            cardSimuladosLink: idioma === 'PT' ? 'Ver testes →' : 'View tests →',

            cardVideoaulas: idioma === 'PT' ? 'Videoaulas' : 'Video Lessons',
            cardVideoaulasDesc:
                idioma === 'PT'
                    ? 'Assista a resumos em vídeo, análises de personagens e explicações detalhadas sobre o contexto histórico.'
                    : 'Watch video summaries, character analyses and detailed explanations about the historical context.',
            cardVideoaulasLink: idioma === 'PT' ? 'Ver Galeria →' : 'View Gallery →',

            cardCuriosidades: idioma === 'PT' ? 'Curiosidades e Dicas' : 'Fun Facts & Tips',
            cardCuriosidadesDesc:
                idioma === 'PT'
                    ? 'Descubra segredos dos bastidores da obra, fatos sobre Jorge Amado e dicas valiosas de última hora para o seu estudo.'
                    : 'Discover behind-the-scenes secrets, facts about Jorge Amado and valuable last-minute study tips.',
            cardCuriosidadesLink: idioma === 'PT' ? 'Explorar →' : 'Explore →',

            frase:
                idioma === 'PT'
                    ? '"Eram os donos do trapiche e da cidade, pois a cidade de Salvador lhes pertencia por direito, a eles que não tinham nada e tinham tudo."'
                    : '"They owned the warehouse and the city, for the city of Salvador belonged to them by right — to those who had nothing and yet had everything."',
            fraseAutor: '— Jorge Amado, 1937',

            bibliotecaTitulo: idioma === 'PT' ? 'Biblioteca de Livros' : 'Book Library',
            bibliotecaDesc:
                idioma === 'PT'
                    ? 'O universo literário não para por aqui. Conheça e explore as análises completas de outras obras incríveis desenvolvidas pelas equipes do projeto.'
                    : "The literary universe doesn't stop here. Discover and explore the complete analyses of other incredible works developed by the project teams.",
            bibliotecaBtn: idioma === 'PT' ? 'Acessar Acervo Completo' : 'Access Full Collection',
        };
}

export default function Home() {
    const { idioma } = useIdioma();

    const livroPrincipal = { slug: OBRA_DESTAQUE_SLUG };

    // Textos traduzidos, atualizados via useEffect sempre que o idioma muda
    const [t, setT] = useState(() => criarTextos(idioma));

    useEffect(() => {
        setT(criarTextos(idioma));
    }, [idioma]);

    // Conteúdo do "Sobre o Projeto" vindo da API (com fallback no texto padrão)
    const [sobreProjeto, setSobreProjeto] = useState(null);

    useEffect(() => {
        let ativo = true;
        async function carregarSobreProjeto() {
            try {
                const res = await fetch(API_SOBRE_PROJETO_URL, { headers: AUTH_HEADERS });
                if (!res.ok) return;
                const json = await res.json();
                if (ativo) setSobreProjeto(json);
            } catch (e) {
                console.warn('[Home] Erro ao buscar /api/sobre-projeto:', e.message);
            }
        }
        carregarSobreProjeto();
        return () => {
            ativo = false;
        };
    }, []);

    const sobre = extrairSobreProjeto(sobreProjeto, idioma !== 'PT');
    const apresentacaoTitulo = sobre?.titulo || t.apresentacaoTitulo;
    const apresentacaoParagrafos = (sobre?.texto || t.apresentacaoTexto)
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean);

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
                            <h4>{t.autorLabel}</h4>
                            <h1>{t.titulo}</h1>
                            <p>{t.resumo}</p>
                            <Link
                                to={`/livro/${livroPrincipal.slug}`}
                                className={styles.botaoExplorar}>
                                {t.explorar}
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
                        <h3>{apresentacaoTitulo}</h3>
                        {apresentacaoParagrafos.map((paragrafo, i) => (
                            <p key={i}>{paragrafo}</p>
                        ))}
                    </div>

                    <div className={styles.cards}>
                        <Link to={`/livro/${livroPrincipal.slug}`} className={styles.explorarObra}>
                            <h4>{t.cardExplorar}</h4>
                            <p>{t.cardExplorarDesc}</p>
                            <p>{t.cardExplorarLink}</p>
                        </Link>

                        <Link to="/equipe" className={styles.equipe}>
                            <h4>{t.cardEquipe}</h4>
                            <p>{t.cardEquipeDesc}</p>
                            <p>{t.cardEquipeLink}</p>
                        </Link>

                        <Link to="/vestibular" className={styles.vestibulandos}>
                            <h4>{t.cardVestibular}</h4>
                            <p>{t.cardVestibularDesc}</p>
                            <p>{t.cardVestibularLink}</p>
                        </Link>

                        <Link to="/simulados" className={styles.simulados}>
                            <h4>{t.cardSimulados}</h4>
                            <p>{t.cardSimuladosDesc}</p>
                            <p>{t.cardSimuladosLink}</p>
                        </Link>

                        <Link to="/videoaulas" className={styles.videoaulas}>
                            <h4>{t.cardVideoaulas}</h4>
                            <p>{t.cardVideoaulasDesc}</p>
                            <p>{t.cardVideoaulasLink}</p>
                        </Link>

                        <Link to="/curiosidades" className={styles.curiosidades}>
                            <h4>{t.cardCuriosidades}</h4>
                            <p>{t.cardCuriosidadesDesc}</p>
                            <p>{t.cardCuriosidadesLink}</p>
                        </Link>
                    </div>
                </section>

                <section className={styles.biblioteca}>
                    <div className={styles.fraseBonitaAesthetic}>
                        <h6>{t.frase}</h6>
                        <p>{t.fraseAutor}</p>
                    </div>

                    <div className={styles.containerBibliotecaCard}>
                        <Link to="/biblioteca" className={styles.cardzaoBiblioteca}>
                            <div className={styles.conteudoCardzao}>
                                <h3>{t.bibliotecaTitulo}</h3>
                                <p>{t.bibliotecaDesc}</p>
                                <span className={styles.botaoCardzao}>
                                    {t.bibliotecaBtn} <ExternalLink size={20} />
                                </span>
                            </div>

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
