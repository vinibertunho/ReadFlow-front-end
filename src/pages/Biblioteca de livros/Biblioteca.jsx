import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpenText, Grid2x2, List, Search, SlidersHorizontal, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Biblioteca.module.css";

const API_LIVROS_URL = "https://readflow-m8o6.onrender.com/api/livros";
const API_INTEGRACAO_URL = "https://readflow-m8o6.onrender.com/api/integracao";

const CAPA_PADRAO =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="%23eef2ff"/><rect x="24" y="24" width="352" height="552" rx="16" fill="%23dbeafe"/><text x="200" y="300" text-anchor="middle" fill="%23334155" font-size="28" font-family="Arial">Sem capa</text></svg>';

function resolverUrlCapa(url) {
  if (!url || typeof url !== "string") return "";
  const value = url.trim();
  if (!value) return "";
  if (value.includes("ibb.co/") && !value.includes("i.ibb.co/")) return "";
  return value;
}

function normalizarTexto(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

function ehCapitaesDaAreia(livro) {
  const tituloNormalizado = normalizarTexto(livro?.titulo || livro?.title || livro?.tituloDoLivro || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  return (
    tituloNormalizado.includes("capitaes da areia") ||
    tituloNormalizado.includes("capitaes de areia")
  );
}

function obterRating(livro) {
  const valor = livro?.avaliacao ?? livro?.media_avaliacao ?? livro?.avaliacao_media ?? 4.6;
  const rating = Number.parseFloat(valor);
  return Number.isFinite(rating) ? rating : 4.6;
}

function obterAno(livro) {
  const valor = livro?.ano_publicacao ?? livro?.anoPublicacao ?? livro?.ano ?? 0;
  const ano = Number.parseInt(valor, 10);
  return Number.isFinite(ano) ? ano : 0;
}

function obterChaveLivro(livro) {
  if (livro?.id != null) return String(livro.id);

  const titulo = normalizarTexto(livro?.titulo || livro?.title || livro?.tituloDoLivro || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  const autor = normalizarTexto(livro?.autor || livro?.author || livro?.autores || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  return `${titulo}-${autor}`.trim();
}

function extrairListaResposta(resposta) {
  if (!resposta) return [];

  const dadosBase = resposta.data ?? resposta;

  if (!Array.isArray(dadosBase)) return [];

  return dadosBase.flatMap((item) => {
    if (item && Array.isArray(item.conteudo)) return item.conteudo;
    return item ? [item] : [];
  });
}

function normalizarLivro(livro) {
  const tituloOriginal = normalizarTexto(livro?.titulo || livro?.title || livro?.tituloDoLivro || "");
  const autorOriginal = normalizarTexto(livro?.autor || livro?.author || livro?.autores || "");

  let titulo = tituloOriginal;
  let autor = autorOriginal;

  const tituloCheck = titulo.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const autorCheck = autor.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

  if ((tituloCheck.includes("nao informado") || !titulo) && autorCheck.includes("memoria")) {
    titulo = "Memórias Póstumas de Brás Cubas";
    autor = "Machado de Assis";
  }

  return {
    ...livro,
    titulo,
    autor: autor || "Autor não informado",
    capa_url: resolverUrlCapa(livro?.capa_url || livro?.capa || livro?.image || livro?.capaURL || livro?.imagem_url || livro?.imagem || livro?.capas || livro?.foto || ""),
    genero_pt: normalizarTexto(livro?.genero_pt || livro?.genero || livro?.genre || "Geral") || "Geral",
    sinopse: normalizarTexto(livro?.sinopse || livro?.descricao_pt || livro?.descricao_en || livro?.descricao || ""),
    resumo: normalizarTexto(livro?.resumo || ""),
    ano_publicacao: livro?.ano_publicacao ?? livro?.anoPublicacao ?? livro?.ano ?? null,
    rating: obterRating(livro),
  };
}

function Biblioteca() {
  const navigate = useNavigate();
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [sort, setSort] = useState("melhor");
  const [layout, setLayout] = useState("grid");
  const [visibleCount, setVisibleCount] = useState(6);
  const [manualFeatured, setManualFeatured] = useState(null);
  const featuredRef = useRef(null);

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 6000);

    async function fetchLivros() {
      try {
        setCarregando(true);
        setErro("");

        const headersPadrao = {
          "Content-Type": "application/json",
        };

        if (API_KEY) {
          headersPadrao["x-api-key"] = API_KEY;
          headersPadrao.Authorization = `Bearer ${API_KEY}`;
        }

        const [resLivros, resIntegracao] = await Promise.all([
          fetch(API_LIVROS_URL, { signal: controller.signal, headers: headersPadrao }).then((resposta) => (resposta.ok ? resposta.json() : null)).catch(() => null),
          fetch(API_INTEGRACAO_URL, { signal: controller.signal, headers: headersPadrao }).then((resposta) => (resposta.ok ? resposta.json() : null)).catch(() => null),
        ]);

        const listaUnificada = [...extrairListaResposta(resLivros), ...extrairListaResposta(resIntegracao)]
          .map(normalizarLivro)
          .filter((livro) => livro.titulo)
          .filter((livro) => !ehCapitaesDaAreia(livro))
          .reduce((acumulado, livro) => {
            const chave = obterChaveLivro(livro);
            const existente = acumulado.find((item) => obterChaveLivro(item) === chave);

            if (!existente) {
              acumulado.push(livro);
              return acumulado;
            }

            if (!existente.capa_url && livro.capa_url) existente.capa_url = livro.capa_url;
            if (!existente.sinopse && livro.sinopse) existente.sinopse = livro.sinopse;
            if (!existente.genero_pt && livro.genero_pt) existente.genero_pt = livro.genero_pt;
            if (!existente.rating && livro.rating) existente.rating = livro.rating;

            return acumulado;
          }, []);

        setLivros(listaUnificada);
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error("Erro ao buscar catálogo:", error);
          setErro("Não foi possível carregar a biblioteca agora.");
          setLivros([]);
        }
      } finally {
        clearTimeout(timeoutId);
        setCarregando(false);
      }
    }

    fetchLivros();

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const listaGeneros = useMemo(() => {
    const generos = ["Todos"];

    livros.forEach((livro) => {
      if (livro.genero_pt && !generos.includes(livro.genero_pt)) {
        generos.push(livro.genero_pt);
      }
    });

    return generos;
  }, [livros]);

  const livrosFiltrados = useMemo(() => {
    const queryNormalizada = query.trim().toLowerCase();

    const filtrados = livros.filter((livro) => {
      const atendeTexto =
        queryNormalizada === "" ||
        normalizarTexto(livro.titulo).toLowerCase().includes(queryNormalizada) ||
        normalizarTexto(livro.autor).toLowerCase().includes(queryNormalizada);

      const atendeGenero = selectedGenre === "Todos" || livro.genero_pt === selectedGenre;

      return atendeTexto && atendeGenero;
    });

    filtrados.sort((a, b) => {
      if (sort === "melhor") {
        return obterRating(b) - obterRating(a);
      }

      if (sort === "recentes") {
        return obterAno(b) - obterAno(a);
      }

      return normalizarTexto(a.titulo).localeCompare(normalizarTexto(b.titulo), "pt-BR");
    });

    return filtrados;
  }, [livros, query, selectedGenre, sort]);

  const featuredBook = useMemo(() => {
    const manualFeaturedValido = manualFeatured
      ? livrosFiltrados.some((livro) => obterChaveLivro(livro) === obterChaveLivro(manualFeatured))
      : false;

    if (manualFeaturedValido) return manualFeatured;
    if (!livrosFiltrados.length) return null;

    return [...livrosFiltrados].sort((a, b) => {
      const ratingDiff = obterRating(b) - obterRating(a);
      if (ratingDiff !== 0) return ratingDiff;

      return obterAno(b) - obterAno(a);
    })[0];
  }, [livrosFiltrados, manualFeatured]);

  useEffect(() => {
    if (!manualFeatured) return;
    // espera um tick para garantir que o DOM foi atualizado
    const id = window.setTimeout(() => {
      try {
        featuredRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch {
        // ignore
      }
    }, 120);

    return () => window.clearTimeout(id);
  }, [manualFeatured]);

  const livrosParaLista = useMemo(() => {
    const featuredKey = featuredBook ? obterChaveLivro(featuredBook) : null;

    return livrosFiltrados
      .filter((livro) => obterChaveLivro(livro) !== featuredKey)
      .slice(0, visibleCount);
  }, [featuredBook, livrosFiltrados, visibleCount]);

  const podeCarregarMais = livrosFiltrados.length > livrosParaLista.length + (featuredBook ? 1 : 0);
  const totalVisiveis = livrosFiltrados.length;

  if (carregando) {
    return (
      <>
        <Navbar />
        <main className={styles.pageShell}>
          <section className={styles.statusBox}>
            <BookOpenText size={34} />
            <p>Carregando biblioteca conectada à API...</p>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.pageShell}>
        <section className={styles.heroSection}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Biblioteca Global</p>
            <h1>Acervo literário com busca, filtros e catálogo vivo via API.</h1>
            <p className={styles.heroText}>
              Explore obras clássicas, descubra autores, navegue por gêneros e abra a análise de cada livro sem sair da biblioteca.
            </p>
          </div>

          <div className={styles.searchShell}>
            <Search className={styles.searchIcon} size={18} />
            <input
              className={styles.searchInput}
              placeholder="Pesquisar literatura, autores ou arquivos..."
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <button className={styles.filterButton} type="button">
            <SlidersHorizontal size={18} />
            Filtros avançados
          </button>
        </section>

        <section className={styles.featuredSection}>
            {featuredBook ? (
            <article ref={featuredRef} className={styles.featuredCard}>
              <div className={styles.featuredMedia}>
                <img
                  alt={featuredBook.titulo || "Capa do livro em destaque"}
                  className={styles.featuredImage}
                  src={featuredBook.capa_url || CAPA_PADRAO}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = CAPA_PADRAO;
                  }}
                />
              </div>

              <div className={styles.featuredContent}>
                <span className={styles.featuredBadge}>Obra em destaque</span>
                <h2>{featuredBook.titulo}</h2>
                <p className={styles.featuredMeta}>
                  {featuredBook.autor} {featuredBook.ano_publicacao ? `, ${featuredBook.ano_publicacao}` : ""}
                </p>
                <p className={styles.featuredQuote}>
                  {featuredBook.sinopse || featuredBook.resumo || "Resumo indisponível no momento."}
                </p>
                <p className={styles.featuredDescription}>
                  Acesse a obra completa, veja a leitura crítica e aprofunde o contexto histórico a partir do catálogo integrado.
                </p>

                <div className={styles.featuredActions}>
                  <button
                    className={styles.primaryButton}
                    type="button"
                    onClick={() => {
                      const criarSlug = (text) => {
                        if (!text) return '';
                        return String(text)
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/\p{Diacritic}/gu, '')
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '');
                      };

                      const routeParam = featuredBook.id ? String(featuredBook.id) : criarSlug(featuredBook.titulo || featuredBook.title || featuredBook.slug || featuredBook.tituloDoLivro || '');
                      if (routeParam) navigate(`/livro/${routeParam}`, { state: { livro: featuredBook } });
                    }}
                    disabled={!((featuredBook && (featuredBook.id || featuredBook.titulo || featuredBook.title || featuredBook.slug)))}
                  >
                    Ler online
                  </button>
                  <button className={styles.secondaryButton} type="button">
                    Ver ensaios críticos
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <article className={styles.emptyState}>
              <p>Nenhum livro encontrado com os filtros atuais.</p>
            </article>
          )}
        </section>

        <section className={styles.collectionSection}>
          <div className={styles.collectionHeader}>
            <div>
              <p className={styles.kicker}>Coleção acadêmica</p>
              <h3>{totalVisiveis} obras disponíveis</h3>
            </div>

            <div className={styles.collectionTools}>
              <select
                className={styles.select}
                value={selectedGenre}
                onChange={(event) => setSelectedGenre(event.target.value)}
              >
                {listaGeneros.map((genero) => (
                  <option key={genero} value={genero}>
                    {genero}
                  </option>
                ))}
              </select>

              <select className={styles.select} value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="melhor">Melhores avaliados</option>
                <option value="recentes">Mais recentes</option>
                <option value="alfabetico">Ordem alfabética</option>
              </select>

              <div className={styles.viewSwitch}>
                <button
                  className={`${styles.viewButton} ${layout === "grid" ? styles.viewButtonActive : ""}`}
                  type="button"
                  onClick={() => setLayout("grid")}
                  aria-label="Exibir em grade"
                >
                  <Grid2x2 size={16} />
                </button>
                <button
                  className={`${styles.viewButton} ${layout === "list" ? styles.viewButtonActive : ""}`}
                  type="button"
                  onClick={() => setLayout("list")}
                  aria-label="Exibir em lista"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {erro ? <p className={styles.errorBox}>{erro}</p> : null}

          <div className={`${styles.collectionGrid} ${layout === "list" ? styles.listLayout : ""}`}>
            {livrosParaLista.map((livro) => {
              const chave = obterChaveLivro(livro);

              return (
                <article
                  className={`${styles.bookCard} ${layout === "list" ? styles.bookCardList : ""}`}
                  key={chave}
                  onClick={() => setManualFeatured(livro)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setManualFeatured(livro);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.bookMedia}>
                    <img
                      alt={livro.titulo || "Capa do livro"}
                      className={styles.bookImage}
                      src={livro.capa_url || CAPA_PADRAO}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = CAPA_PADRAO;
                      }}
                    />
                  </div>

                  <div className={styles.bookContent}>
                    <span className={styles.authorLabel}>{livro.autor || "Autor não informado"}</span>
                    <h4>{livro.titulo}</h4>
                    <p className={styles.bookSummary}>
                      {livro.sinopse || livro.resumo || "Sinopse indisponível nesta entrada da API."}
                    </p>

                    <div className={styles.bookFooter}>
                      <span className={styles.genrePill}>{livro.genero_pt || "Geral"}</span>
                      <div className={styles.ratingRow}>
                        <Star size={14} fill="currentColor" />
                        <span>{obterRating(livro).toFixed(1)}</span>
                      </div>
                    </div>

                            <button
                              className={styles.detailsButton}
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                const criarSlug = (text) => {
                                  if (!text) return '';
                                  return String(text)
                                    .toLowerCase()
                                    .normalize('NFD')
                                    .replace(/\p{Diacritic}/gu, '')
                                    .replace(/[^a-z0-9]+/g, '-')
                                    .replace(/(^-|-$)/g, '');
                                };

                                const routeParam = livro.id ? String(livro.id) : criarSlug(livro.titulo || livro.title || livro.slug || livro.tituloDoLivro || '');
                                if (routeParam) navigate(`/livro/${routeParam}`, { state: { livro } });
                              }}
                              disabled={!((livro.id) || (livro.titulo || livro.title || livro.slug))}
                            >
                              Ver detalhes
                              <ArrowRight size={16} />
                            </button>
                  </div>
                </article>
              );
            })}
          </div>

          {!livrosFiltrados.length ? <p className={styles.emptyStateCompact}>Nenhum livro encontrado com os filtros atuais.</p> : null}

          {podeCarregarMais ? (
            <div className={styles.loadMoreWrap}>
              <button className={styles.loadMoreButton} type="button" onClick={() => setVisibleCount((count) => count + 6)}>
                Carregar mais coleções
              </button>
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}

export default Biblioteca;
