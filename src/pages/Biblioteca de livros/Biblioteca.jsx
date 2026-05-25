import { useEffect, useState, useMemo } from "react";
import BookCard from '../../components/BookCard/BookCard';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Biblioteca.module.css';

const API_INTEGRACAO_URL = 'https://readflow-m8o6.onrender.com/api/integracao';
const MINHA_API_URL = 'https://readflow-m8o6.onrender.com/api/livros';

export default function Biblioteca() {
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [sort, setSort] = useState("melhor");

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    async function fetchLivros() {
      try {
        setCarregando(true);

        const headersPadrao = {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'Authorization': `Bearer ${API_KEY}`
        };

        const [resIntegracao, resMinhaApi] = await Promise.all([
          fetch(API_INTEGRACAO_URL, { signal: controller.signal, headers: headersPadrao }).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(MINHA_API_URL, { signal: controller.signal, headers: headersPadrao }).then(r => r.ok ? r.json() : null).catch(() => null)
        ]);

        const meusLivros = Array.isArray(resMinhaApi) ? resMinhaApi : (resMinhaApi?.data && Array.isArray(resMinhaApi.data) ? resMinhaApi.data : []);
        const livrosParceiros = [];

        if (resIntegracao) {
          const dadosBase = resIntegracao.data || resIntegracao;

          if (Array.isArray(dadosBase)) {
            dadosBase.forEach(item => {
              if (item && Array.isArray(item.conteudo)) {
                livrosParceiros.push(...item.conteudo);
              } else if (item) {
                livrosParceiros.push(item);
              }
            });
          }
        }

        const todosLivrosMisturados = [...meusLivros, ...livrosParceiros];
        const vistos = new Set();
        const listaFinalSemDuplicatas = [];

        todosLivrosMisturados.forEach(livro => {
          if (!livro) return;

          let tituloLimpo = livro.titulo || livro.title || livro.tituloDoLivro || '';
          let autorLimpo = livro.autor || livro.author || livro.autores || '';

          if (tituloLimpo.toLowerCase().includes('nao informado') && autorLimpo.toLowerCase().includes('memorias postumas')) {
            tituloLimpo = "Memórias Póstumas de Brás Cubas";
            autorLimpo = "Machado de Assis";
          }

          if (!tituloLimpo || tituloLimpo.toLowerCase().includes('nao informado')) return;

          const chaveUnica = String(tituloLimpo).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

          if (!vistos.has(chaveUnica)) {
            vistos.add(chaveUnica);
            listaFinalSemDuplicatas.push({
              ...livro,
              titulo: tituloLimpo,
              autor: autorLimpo || 'Autor não informado',
              capa_url: livro.capa_url || livro.capa || livro.image || livro.capaURL || null,
              genero_pt: livro.genero_pt || livro.genero || 'Geral'
            });
          } else {
            const indexExistente = listaFinalSemDuplicatas.findIndex(l =>
              String(l.titulo).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim() === chaveUnica
            );
            if (indexExistente !== -1) {
              if (!listaFinalSemDuplicatas[indexExistente].capa_url && (livro.capa_url || livro.capa || livro.image)) {
                listaFinalSemDuplicatas[indexExistente].capa_url = livro.capa_url || livro.capa || livro.image;
              }
              if (!listaFinalSemDuplicatas[indexExistente].sinopse && livro.sinopse) {
                listaFinalSemDuplicatas[indexExistente].sinopse = livro.sinopse;
              }
            }
          }
        });

        setLivros(listaFinalSemDuplicatas);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Erro ao buscar catálogos:', error);
          setLivros([]);
        }
      } finally {
        clearTimeout(timeoutId);
        setCarregando(false);
      }
    }

    fetchLivros();

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  const listaGeneros = useMemo(() => {
    const generos = new Set(['Todos']);
    livros.forEach((l) => {
      if (l.genero_pt) generos.add(l.genero_pt);
    });
    return Array.from(generos);
  }, [livros]);

  const filtered = useMemo(() => {
    const resultado = livros.filter(l => {
      const atendeTexto = query === '' ||
        (l.titulo || '').toLowerCase().includes(query.toLowerCase()) ||
        (l.autor || '').toLowerCase().includes(query.toLowerCase());

      const atendeGenero = selectedGenre === 'Todos' || l.genero_pt === selectedGenre;

      return atendeTexto && atendeGenero;
    });

    const resultadoOrdenado = [...resultado];

    if (sort === 'melhor') {
      resultadoOrdenado.sort((a, b) => (Number(b.avaliacao || b.media_avaliacao) || 0) - (Number(a.avaliacao || a.media_avaliacao) || 0));
    } else if (sort === 'recentes') {
      resultadoOrdenado.sort((a, b) => (Number(b.anoPublicacao || b.ano) || 0) - (Number(a.anoPublicacao || a.ano) || 0));
    }

    return resultadoOrdenado;
  }, [livros, query, selectedGenre, sort]);

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Catálogo de Livros</h1>
            <p className={styles.subtitle}>Explore nossa coleção curada de obras literárias</p>
          </div>

          <div className={styles.controls}>
            <input
              className={styles.search}
              placeholder="Buscar por título ou autor..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <select className={styles.select} value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
              {listaGeneros.map(g => <option key={g} value={g}>{g}</option>)}
            </select>

            <select className={styles.select} value={sort} onChange={e => setSort(e.target.value)}>
              <option value="melhor">Melhor Avaliados</option>
              <option value="recentes">Mais Recentes</option>
            </select>
          </div>
        </header>

        {carregando ? (
          <p className={styles.loading}>Carregando catálogo unificado... 📚</p>
        ) : (
          <section className={styles.grid}>
            {filtered.map((livro, index) => (
              <BookCard key={livro.id || `livro-${index}`} dados={livro} />
            ))}
          </section>
        )}

        {!carregando && !filtered.length && (
          <p className={styles.loading}>Nenhum livro encontrado com os filtros atuais.</p>
        )}
      </main>
    </>
  );
}
