import { useEffect, useMemo, useState } from "react";
import BookCard from '../../components/BookCard/BookCard';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Biblioteca.module.css';

const API_URL = "https://readflow-m8o6.onrender.com/api/livros";

function Biblioteca() {
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [sort, setSort] = useState('melhor');

  useEffect(() => {
    const controller = new AbortController();

    const normalizeBook = (livro) => ({
      ...livro,
      ano_publicacao: livro?.ano_publicacao ?? livro?.anoPublicacao ?? null,
      genero_pt: livro?.genero_pt ?? '',
      genero_en: livro?.genero_en ?? '',
      capa_url: livro?.capa_url ?? '',
      sinopse: livro?.sinopse ?? '',
      descricao_pt: livro?.descricao_pt ?? '',
      descricao_en: livro?.descricao_en ?? '',
      contexto_pt: livro?.contexto_pt ?? '',
      contexto_en: livro?.contexto_en ?? '',
      detalhes_autor_pt: livro?.detalhes_autor_pt ?? '',
      detalhes_autor_en: livro?.detalhes_autor_en ?? '',
      estilo_escrita_pt: livro?.estilo_escrita_pt ?? '',
      estilo_escrita_en: livro?.estilo_escrita_en ?? '',
      verossimilhanca_pt: livro?.verossimilhanca_pt ?? '',
      verossimilhanca_en: livro?.verossimilhanca_en ?? '',
      caracteristicas_literarias_pt: livro?.caracteristicas_literarias_pt ?? '',
      caracteristicas_literarias_en: livro?.caracteristicas_literarias_en ?? '',
      conclusao_pt: livro?.conclusao_pt ?? '',
      conclusao_en: livro?.conclusao_en ?? '',
      video_url: livro?.video_url ?? '',
    });

    async function fetchLivros() {
      try {
        setCarregando(true);

        const response = await fetch(API_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error('Não foi possível carregar os livros.');
        }

        const data = await response.json();
        const list = Array.isArray(data)
          ? data
          : data?.books || data?.items || data?.data || [];
        setLivros(Array.isArray(list) ? list.map(normalizeBook) : []);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setLivros([]);
          console.error('Erro ao buscar livros:', error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    fetchLivros();

    return () => controller.abort();
  }, []);

  const genres = useMemo(() => {
    const g = new Set();
    livros.forEach(l => { if (l.genero_pt) g.add(l.genero_pt); });
    return ['Todos', ...Array.from(g)];
  }, [livros]);

  const filtered = useMemo(() => {
    let list = livros.slice();
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(l => ((l.titulo || '').toLowerCase().includes(q) || (l.autor || '').toLowerCase().includes(q)));
    }
    if (selectedGenre && selectedGenre !== 'Todos') {
      list = list.filter(l => l.genero_pt === selectedGenre);
    }
    if (sort === 'melhor') {
      list.sort((a,b) => (b.avaliacao || b.media_avaliacao || 0) - (a.avaliacao || a.media_avaliacao || 0));
    }
    return list;
  }, [livros, query, selectedGenre, sort]);

  if (carregando) {
    return (
      <>
        <Navbar />
        <main className={styles.container}>
          <p className={styles.loading}>Carregando catálogo... 📚</p>
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
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>

            <select className={styles.select} value={sort} onChange={e => setSort(e.target.value)}>
              <option value="melhor">Melhor Avaliados</option>
              <option value="recentes">Mais Recentes</option>
            </select>
          </div>
        </header>

        <section className={styles.grid}>
          {filtered.map((livro) => (
            <BookCard key={livro.id} dados={livro} />
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
