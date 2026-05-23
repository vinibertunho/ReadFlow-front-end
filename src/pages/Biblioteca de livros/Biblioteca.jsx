import { useEffect, useState } from "react";
import BookCard from '../../components/BookCard/BookCard';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Biblioteca.module.css';

const API_INTEGRACAO_URL = 'https://readflow-m8o6.onrender.com/api/integracao';
const MINHA_API_URL = 'https://readflow-m8o6.onrender.com/api/livros';
const API_KEY = import.meta.env.VITE_API_KEY;

function Biblioteca() {
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [sort, setSort] = useState('melhor');

  useEffect(() => {
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
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const listaGeneros = ['Todos'];
  livros.forEach(l => {
    if (l.genero_pt && !listaGeneros.includes(l.genero_pt)) {
      listaGeneros.push(l.genero_pt);
    }
  });

  let filtered = livros.filter(l => {
    const atendeTexto = query === '' || 
      (l.titulo || '').toLowerCase().includes(query.toLowerCase()) || 
      (l.autor || '').toLowerCase().includes(query.toLowerCase());
    
    const atendeGenero = selectedGenre === 'Todos' || l.genero_pt === selectedGenre;

    return atendeTexto && atendeGenero;
  });

  if (sort === 'melhor') {
    filtered.sort((a, b) => (b.avaliacao || b.media_avaliacao || 0) - (a.avaliacao || a.media_avaliacao || 0));
  } else if (sort === 'recentes') {
    filtered.sort((a, b) => (b.anoPublicacao || b.ano || 0) - (a.anoPublicacao || a.ano || 0));
  }

  if (carregando) {
    return (
      <>
        <Navbar />
        <main className={styles.container}>
          <p className={styles.loading}>Carregando catálogo unificado... 📚</p>
        </main>
      </>
    );
  }

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
              <option value="melhor">Melhor Evaluados</option>
              <option value="recentes">Mais Recentes</option>
            </select>
          </div>
        </header>

        <section className={styles.grid}>
          {filtered.map((livro, index) => (
            <BookCard key={livro.id || `livro-${index}`} dados={livro} />
          ))}
        </section>

        {!filtered.length && (
          <p className={styles.loading}>Nenhum livro encontrado com os filtros atuais.</p>
        )}
      </main>
    </>
  );
}

export default Biblioteca;