import './Vestibular.css';
const Vestibular = () => {
    return (
        <div className="page-container">
            <nav className="navbar">
                <div className="logo">Clube do Livro</div>
                <div className="nav-links">
                    <a href="#" className="nav-link">
                        Início
                    </a>
                    <a href="#" className="nav-link">
                        Biblioteca
                    </a>
                    <a href="#" className="nav-link">
                        Explorar obra
                    </a>
                    <a href="#" className="nav-link active">
                        Vestibulandos
                    </a>
                    <a href="#" className="nav-link">
                        Quiz
                    </a>
                </div>
                <div className="nav-lang">PT/EN 🌐</div>
            </nav>

            <main className="main-content">
                <header className="hero-banner">
                    <img
                        src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1200"
                        alt="Banner"
                        className="hero-img"
                    />
                    <div className="hero-content">
                        <span className="hero-tag">Guia de Estudos 2026</span>
                        <h1 className="hero-title">
                            Dicas Estratégicas para
                            <br />
                            Vestibular: Capitães da Areia
                        </h1>
                        <p className="hero-desc">
                            Domine a obra de Jorge Amado com análise crítica e temas de redação para
                            os principais exames.
                        </p>
                    </div>
                </header>

                <div className="content-grid">
                    <section className="analysis-box">
                        <h2 className="section-title">Análise Estratégica do Texto</h2>
                        <div className="analysis-item">
                            <div className="number-badge">1</div>
                            <div>
                                <h4 className="item-title">Foco no Determinismo</h4>
                                <p className="item-text">
                                    Observe como Jorge Amado utiliza o ambiente do Trapiche para
                                    justificar as ações dos personagens.
                                </p>
                            </div>
                        </div>
                        <div className="analysis-item">
                            <div className="number-badge">2</div>
                            <div>
                                <h4 className="item-title">A Oralidade na Narrativa</h4>
                                <p className="item-text">preencher</p>
                            </div>
                        </div>
                        <div className="analysis-item">
                            <div className="number-badge">3</div>
                            <div>
                                <h4 className="item-title">Religiosidade e Sincretismo</h4>
                                <p className="item-text">preencher</p>
                            </div>
                        </div>
                    </section>

                    <aside className="sidebar">
                        <div className="flash-dicas">
                            <h3 className="item-title">Dicas Flash</h3>
                            <ul className="item-text" style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '8px' }}>preencher</li>
                                <li style={{ marginBottom: '8px' }}>preencher</li>
                                <li> preencher</li>
                            </ul>
                        </div>
                        <div className="podcast-card">
                            <h3 className="item-title">Podcast de Revisão</h3>
                            <p
                                className="item-text"
                                style={{ color: '#cbd5e1', fontSize: '0.7rem' }}>
                                Ouça 15 min de resumo intensivo.
                            </p>
                            <button className="podcast-btn">Ouvir Agora</button>
                        </div>
                    </aside>
                </div>

                <section>
                    <h2 className="section-title">Temas de Redação</h2>
                    <div className="themes-grid">
                        <div className="theme-card">
                            <span className="theme-label">TEMA 01</span>
                            <h4 className="item-title" style={{ marginTop: '1rem' }}>
                                preencher
                            </h4>
                            <p className="item-text">preencher</p>
                        </div>
                        <div className="theme-card">
                            <span className="theme-label">TEMA 02</span>
                            <h4 className="item-title" style={{ marginTop: '1rem' }}>
                                preencher
                            </h4>
                            <p className="item-text">preencher</p>
                        </div>
                        <div className="theme-card">
                            <span className="theme-label">TEMA  03 </span>
                            <h4 className="item-title" style={{ marginTop: '1rem' }}>
                                preencher
                            </h4>
                            <p className="item-text">preencher</p>
                        </div>
                    </div>
                </section>

                <footer className="footer-info">
                    <div className="footer-content">
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                            Dicas de Interpretação
                        </h2>
                        <p className="item-text" style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                            preencher
                        </p>
                        <div className="interpret-card">
                            <h5
                                style={{
                                    fontSize: '0.7rem',
                                    color: '#60a5fa',
                                    textTransform: 'uppercase',
                                }}>
                                preencher
                            </h5>
                            <p className="item-text" style={{ color: '#e2e8f0' }}>
                                preencher
                            </p>
                        </div>
                    </div>
                    <div className="important-badge">
                        <h6 style={{ marginBottom: '4px' }}>IMPORTANTE!</h6>
                        <p style={{ fontSize: '0.6rem' }}>preencher</p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Vestibular;
