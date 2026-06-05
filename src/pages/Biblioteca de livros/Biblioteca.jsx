import { useEffect, useState } from "react";
import { BookOpenText, Search, LayoutGrid, LayoutList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Biblioteca.module.css";
import { useIdioma } from "../../context/IdiomaContext";

const API_LIVROS_URL = "https://readflow-m8o6.onrender.com/api/livros";
const API_INTEGRACAO_URL = "https://readflow-m8o6.onrender.com/api/integracao";
const API_KEY = import.meta.env.VITE_API_KEY;

const AUTH_HEADERS = {
  "Content-Type": "application/json",
  ...(API_KEY
    ? { "x-api-key": API_KEY, Authorization: `Bearer ${API_KEY}` }
    : {}),
};

const CAPA_PADRAO =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="%23eef2ff"/><text x="200" y="300" text-anchor="middle" fill="%23334155" font-size="28">Sem capa</text></svg>';

// Gera o mesmo slug usado pela página Livro para casar a busca por título
const slugify = (text) =>
  String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Identificador de rota: usa o id quando existe, senão o slug do título PT
function obterRotaLivro(livro) {
  if (livro?.id) return String(livro.id);
  return slugify(livro?.titulo || livro?.title || "");
}

async function fetchWithTimeout(url, options = {}, timeout = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

function Biblioteca() {
  const navigate = useNavigate();
  const { idioma } = useIdioma();
  const isPt = idioma === "PT";

  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [sort, setSort] = useState("melhor");
  const [layout, setLayout] = useState("grid");
  const [visibleCount, setVisibleCount] = useState(6);
  const [manualFeatured, setManualFeatured] = useState(null);

  useEffect(() => {
    setSelectedGenre(isPt ? "Todos" : "All");
  }, [isPt]);

  useEffect(() => {
    async function fetchLivros() {
      try {
        setCarregando(true);
        setErro("");

        // Busca em paralelo com timeout tolerante ao Cold Start
        const [resLivros, resInteg] = await Promise.all([
          fetchWithTimeout(API_LIVROS_URL, { headers: AUTH_HEADERS }, 15000)
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => []),
          fetchWithTimeout(API_INTEGRACAO_URL, { headers: AUTH_HEADERS }, 15000)
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => []),
        ]);

        const extrair = (dados) =>
          dados?.data && Array.isArray(dados.data)
            ? dados.data
            : Array.isArray(dados)
              ? dados
              : [];

        const extrairIntegracao = (dados) => {
          if (!Array.isArray(dados)) return [];
          return dados
            .filter(
              (item) =>
                item?.statusApi === "Online" && Array.isArray(item.conteudo),
            )
            .map((item) => {
              const c = item.conteudo[0];
              const autorRaw = c.autor;
              const autorStr = Array.isArray(autorRaw)
                ? autorRaw.map((a) => a.nome).join(", ")
                : autorRaw || "";
              return {
                ...c,
                autor: autorStr,
                capa_url: c.capa_url || c.foto || "",
              };
            });
        };

        const dadosRaw = [
          ...extrair(resLivros),
          ...extrairIntegracao(resInteg),
        ];

        const listaUnificada = dadosRaw
          .map((l, index) => {
            const tituloPadrao = l.titulo || l.title || l.tituloDoLivro || "";
            return {
              ...l,
              id_unico: l.id ? String(l.id) : `${tituloPadrao}-${index}`,
              titulo: tituloPadrao,
              title_en: l.title || l.titulo_en || tituloPadrao || "Untitled",
              autor: l.autor || l.author || l.autores || "",
              capa_url: l.capa_url || l.capa || l.image || "",
              genero_pt: l.genero_pt || l.genero || l.genre || "Geral",
              genero_en: l.genre || l.genero_en || "General",
              sinopse: l.sinopse || l.descricao_pt || l.descricao || "",
              sinopse_en: l.descricao_en || l.synopsis || l.sinopse || "",
              rating: Number(l.avaliacao ?? l.media_avaliacao ?? 4.6),
              ano: Number(l.ano_publicacao ?? l.ano ?? 0),
            };
          })
          .filter((l) => l.titulo !== "");

        setLivros(listaUnificada);
      } catch {
        setErro(isPt ? "Erro ao carregar dados." : "Error loading data.");
      } finally {
        setCarregando(false);
      }
    }
    fetchLivros();
  }, []);

  const labelTodos = isPt ? "Todos" : "All";
  const listaGeneros = [
    labelTodos,
    ...new Set(livros.map((l) => (isPt ? l.genero_pt : l.genero_en))),
  ];

  const livrosFiltrados = livros
    .filter((l) => {
      const txtTitulo = isPt ? l.titulo : l.title_en;
      const matchesBusca =
        query.trim() === "" ||
        txtTitulo.toLowerCase().includes(query.toLowerCase()) ||
        l.autor.toLowerCase().includes(query.toLowerCase());
      const generoDoLivro = isPt ? l.genero_pt : l.genero_en;
      const matchesGen =
        selectedGenre === "Todos" ||
        selectedGenre === "All" ||
        generoDoLivro === selectedGenre;
      return matchesBusca && matchesGen;
    })
    .sort((a, b) => {
      if (sort === "melhor") return b.rating - a.rating;
      if (sort === "recentes") return b.ano - a.ano;
      return (isPt ? a.titulo : a.title_en).localeCompare(
        isPt ? b.titulo : b.title_en,
      );
    });

  const featuredBook =
    manualFeatured &&
    livrosFiltrados.some((l) => l.id_unico === manualFeatured.id_unico)
      ? manualFeatured
      : livrosFiltrados[0];

  const livrosParaLista = livrosFiltrados
    .filter((l) => l.id_unico !== featuredBook?.id_unico)
    .slice(0, visibleCount);

  const podeCarregarMais =
    livrosFiltrados.length > livrosParaLista.length + (featuredBook ? 1 : 0);

  if (carregando)
    return (
      <main className={styles.pageShell}>
        <p className={styles.statusBox}>
          <BookOpenText size={24} />{" "}
          {isPt
            ? "Carregando biblioteca... (A aguardar que o servidor ligue)"
            : "Loading library... (Waiting for server to wake up)"}
        </p>
      </main>
    );

  return (
    <>
      <Navbar />
      <main className={styles.pageShell}>
        <section className={styles.heroSection}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>
              {isPt ? "Biblioteca Global" : "Global Library"}
            </p>
            <h1>
              {isPt ? "Explore o acervo literário" : "Explore the collection"}
            </h1>
            <p className={styles.heroText}>
              {isPt
                ? "Explore obras clássicas e descubra autores."
                : "Explore classic works and discover authors."}
            </p>
          </div>
          <div className={styles.searchShell}>
            <Search size={18} />
            <input
              className={styles.searchInput}
              placeholder={
                isPt ? "Pesquisar literatura..." : "Search literature..."
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </section>

        <section className={styles.featuredSection}>
          {featuredBook ? (
            <article className={styles.featuredCard}>
              <div className={styles.featuredMedia}>
                <img
                  className={styles.featuredImage}
                  src={featuredBook.capa_url || CAPA_PADRAO}
                  alt="Capa"
                />
              </div>
              <div className={styles.featuredContent}>
                <span className={styles.featuredBadge}>
                  {isPt ? "Obra em Destaque" : "Featured Work"}
                </span>
                <h2>{isPt ? featuredBook.titulo : featuredBook.title_en}</h2>
                <p>
                  {featuredBook.autor}
                  {featuredBook.ano ? `, ${featuredBook.ano}` : ""}
                </p>
                <p className={styles.featuredQuote}>
                  {isPt
                    ? featuredBook.sinopse || "Sem resumo."
                    : featuredBook.sinopse_en ||
                      featuredBook.sinopse ||
                      "No summary."}
                </p>
                <button
                  className={styles.primaryButton}
                  onClick={() =>
                    navigate(`/livro/${obterRotaLivro(featuredBook)}`, {
                      state: { livro: featuredBook },
                    })
                  }
                >
                  {isPt ? "Ler online" : "Read online"}
                </button>
              </div>
            </article>
          ) : (
            <p>{isPt ? "Nenhum livro encontrado." : "No books found."}</p>
          )}
        </section>

        <section className={styles.collectionSection}>
          <div className={styles.collectionHeader}>
            <h3>
              {livrosFiltrados.length}{" "}
              {isPt ? "obras disponíveis" : "works available"}
            </h3>
            <div className={styles.collectionTools}>
              <div className={styles.viewSwitch}>
                <button
                  type="button"
                  className={`${styles.viewButton} ${layout === "grid" ? styles.viewButtonActive : ""}`}
                  onClick={() => setLayout("grid")}
                  aria-label="Visualização em grade"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  type="button"
                  className={`${styles.viewButton} ${layout === "list" ? styles.viewButtonActive : ""}`}
                  onClick={() => setLayout("list")}
                  aria-label="Visualização em lista"
                >
                  <LayoutList size={18} />
                </button>
              </div>
              <select
                className={styles.select}
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                {listaGeneros.map((g) => (
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
                <option value="melhor">
                  {isPt ? "Melhores avaliados" : "Top rated"}
                </option>
                <option value="recentes">
                  {isPt ? "Mais recentes" : "Most recent"}
                </option>
              </select>
            </div>
          </div>

          {erro && <p className={styles.errorBox}>{erro}</p>}

          <div
            className={`${styles.collectionGrid} ${layout === "list" ? styles.listLayout : ""}`}
          >
            {livrosParaLista.map((l) => (
              <article
                key={l.id_unico}
                className={`${styles.bookCard} ${layout === "list" ? styles.bookCardList : ""}`}
                onClick={() => setManualFeatured(l)}
              >
                <img
                  className={styles.bookImage}
                  src={l.capa_url || CAPA_PADRAO}
                  alt="Capa"
                />
                <div className={styles.bookContent}>
                  <span>
                    {l.autor ||
                      (isPt ? "Autor não informado" : "Unknown Author")}
                  </span>
                  <h4>{isPt ? l.titulo : l.title_en}</h4>
                  <p>
                    {isPt
                      ? l.sinopse || "Sem sinopse."
                      : l.sinopse_en || l.sinopse || "No synopsis."}
                  </p>
                  <div className={styles.bookFooter}>
                    <span className={styles.genrePill}>
                      {isPt ? l.genero_pt : l.genero_en}
                    </span>
                    <span>⭐ {l.rating.toFixed(1)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {podeCarregarMais && (
            <div className={styles.loadMoreWrap}>
              <button
                className={styles.loadMoreButton}
                onClick={() => setVisibleCount((c) => c + 6)}
              >
                {isPt ? "Carregar mais" : "Load more"}
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default Biblioteca;
