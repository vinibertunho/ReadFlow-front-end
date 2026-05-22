import { useEffect, useMemo, useState } from "react";
import BookCard from "../../components/BookCard/BookCard";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Biblioteca.module.css";

const API_KEY = "projetoamods";
const LOCAL_URL = "/api/livros";
const EXTERNAL_URL = "https://readflow-m8o6.onrender.com/livrosExternos";
const RANA_URL = "https://readflow-m8o6.onrender.com/livrosExternos/rana/livros";

export default function Biblioteca() {
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [sort, setSort] = useState("melhor");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchLivros() {
      try {
        setCarregando(true);

        const resultados = await Promise.allSettled([
          fetch(LOCAL_URL, {
            signal: controller.signal,
            headers: { "x-api-key": API_KEY },
          }).then(res => res.ok ? res.json() : null),
          
          fetch(EXTERNAL_URL, {
            signal: controller.signal,
          }).then(res => res.ok ? res.json() : null),

          fetch(RANA_URL, {
            signal: controller.signal,
          }).then(res => res.ok ? res.json() : null),
        ]);

        let localBooks = [];
        let externalBooks = [];
        let ranaBooks = [];

        if (resultados[0].status === "fulfilled" && resultados[0].value) {
          const dataLocal = resultados[0].value;
          localBooks = Array.isArray(dataLocal) ? dataLocal : [dataLocal];
        }

        const extrairArray = (data) => {
          if (Array.isArray(data)) return data;
          if (data && typeof data === "object") {
            const possivelArray = Object.values(data).find(val => Array.isArray(val));
            return possivelArray || [data];
          }
          return [];
        };

        if (resultados[1].status === "fulfilled" && resultados[1].value) {
          externalBooks = extrairArray(resultados[1].value);
        }

        if (resultados[2].status === "fulfilled" && resultados[2].value) {
          ranaBooks = extrairArray(resultados[2].value);
        }

        const combined = [...localBooks, ...externalBooks, ...ranaBooks];
        
        const normalized = combined.map((livro) => ({
          ...livro,
          id: livro?.id || livro?._id || Math.random().toString(36).substr(2, 9),
          titulo: livro?.titulo || livro?.title || livro?.nome || "Sem título",
          autor: livro?.autor || livro?.author || livro?.autorName || "Desconhecido",
          ano_publicacao: livro?.ano_publicacao ?? livro?.anoPublicacao ?? null,
          genero_pt: livro?.genero_pt || livro?.genre || "Outros",
          genero_en: livro?.genero_en ?? "",
          capa_url: livro?.capa_url || livro?.image || livro?.cover || "",
          sinopse: livro?.sinopse ?? livro?.description ?? "",
          avaliacao: livro?.avaliacao ?? livro?.media_avaliacao ?? livro?.rating ?? 0,
        }));

        const unique = [];
        const seen = new Set();
        for (const livro of normalized) {
          const key = `${livro.titulo.toLowerCase()}::${livro.autor.toLowerCase()}`;
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(livro);
          }
        }

        setLivros(unique);
      } catch (error) {
        if (error.name !== "AbortError") {
          setLivros([]);
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
    const set = new Set();
    livros.forEach((livro) => {
      if (livro.genero_pt) set.add(livro.genero_pt);
    });
    return ["Todos", ...Array.from(set)];
  }, [livros]);

  const filtered = useMemo(() => {
    let list = livros.slice();

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (livro) =>
          livro.titulo.toLowerCase().includes(q) ||
          livro.autor.toLowerCase().includes(q)
      );
    }

    if (selectedGenre !== "Todos") {
      list = list.filter((livro) => livro.genero_pt === selectedGenre);
    }

    if (sort === "melhor") {
      list.sort((a, b) => b.avaliacao - a.avaliacao);
    } else if (sort === "recentes") {
      list.sort((a, b) => (b.ano_publicacao || 0) - (a.ano_publicacao || 0));
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

            <select
              className={styles.select}
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>

            <select
              className={styles.select}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="melhor">Melhor Avaliados</option>
              <option value="recentes">Mais Recentes</option>
            </select>
          </div>
        </header>

        <section className={styles.grid}>
          {filtered.map((livro) => (
            <div key={livro.id} className={styles.item}>
              <BookCard dados={livro} />
            </div>
          ))}
        </section>

        {!filtered.length && (
          <p className={styles.loading}>Nenhum livro encontrado com os filtros atuais.</p>
        )}
      </main>
    </>
  );
}