import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './Simulados.module.css';

const QuizPage = () => {
    // Estados para armazenar dados da API, opção selecionada e carregamento
    const [data, setData] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(true);

    // Busca os dados da sua API ao montar o componente
    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                // Substitua pela URL da sua API real
                const response = await fetch('https://sua-api.com/questao/7');
                const result = await response.json();

                setData(result);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao buscar dados da API:', error);
                setLoading(false);
            }
        };

        fetchQuizData();
    }, []);

    // Tela de carregamento enquanto a API não responde
    if (loading) {
        return <div className="loading-state">Carregando simulado...</div>;
    }

    // Caso ocorra erro ou a API venha vazia
    if (!data) {
        return <div className="error-state">Não foi possível carregar a questão.</div>;
    }

    return (
        <div className="simulado-page">
            {/* Componente de Navbar importado */}
            <Navbar />

            <main className="simulado-content">
                {/* Lado Esquerdo: Área da Questão */}
                <section className="question-area">
                    <div className="question-card">
                        <header className="question-header">
                            <span className="breadcrumb">
                                📋 {data.simulado_nome || 'Simulado'}
                            </span>
                            <span className="question-index">
                                Questão {data.numero_atual || '0'} de {data.total_questoes || '0'}
                            </span>
                        </header>

                        <div className="question-body">
                            <p className="question-text">{data.enunciado}</p>

                            {/* Renderiza imagem apenas se existir na API */}
                            {data.imagem_url && (
                                <img
                                    src={data.imagem_url}
                                    alt="Imagem de contexto"
                                    className="question-image"
                                />
                            )}

                            {/* Mapeamento das alternativas vindas da API */}
                            <div className="options-list">
                                {data.alternativas.map((alt) => (
                                    <div
                                        key={alt.id}
                                        className={`option-item ${selectedOption === alt.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedOption(alt.id)}>
                                        <div className="option-content">
                                            <span className="option-label">
                                                {alt.letra}) {alt.titulo}
                                            </span>
                                            <p className="option-description">{alt.texto}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <footer className="question-footer">
                            <button className="btn-back">← Anterior</button>
                            <div className="footer-right-btns">
                                <button className="btn-secondary">Revisar Depois</button>
                                <button className="btn-next">Próxima Questão →</button>
                            </div>
                        </footer>
                    </div>
                </section>

                {/* Lado Direito: Sidebar */}
                <aside className="sidebar-area">
                    <div className="sidebar-card">
                        <h3 className="sidebar-title">⣿ Mapa de Questões</h3>
                        <div className="questions-grid">
                            {/* Gera o grid de números. Marca como 'active' o número atual da API */}
                            {Array.from({ length: 15 }).map((_, i) => {
                                const num = i + 1;
                                return (
                                    <div
                                        key={num}
                                        className={`grid-num ${num === data.numero_atual ? 'active' : num < data.numero_atual ? 'done' : ''}`}>
                                        {num}
                                    </div>
                                );
                            })}
                        </div>
                        <button className="btn-finish">Finalizar Simulado</button>
                    </div>

                    <div className="hint-box">
                        <h4>Dica de Estudo</h4>
                        <p>
                            {data.dica ||
                                'Lembre-se de revisar os conceitos básicos deste capítulo.'}
                        </p>
                        <a href="#resumo" className="resumo-link">
                            Ver resumo do capítulo
                        </a>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default QuizPage;
