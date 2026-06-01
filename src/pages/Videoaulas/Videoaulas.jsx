import { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './Videoaulas.css';
import { useIdioma } from '../../context/IdiomaContext';

const Videoaulas = () => {
    const [videoAtivo, setVideoAtivo] = useState(1);
    const { idioma } = useIdioma();
    const en = idioma === 'EN';

    const playlist = en
        ? [
              {
                  id: 1,
                  titulo: 'Lesson 01: Introduction to the Generation of 30 and Jorge Amado',
                  duracao: '15:20',
                  videoUrl: 'https://www.youtube.com/embed/rGWF3ZsZPYs',
                  startTime: 0,
                  descricao:
                      "In this introductory lesson, we explore the historical context of Bahia in 1930 and Jorge Amado's motivations for writing one of the most visceral works in Brazilian literature.",
              },
              {
                  id: 2,
                  titulo: 'Lesson 02: The Trapiche as Social Space and Determinism',
                  duracao: '18:45',
                  videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
                  startTime: 0,
                  descricao:
                      "We analyze how the Trapiche functions as a collective character and how the environment shapes the boys' destinies, applying concepts of social determinism.",
              },
              {
                  id: 3,
                  titulo: 'Lesson 03: Character Analysis: From Pedro Bala to Dora',
                  duracao: '22:10',
                  videoUrl: 'https://www.youtube.com/embed/Ys7-6_t7OEQ',
                  startTime: 0,
                  descricao:
                      "A deep dive into the psychological construction of the Captains of the Sands' leaders and the impact of Dora's arrival in the group.",
              },
              {
                  id: 4,
                  titulo: 'Lesson 04: Language, Orality and Religious Syncretism',
                  duracao: '14:35',
                  videoUrl: 'https://www.youtube.com/embed/YVkUvmDQ3HY',
                  startTime: 0,
                  descricao:
                      'How linguistic variation and African-based religions appear in the text as a form of cultural resistance and identity.',
              },
          ]
        : [
              {
                  id: 1,
                  titulo: 'Aula 01: Introdução à Geração de 30 e Jorge Amado',
                  duracao: '15:20',
                  videoUrl: 'https://www.youtube.com/embed/rGWF3ZsZPYs',
                  startTime: 0,
                  descricao:
                      'Nesta aula introdutória, exploramos o contexto histórico da Bahia em 1930 e as motivações de Jorge Amado ao escrever uma das obras mais viscerais da literatura brasileira.',
              },
              {
                  id: 2,
                  titulo: 'Aula 02: O Trapiche como Espaço Social e Determinismo',
                  duracao: '18:45',
                  videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
                  startTime: 0,
                  descricao:
                      'Analisamos como o Trapiche funciona como um personagem coletivo e de que forma o ambiente molda o destino dos meninos, aplicando conceitos de determinismo social.',
              },
              {
                  id: 3,
                  titulo: 'Aula 03: Análise dos Personagens: De Pedro Bala a Dora',
                  duracao: '22:10',
                  videoUrl: 'https://www.youtube.com/embed/Ys7-6_t7OEQ',
                  startTime: 0,
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

    const ui = {
        modulo: en ? 'Exam Module' : 'Módulo Vestibulares',
        gradeTitle: en ? 'Lesson Schedule' : 'Grade de Aulas',
        gradeSub: en ? 'Captains of the Sands - Jorge Amado' : 'Capitães da Areia - Jorge Amado',
        materiaisTitle: en ? 'Study Materials & Guidelines' : 'Materiais e Diretrizes de Estudo',

        card1Badge: 'PDF',
        card1Title: en ? 'Complete Lesson Slides' : 'Slides Completos da Aula',
        card1Desc: en
            ? 'Visual outline with the main topics, memorable quotes and thematic axes ready for review.'
            : 'Esquema visual com os principais tópicos, citações marcantes e eixos temáticos prontos para revisão.',
        card1Btn: en ? 'Access Material →' : 'Acessar Material →',

        card2Badge: en ? 'Exercises' : 'Exercícios',
        card2Title: en ? 'Commented Mock Exam' : 'Simulado Comentado',
        card2Desc: en
            ? 'Questions selected from recent exams with detailed analytical answer keys by the teaching team.'
            : 'Questões selecionadas dos últimos vestibulares com gabarito analítico detalhado pelo time pedagógico.',
        card2Btn: en ? 'Open Workbook →' : 'Abrir Caderno →',

        footerTitle: en ? 'Performance Tips' : 'Dicas de Desempenho',
        footerSub: en
            ? 'How to retain the content you watched for your exam:'
            : 'Como fixar o conteúdo assistido para a sua prova:',
        tipTitle: en ? 'Note Direct Quotes' : 'Anote Citações Diretas',
        tipText: en
            ? 'Phrases like "The city rejected them..." carry strong argumentative value for essays on social inequality themes.'
            : 'Frases como "A cidade os repudiava..." guardam forte valor argumentativo para redações de temas sobre desigualdade social.',

        alertTitle: en ? 'Important Notice' : 'Aviso Importante',
        alertText: en
            ? "Don't forget to connect the work with the Modernism of the Second Generation (Generation of 30)."
            : 'Não se esqueça de correlacionar a obra com o Modernismo de Segunda Geração (Geração de 30).',
    };

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
                                allowFullScreen
                            />
                        </div>

                        <div className="video-meta-details">
                            <span className="meta-tag">{ui.modulo}</span>
                            <h1 className="main-video-title">{aulaAtual.titulo}</h1>
                            <p className="main-video-description">{aulaAtual.descricao}</p>
                        </div>
                    </div>

                    <aside className="sidebar-playlist">
                        <div className="playlist-top-info">
                            <h3>{ui.gradeTitle}</h3>
                            <p>{ui.gradeSub}</p>
                        </div>

                        <div className="playlist-items">
                            {playlist.map((video) => (
                                <div
                                    key={video.id}
                                    className={`playlist-row ${videoAtivo === video.id ? 'is-playing' : ''}`}
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
                    <h2 className="section-subtitle">{ui.materiaisTitle}</h2>
                    <div className="support-cards-grid">
                        <div className="support-card">
                            <span className="card-badge">{ui.card1Badge}</span>
                            <h3>{ui.card1Title}</h3>
                            <p>{ui.card1Desc}</p>
                            <button className="card-action-btn">{ui.card1Btn}</button>
                        </div>
                        <div className="support-card">
                            <span className="card-badge">{ui.card2Badge}</span>
                            <h3>{ui.card2Title}</h3>
                            <p>{ui.card2Desc}</p>
                            <button className="card-action-btn">{ui.card2Btn}</button>
                        </div>
                    </div>
                </section>

                <footer className="video-footer-accent">
                    <div className="footer-left-info">
                        <h2>{ui.footerTitle}</h2>
                        <p className="footer-subtext">{ui.footerSub}</p>
                        <div className="footer-tip-box">
                            <h5>{ui.tipTitle}</h5>
                            <p>{ui.tipText}</p>
                        </div>
                    </div>
                    <div className="footer-badge-red">
                        <h6>{ui.alertTitle}</h6>
                        <p>{ui.alertText}</p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Videoaulas;
