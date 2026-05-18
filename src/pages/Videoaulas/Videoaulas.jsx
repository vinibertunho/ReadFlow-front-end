import Navbar from '../../components/Navbar/Navbar';
import { useState } from 'react';

const VideoAulas = () => {
    <Navbar />
    // Estado para simular a troca de vídeos na playlist
    const [videoAtivo, setVideoAtivo] = useState(1);

    const playlist = [
        { id: 1, titulo: "Aula 01: Introdução à Geração de 30 e Jorge Amado", duracao: "15:20", ativa: true },
        { id: 2, titulo: "Aula 02: O Trapiche como Espaço Social e Determinismo", duracao: "18:45", ativa: false },
        { id: 3, titulo: "Aula 03: Análise dos Personagens: De Pedro Bala a Dora", duracao: "22:10", ativa: false },
        { id: 4, titulo: "Aula 04: Linguagem, Oralidade e Sincretismo Religioso", duracao: "14:35", ativa: false },
        { id: 5, titulo: "Aula 05: Como usar Capitães da Areia na Redação", duracao: "20:05", ativa: false },
    ];

    return (
        <div className="page-container">
            {/* --- Navbar --- */}
            <nav className="navbar">
                <div className="logo">Clube do Livro</div>
                <div className="nav-links">
                    <a href="#" className="nav-link">Início</a>
                    <a href="#" className="nav-link">Biblioteca</a>
                    <a href="#" className="nav-link">Explorar obra</a>
                    <a href="#" className="nav-link">Vestibulandos</a>
                    <a href="#" className="nav-link">Quiz</a>
                    <a href="#" className="nav-link active">Vídeos</a>
                </div>
                <div className="nav-lang">PT/EN 🌐</div>
            </nav>

            {/* --- Conteúdo Principal --- */}
            <main className="main-content">
                <div className="video-layout-grid">

                    {/* Coluna da Esquerda: Player e Detalhes */}
                    <section className="video-player-container">
                        <div className="video-player-mock">
                            {/* Aqui entraria o iframe do YouTube/Vimeo ou tag <video> */}
                            <div className="play-button-icon">▶</div>
                            <span className="video-time-indicator">Reproduzindo Aula {videoAtivo}</span>
                        </div>

                        <div className="video-info-box">
                            <span className="video-category-tag">Módulo Intensivo</span>
                            <h1 className="video-main-title">
                                {playlist.find(v => v.id === videoAtivo)?.titulo || "Capitães da Areia - Curso Completo"}
                            </h1>
                            <p className="video-description">
                                Nesta videoaula, analisamos em profundidade os aspetos sociopolíticos e as estruturas literárias exigidas pelos principais vestibulares. Descubra como contextualizar o ambiente histórico da Bahia na década de 1930.
                            </p>
                        </div>
                    </section>

                    {/* Coluna da Direita: Playlist */}
                    <aside className="playlist-container">
                        <h3 className="playlist-title">Conteúdo do Curso</h3>
                        <div className="playlist-scroll">
                            {playlist.map((video) => (
                                <div
                                    key={video.id}
                                    className={`playlist-item ${videoAtivo === video.id ? 'active' : ''}`}
                                    onClick={() => setVideoAtivo(video.id)}
                                >
                                    <div className="playlist-item-status">
                                        {videoAtivo === video.id ? '▶' : video.id}
                                    </div>
                                    <div className="playlist-item-info">
                                        <h4 className="playlist-item-name">{video.titulo}</h4>
                                        <span className="playlist-item-duration">⏱ {video.duracao}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>

                {/* --- Seção Inferior: Recursos e Apoio --- */}
                <section className="resources-section">
                    <h2 className="section-title">Materiais de Apoio & Downloads</h2>
                    <div className="resources-grid">
                        <div className="resource-card">
                            <div className="resource-icon">📁</div>
                            <div>
                                <h4 className="item-title">Slides da Aula (PDF)</h4>
                                <p className="item-text">Esquema visual com os principais tópicos e citações analisadas.</p>
                                <button className="download-btn">Baixar PDF</button>
                            </div>
                        </div>
                        <div className="resource-card">
                            <div className="resource-icon">📝</div>
                            <div>
                                <h4 className="item-title">Lista de Exercícios</h4>
                                <p className="item-text">10 questões de vestibulares anteriores com gabarito comentado.</p>
                                <button className="download-btn">Baixar Exercícios</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default VideoAulas;
