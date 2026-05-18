import './Vestibular.css';
import Navbar from '../../components/Navbar/Navbar.jsx';

const Vestibular = () => {
return (
    <div className="page-container">
    <Navbar />

            <main className="main-content">
                <header className="hero-banner">
                    <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1200" alt="Banner" className="hero-img" />
                    <div className="hero-content">
                        <span className="hero-tag">Guia de Estudos 2024</span>
                        <h1 className="hero-title">Dicas Estratégicas para<br />Vestibular: Capitães da Areia</h1>
                        <p className="hero-desc">Domine a obra de Jorge Amado com análise crítica e temas de redação para os principais exames.</p>
                    </div>
                </header>

                <div className="content-grid">
                    <section className="analysis-box">
                        <h2 className="section-title">Análise Estratégica do Texto</h2>
                        <div className="analysis-item">
                            <div className="number-badge">1</div>
                            <div>
                                <h4 className="item-title">Foco no Determinismo</h4>
                                <p className="item-text">Observe como Jorge Amado utiliza o ambiente do Trapiche para justificar as ações dos personagens.</p>
                            </div>
                        </div>
                        <div className="analysis-item">
                            <div className="number-badge">2</div>
                            <div>
                                <h4 className="item-title">A Oralidade na Narrativa</h4>
                                <p className="item-text">A linguagem é carregada de expressões baianas e gírias da época. Fique atento à variação linguística.</p>
                            </div>
                        </div>
                        <div className="analysis-item">
                            <div className="number-badge">3</div>
                            <div>
                                <h4 className="item-title">Religiosidade e Sincretismo</h4>
                                <p className="item-text">A relação entre o Padre José Pedro e as religiões de matriz africana é um ponto chave.</p>
                            </div>
                        </div>
                    </section>

                    <aside className="sidebar">
                        <div className="flash-dicas">
                            <h3 className="item-title">Dicas Flash</h3>
                            <ul className="item-text" style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '8px' }}>• Pedro Bala simboliza a liderança política.</li>
                                <li style={{ marginBottom: '8px' }}>• O Trapiche é um personagem coletivo.</li>
                                <li>• Dora representa a maternidade precoce.</li>
                            </ul>
                        </div>
                        <div className="podcast-card">
                            <h3 className="item-title">Podcast de Revisão</h3>
                            <p className="item-text" style={{ color: '#cbd5e1', fontSize: '0.7rem' }}>Ouça 15 min de resumo intensivo.</p>
                            <button className="podcast-btn">Ouvir Agora</button>
                        </div>
                    </aside>
                </div>

                <section>
                    <h2 className="section-title">Temas de Redação</h2>
                    <div className="themes-grid">
                        <div className="theme-card">
                            <span className="theme-label">TEMA 01</span>
                            <h4 className="item-title" style={{ marginTop: '1rem' }}>A invisibilidade do menor abandonado</h4>
                            <p className="item-text">Conecte o abandono dos Capitães com dados atuais.</p>
                        </div>
                        <div className="theme-card">
                            <span className="theme-label">TEMA 02</span>
                            <h4 className="item-title" style={{ marginTop: '1rem' }}>O papel das instituições punitivas</h4>
                            <p className="item-text">Analise a crítica ao reformatório e ao sistema moderno.</p>
                        </div>
                        <div className="theme-card">
                            <span className="theme-label">TEMA 03</span>
                            <h4 className="item-title" style={{ marginTop: '1rem' }}>A arte como ferramenta de resistência</h4>
                            <p className="item-text">Use o personagem "Professor" para discutir a educação.</p>
                        </div>
                    </div>
                </section>

                <footer className="footer-info">
                </footer>
            </main>
        </div>
    );
};

export default Vestibular;
