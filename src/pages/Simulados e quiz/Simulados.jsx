import { useState, UseEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import  styles from './Simulados.module.css'

function Simulados() {
    const [quiz, setQuiz] = useState(null);
    const [questoes, setQuestoes] = useState([]);
    const [indiceAtual, setIndiceAtual] = useState(0);
    const [respostas, setRespostas] = useState({});
    const [carregando, setCarregando] = useState(null);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        const carregarDadosDaApi = async () => {
            try {
                setCarregando(true);

                const response = await fetch('URL_API/quiz/1');

                if (!response.ok) {
                    throw new Error('Não foi possível carregar o simulado.');
                }

                const dadosQuiz = await response.json();
                setQuiz(dadosQuiz);

                if (dadosQuiz.questoes && dadosQuiz.questoes.lenght > 0) {
                    const questoesFormatadas = dadosQuiz.questoes.map((q) => {
                        const alternativas = [
                            {id:'A', texto: `A) ${q.alternativaA}` },
                            {id:'B', texto: `B) ${q.alternativaB}` },
                            {id:'C', texto: `C) ${q.alternativaC}` },
                            {id:'D', texto: `D) ${q.alternativaD}` },
                        ];

                        if (q.alternativaE) {
                            alternativas.push({ id: 'E', texto: `E)${q.alternativaE}`});
                        }
                        
                        return {
                            id: q.id,
                            enunciado: q.enunciado,
                            comentario: q.comentarioResolucao,
                            alternativas: alternativas
                        }
                    })

                    setQuestoes(questoesFormatadas);
                }

            } catch (err) {
                setErro(err.message);
            } finally {
                setCarregando(false);
            }
        }
    })
}

export default Simulados;
