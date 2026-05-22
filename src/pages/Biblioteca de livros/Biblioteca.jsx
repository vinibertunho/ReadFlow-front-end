import { useEffect, useMemo, useState } from "react";
import BookCard from "../../components/BookCard/BookCard";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Biblioteca.module.css";

const API_URLS = [
  { url: "/api/livros", auth: "x-api-key" }, // seu endpoint local (meu livro)
  { url: "https://readflow-m8o6.onrender.com/livrosExternos", auth: "x-api-key" }, // livro externo
  { url: "https://readflow-m8o6.onrender.com/api/livros", auth: "x-api-key" }, // backend remoto (fallback)
];

function Biblioteca() {
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [sort, setSort] = useState("melhor");

  useEffect(() => {
    const controller = new AbortController();

    const normalizeBook = (livro) => ({
      ...livro,
      ano_publicacao: livro?.ano_publicacao ?? livro?.anoPublicacao ?? null,
      genero_pt: livro?.genero_pt ?? "",
      genero_en: livro?.genero_en ?? "",
      capa_url: livro?.capa_url ?? "",
      sinopse: livro?.sinopse ?? "",
      descricao_pt: livro?.descricao_pt ?? "",
      descricao_en: livro?.descricao_en ?? "",
      contexto_pt: livro?.contexto_pt ?? "",
      contexto_en: livro?.contexto_en ?? "",
      detalhes_autor_pt: livro?.detalhes_autor_pt ?? "",
      detalhes_autor_en: livro?.detalhes_autor_en ?? "",
      estilo_escrita_pt: livro?.estilo_escrita_pt ?? "",
      estilo_escrita_en: livro?.estilo_escrita_en ?? "",
      verossimilhanca_pt: livro?.verossimilhanca_pt ?? "",
      verossimilhanca_en: livro?.verossimilhanca_en ?? "",
      caracteristicas_literarias_pt: livro?.caracteristicas_literarias_pt ?? "",
      caracteristicas_literarias_en: livro?.caracteristicas_literarias_en ?? "",
      conclusao_pt: livro?.conclusao_pt ?? "",
      conclusao_en: livro?.conclusao_en ?? "",
      video_url: livro?.video_url ?? "",
    });

    const extractBooks = (data) => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.books)) return data.books;
      if (Array.isArray(data?.items)) return data.items;
      if (Array.isArray(data?.data)) return data.data;
      if (data && (data.titulo || data.title || data.nome || data.id))
        return [data];
      return [];
    };

    async function fetchLivros() {
      try {
        setCarregando(true);
        const apiKey = import.meta.env.VITE_API_KEY || "projetoamods";

        const requests = API_URLS.map((entry) => {
          const url = typeof entry === "string" ? entry : entry.url;
          const auth = entry?.auth || null;
          const options = { signal: controller.signal };
          if (auth === "x-api-key") options.headers = { "x-api-key": apiKey };
          else if (auth === "bearer")
            options.headers = { Authorization: `Bearer ${apiKey}` };
          return fetch(url, options)
            .then((response) => {
              if (!response.ok) return null;
              return response.json();
            })
            .catch(() => null);
        });

        const responses = await Promise.all(requests);
        const combined = responses.flatMap((data) => extractBooks(data));

        const mapped = combined.map(normalizeBook);
        const seen = new Map();
        const deduped = [];
        for (const item of mapped) {
          const key =
            item.id ??
            `${(item.titulo || "").toLowerCase()}::${(item.autor || "").toLowerCase()}`;
          if (!seen.has(key)) {
            seen.set(key, true);
            deduped.push(item);
          }
        }

        setLivros(deduped);
      } catch (error) {
        if (error.name !== "AbortError") {
          setLivros([]);
          console.error("Erro ao buscar livros:", error);
        } else {
          console.warn("Request aborted (timeout or unmount)");
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
    livros.forEach((l) => {
      if (l.genero_pt) g.add(l.genero_pt);
    });
    return ["Todos", ...Array.from(g)];
  }, [livros]);

  const filtered = useMemo(() => {
    let list = livros.slice();
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (l) =>
          (l.titulo || "").toLowerCase().includes(q) ||
          (l.autor || "").toLowerCase().includes(q),
      );
    }
    if (selectedGenre && selectedGenre !== "Todos") {
      list = list.filter((l) => l.genero_pt === selectedGenre);
    }
    if (sort === "melhor") {
      list.sort(
        (a, b) =>
          (b.avaliacao || b.media_avaliacao || 0) -
          (a.avaliacao || a.media_avaliacao || 0),
      );
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
            <p className={styles.subtitle}>
              Explore nossa coleção curada de obras literárias
            </p>
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
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
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
            <div key={livro.id || livro.titulo} className={styles.item}>
              <BookCard dados={livro} />
            </div>
          ))}
        </section>

        {!filtered.length && (
          <p className={styles.loading}>
            Nenhum livro encontrado com os filtros atuais.
          </p>
        )}
      </main>
    </>
  );
}

export default Biblioteca;
