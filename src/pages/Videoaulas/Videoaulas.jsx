import { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './Videoaulas.css';

const Videoaulas = () => {
    const [videoAtivo, setVideoAtivo] = useState(1);

    const playlist = [
        {
            id: 1,
            titulo: 'Aula 01: Introdução à Geração de 30 e Jorge Amado',
            duracao: '15:20',
            videoUrl: 'https://www.youtube.com/embed/rGWF3ZsZPYs',
            startTime: 0, // Começa em 1:09 (1 * 60 + 9)
            descricao:
                'Nesta aula introdutória, exploramos o contexto histórico da Bahia em 1930 e as motivações de Jorge Amado ao escrever uma das obras mais viscerais da literatura brasileira.',
        },
        {
            id: 2,
            titulo: 'Aula 02: O Trapiche como Espaço Social e Determinismo',
            duracao: '18:45',
            videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
            startTime: 0, // Começa do início (0 segundos)
            descricao:
                'Analisamos como o Trapiche funciona como um personagem coletivo e de que forma o ambiente molda o destino dos meninos, aplicando conceitos de determinismo social.',
        },
        {
            id: 3,
            titulo: 'Aula 03: Análise dos Personagens: De Pedro Bala a Dora',
            duracao: '22:10',
            videoUrl: 'https://www.youtube.com/embed/Ys7-6_t7OEQ',
            startTime: 0, // Exemplo: Começa em 2:30 (2 * 60 + 30)
            descricao:
                'Um mergulho na construção psicológica dos líderes dos Capitães da Areia e o impacto da chegada de Dora no grupo.',
        },
        {
            id: 4,
            titulo: 'Aula 04: Linguagem, Oralidade e Sincretismo Religioso',
            duracao: '14:35',
            videoUrl: 'https://www.youtube.com/embed/YVkUvmDQ3HY',
            startTime: 0,
            descricao:
                'Como a variação linguística e as religiões de matriz africana aparecem no texto como forma de resistência cultural e identidade.',
        },
    ];

    const aulaAtual = playlist.find((v) => v.id === videoAtivo);

    const videoSrcComTempo = aulaAtual.startTime
        ? `${aulaAtual.videoUrl}?start=${aulaAtual.startTime}`
        : aulaAtual.videoUrl;

    return (
        <div className="readflow-wrapper">
            <Navbar paginaAtiva="videoaulas" />

            <main className="readflow-main">
                <div className="video-hero-grid">
                    <div className="player-block">
                        <div className="video-aspect-box">
                            <iframe
                                src={videoSrcComTempo} 
                                title={aulaAtual.titulo}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen></iframe>
                        </div>

                        <div className="video-meta-details">
                            <span className="meta-tag">Módulo Vestibulares</span>
                            <h1 className="main-video-title">{aulaAtual.titulo}</h1>
                            <p className="main-video-description">{aulaAtual.descricao}</p>
                        </div>
                    </div>

                    <aside className="sidebar-playlist">
                        <div className="playlist-top-info">
                            <h3>Grade de Aulas</h3>
                            <p>Capitães da Areia - Jorge Amado</p>
                        </div>

                        <div className="playlist-items">
                            {playlist.map((video) => (
                                <div
                                    key={video.id}
                                    className={`playlist-row ${
                                        videoAtivo === video.id ? 'is-playing' : ''
                                    }`}
                                    onClick={() => setVideoAtivo(video.id)}>
                                    <span className="row-number">
                                        {videoAtivo === video.id ? '▶' : `0${video.id}`}
                                    </span>
                                    <div className="row-text">
                                        <h4>{video.titulo}</h4>
                                        <span>⏱ {video.duracao}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>

                <section className="support-section">
                    <h2 className="section-subtitle">Materiais e Diretrizes de Estudo</h2>
                    <div className="support-cards-grid">
                        <div className="support-card">
                            <span className="card-badge">PDF</span>
                            <h3>Slides Completos da Aula</h3>
                            <p>
                                Esquema visual com os principais tópicos, citações marcantes e eixos
                                temáticos prontos para revisão.
                            </p>
                            <button className="card-action-btn">Acessar Material →</button>
                        </div>
                        <div className="support-card">
                            <span className="card-badge">Exercícios</span>
                            <h3>Simulado Comentado</h3>
                            <p>
                                Questões selecionadas dos últimos vestibulares com gabarito
                                analítico detalhado pelo time pedagógico.
                            </p>
                            <button className="card-action-btn">Abrir Caderno →</button>
                        </div>
                    </div>
                </section>

                <footer className="video-footer-accent">
                    <div className="footer-left-info">
                        <h2>Dicas de Desempenho</h2>
                        <p className="footer-subtext">
                            Como fixar o conteúdo assistido para a sua prova:
                        </p>
                        <div className="footer-tip-box">
                            <h5>Anote Citações Diretas</h5>
                            <p>
                                Frases como "A cidade os repudiava..." guardam forte valor
                                argumentativo para redações de temas sobre desigualdade social.
                            </p>
                        </div>
                    </div>
                    <div className="footer-badge-red">
                        <h6>Aviso Importante</h6>
                        <p>
                            Não se esqueça de correlacionar a obra com o Modernismo de Segunda
                            Geração (Geração de 30).
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Videoaulas;
