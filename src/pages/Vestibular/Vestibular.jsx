import './Vestibular.css';
import Navbar from '../../components/Navbar/Navbar.jsx';
import { useNavigate } from 'react-router-dom';
import { useIdioma } from '../../context/IdiomaContext.jsx';

const Vestibular = () => {
    const navigate = useNavigate();
    const { idioma } = useIdioma();
    const en = idioma === 'EN';

    const t = {
        heroTag: en ? 'Study Guide 2024' : 'Guia de Estudos 2024',
        heroTitle: en
            ? 'Strategic Tips for\nExam Prep: Captains of the Sands'
            : 'Dicas Estratégicas para\nVestibular: Capitães da Areia',
        heroDesc: en
            ? "Master Jorge Amado's work with critical analysis and essay topics for the main exams."
            : 'Domine a obra de Jorge Amado com análise crítica e temas de redação para os principais exames.',

        analiseTitle: en ? 'Strategic Text Analysis' : 'Análise Estratégica do Texto',

        item1Title: en ? 'Focus on Determinism' : 'Foco no Determinismo',
        item1Text: en
            ? "Observe how Jorge Amado uses the Trapiche setting to justify the characters' actions."
            : 'Observe como Jorge Amado utiliza o ambiente do Trapiche para justificar as ações dos personagens.',

        item2Title: en ? 'Orality in the Narrative' : 'A Oralidade na Narrativa',
        item2Text: en
            ? 'The language is filled with Bahian expressions and slang of the era. Pay attention to linguistic variation.'
            : 'A linguagem é carregada de expressões baianas e gírias da época. Fique atento à variação linguística.',

        item3Title: en ? 'Religiosity and Syncretism' : 'Religiosidade e Sincretismo',
        item3Text: en
            ? 'The relationship between Father José Pedro and African-based religions is a key point.'
            : 'A relação entre o Padre José Pedro e as religiões de matriz africana é um ponto chave.',

        dicasTitle: en ? 'Quick Tips' : 'Dicas Flash',
        dica1: en
            ? '• Pedro Bala symbolizes political leadership.'
            : '• Pedro Bala simboliza a liderança política.',
        dica2: en
            ? '• The Trapiche is a collective character.'
            : '• O Trapiche é um personagem coletivo.',
        dica3: en
            ? '• Dora represents early motherhood.'
            : '• Dora representa a maternidade precoce.',

        videoTitle: en
            ? 'Watch the explanatory video lessons about the work, with complete analysis focused on entrance exams.'
            : 'Assista às videoaulas explicativas da obra, com análise completa e foco nos vestibulares.',
        videoSub: en ? 'Watch now' : 'Assistir agora',
        videoBtn: en ? 'Access' : 'Acessar',
    };

    return (
        <div className="page-container">
            <Navbar />

            <main className="main-content">
                <header className="hero-banner">
                    <img
                        src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1200"
                        alt="Banner"
                        className="hero-img"
                    />
                    <div className="hero-content">
                        <span className="hero-tag">{t.heroTag}</span>
                        <h1 className="hero-title">
                            {en ? (
                                <>
                                    Strategic Tips for
                                    <br />
                                    Exam Prep: Captains of the Sands
                                </>
                            ) : (
                                <>
                                    Dicas Estratégicas para
                                    <br />
                                    Vestibular: Capitães da Areia
                                </>
                            )}
                        </h1>
                        <p className="hero-desc">{t.heroDesc}</p>
                    </div>
                </header>

                <div className="content-grid">
                    <section className="analysis-box">
                        <h2 className="section-title">{t.analiseTitle}</h2>

                        <div className="analysis-item">
                            <div className="number-badge">1</div>
                            <div>
                                <h4 className="item-title">{t.item1Title}</h4>
                                <p className="item-text">{t.item1Text}</p>
                            </div>
                        </div>

                        <div className="analysis-item">
                            <div className="number-badge">2</div>
                            <div>
                                <h4 className="item-title">{t.item2Title}</h4>
                                <p className="item-text">{t.item2Text}</p>
                            </div>
                        </div>

                        <div className="analysis-item">
                            <div className="number-badge">3</div>
                            <div>
                                <h4 className="item-title">{t.item3Title}</h4>
                                <p className="item-text">{t.item3Text}</p>
                            </div>
                        </div>
                    </section>

                    <aside className="sidebar">
                        <div className="flash-dicas">
                            <h3 className="item-title">{t.dicasTitle}</h3>
                            <ul className="item-text" style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '8px' }}>{t.dica1}</li>
                                <li style={{ marginBottom: '8px' }}>{t.dica2}</li>
                                <li>{t.dica3}</li>
                            </ul>
                        </div>

                        <div className="videoaula-card">
                            <h3 className="item-title">{t.videoTitle}</h3>
                            <p
                                className="item-text"
                                style={{ color: '#cbd5e1', fontSize: '0.7rem' }}>
                                {t.videoSub}
                            </p>
                            <button
                                className="videoaula-btn"
                                onClick={() => navigate('/videoaulas')}>
                                {t.videoBtn}
                            </button>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default Vestibular;
