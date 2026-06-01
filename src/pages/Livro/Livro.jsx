import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./Livro.module.css";

const URL_API = "https://readflow-m8o6.onrender.com/api/livros";
const PERSONAGENS_API = "https://readflow-m8o6.onrender.com/api/personagens";
const API_KEY = import.meta.env.VITE_API_KEY;

const CAPA_PADRAO =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="%23eef2ff"/><rect x="24" y="24" width="352" height="552" rx="16" fill="%23dbeafe"/><text x="200" y="300" text-anchor="middle" fill="%23334155" font-size="28" font-family="Arial">Sem capa</text></svg>';

const ALIASES_LIVROS = {
  "o-guarani": ["o guarani", "guarani"],
  guarani: ["o guarani", "guarani"],
  "quartos-despejo": ["quartos de despejo", "quartos-despejo"],
  "capitaes-da-areia": ["capitães da areia", "capitaes da areia", "capitães de areia"],
  "memorias-cubas": [
    "memórias póstumas de brás cubas",
    "memorias postumas de bras cubas",
    "bras cubas",
  ],
  bookverse: ["bookverse"],
  "vidas-secas": ["vidas secas", "vidas-secas"],
};

function resolverUrlCapa(url) {
  if (!url || typeof url !== "string") return "";
  const value = url.trim();
  if (!value) return "";
  if (value.includes("ibb.co/") && !value.includes("i.ibb.co/")) return "";
  return value;
}

function obterTextoValido(...valores) {
  return valores.find((v) => typeof v === "string" && v.trim())?.trim() || "";
}

function extrairNomeObjeto(valor) {
  if (!valor && valor !== 0) return "";
  if (typeof valor === "string") return valor.trim();
  if (typeof valor === "number") return String(valor);
  if (Array.isArray(valor)) return valor.map(extrairNomeObjeto).filter(Boolean).join(", ");
  if (typeof valor === "object") {
    return (
      obterTextoValido(
        valor.nome,
        valor.name,
        valor.titulo,
        valor.title,
        valor.autor,
        valor.author,
        valor.personagem,
        valor.personagemNome,
        valor.label,
        valor.displayName
      ) || ""
    );
  }
  return String(valor || "").trim();
}

function normalizarParagrafos(valor) {
  if (!valor) return [];
  if (Array.isArray(valor)) {
    return valor
      .flatMap((item) => obterTextoValido(item, "").split(/\n+/))
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (typeof valor === "object") {
    return Object.values(valor)
      .flatMap((item) => normalizarParagrafos(item))
      .filter(Boolean);
  }
  if (typeof valor === "string") {
    const texto = valor.trim();

    if (!texto) return [];

    if ((texto.startsWith("[") && texto.endsWith("]")) || (texto.startsWith("{") && texto.endsWith("}"))) {
      try {
        const parsed = JSON.parse(texto);
        return normalizarParagrafos(parsed);
      } catch {
        // segue o fluxo padrão quando não for JSON válido
      }
    }

    return valor
      .split(/\n+|\s*;\s*|\s*,\s*|\s*\|\s*/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizarChave(valor = "") {
  return String(valor)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function obterChavesBusca(routeId = "") {
  const chave = normalizarChave(routeId);
  if (!chave) return [];

  const candidatos = new Set([chave]);
  (ALIASES_LIVROS[chave] || []).forEach((item) =>
    candidatos.add(normalizarChave(item)),
  );

  return Array.from(candidatos);
}

function extrairListaResposta(resposta) {
  if (!resposta) return [];

  const dadosBase = resposta.data ?? resposta;

  if (Array.isArray(dadosBase)) return dadosBase;

  if (dadosBase && typeof dadosBase === "object") {
    if (Array.isArray(dadosBase.conteudo)) return dadosBase.conteudo;
    if (Array.isArray(dadosBase.personagens)) return dadosBase.personagens;
    if (Array.isArray(dadosBase.items)) return dadosBase.items;
    if (Array.isArray(dadosBase.data)) return dadosBase.data;
  }

  return [];
}

function Livro() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const routeId =
    id || location.pathname.split("/livro/")[1]?.split("/")[0] || "";

  const [livro, setLivro] = useState(location.state?.livro || null);
  const [carregando, setCarregando] = useState(!livro);
  const [erro, setErro] = useState(null);
  const [personagens, setPersonagens] = useState([]);

  // Controlamos apenas o ID da aba ativa como estado recarregável
  const [activeTab, setActiveTab] = useState("");

  // 1. useEffect Corrigido (Apenas routeId como dependência)
  useEffect(() => {
    if (livro) return;

    async function fetchLivro() {
      try {
        setCarregando(true);
        setErro(null);
        const headersPadrao = {
          "Content-Type": "application/json",
        };

        if (API_KEY) {
          headersPadrao["x-api-key"] = API_KEY;
          headersPadrao.Authorization = `Bearer ${API_KEY}`;
        }

        let dadosLivro = null;

        try {
          const resposta = await fetch(URL_API, {
            headers: headersPadrao,
          });
          if (resposta.status === 401) {
            throw new Error("A API exigiu autenticação. Defina VITE_API_KEY no .env para acessar os livros.");
          }
          if (resposta.ok) {
            const resultadoJson = await resposta.json();
            const dadosBase = resultadoJson?.data || resultadoJson || [];

            const listaUnificada = [];
            if (Array.isArray(dadosBase)) {
              dadosBase.forEach((item) => {
                if (item && Array.isArray(item.conteudo)) {
                  listaUnificada.push(...item.conteudo);
                } else if (item) {
                  listaUnificada.push(item);
                }
              });
            }

            const termosBusca = obterChavesBusca(routeId);
            const termoBuscaRaw = normalizarChave(decodeURIComponent(routeId));
            const slugify = (text) =>
              String(text || "")
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

            const termoBusca = termoBuscaRaw;

            const matchLivro = listaUnificada.find((l) => {
              let t = l?.titulo || l?.title || l?.tituloDoLivro || "";
              const autorMapeado = l?.autor || l?.author || l?.autores || "";

              if (normalizarChave(t).includes("nao informado") && normalizarChave(autorMapeado).includes("memorias postumas")) {
                t = "Memórias Póstumas de Brás Cubas";
              }

              if (!t && normalizarChave(autorMapeado).includes("memoria")) {
                t = autorMapeado;
              }

              const livroId = l?.id ? String(l.id).toLowerCase().trim() : "";
              const tituloNormalizado = normalizarChave(t);
              const tituloSlug = slugify(t);
              const tituloSlugNormalizado = normalizarChave(tituloSlug);
              const termosNormalizados = termosBusca.map(normalizarChave);

              return (
                tituloNormalizado === termoBusca ||
                tituloSlugNormalizado === termoBusca ||
                livroId === termoBusca ||
                termosNormalizados.includes(tituloNormalizado) ||
                termosNormalizados.includes(tituloSlugNormalizado)
              );
            });

            if (matchLivro) {
              dadosLivro = matchLivro;
            }
          }
        } catch {
          console.log("Erro ao buscar catálogo principal.");
        }

        if (!dadosLivro) throw new Error("Livro não encontrado nos catálogos.");

        // Normaliza dados antes de guardar
        if (!dadosLivro.titulo && dadosLivro.autor && normalizarChave(dadosLivro.autor).includes("memoria")) {
          const autorOriginal = dadosLivro.autor;
          dadosLivro.titulo = autorOriginal;
          dadosLivro.autor = "Machado de Assis";
        }

        setLivro(dadosLivro);
      } catch (error) {
        setErro(error.message);
        console.error("Erro ao buscar livro:", error);
      } finally {
        setCarregando(false);
      }
    }

    if (routeId) {
      fetchLivro();
    }
  }, [routeId, livro]);

  useEffect(() => {
    if (normalizarChave(routeId) !== "capitaes-da-areia") {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 6000);

    async function fetchPersonagens() {
      try {
        const headersPadrao = {
          "Content-Type": "application/json",
        };

        if (API_KEY) {
          headersPadrao["x-api-key"] = API_KEY;
          headersPadrao.Authorization = `Bearer ${API_KEY}`;
        }

        const resposta = await fetch(PERSONAGENS_API, {
          headers: headersPadrao,
          signal: controller.signal,
        });

        if (!resposta.ok) return;

        const resultadoJson = await resposta.json();
        const itens = extrairListaResposta(resultadoJson);

        const nomes = itens
          .flatMap((item) => {
            if (typeof item === "string") return normalizarParagrafos(item);
            if (typeof item === "object") {
              const nome = extrairNomeObjeto(item);
              return nome ? [nome] : [];
            }
            return [];
          })
          .filter(Boolean);

        setPersonagens(Array.from(new Set(nomes)));
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error("Erro ao buscar personagens:", error);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }

    fetchPersonagens();

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [routeId]);

  if (carregando) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.status}>Carregando dados da obra... 📚</p>
        </div>
      </div>
    );
  }

  if (erro || !livro) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.error}>
            {erro || "Obra indisponível no momento."}
          </p>
          <button onClick={() => navigate(-1)} className={styles.botaoRoxo}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const {
    titulo,
    autor,
    capa_url,
    imagem,
    imagem_url,
    capas,
    foto,
    genero_pt,
    sinopse,
    descricao_pt,
    descricao_en,
    contexto_pt,
    contexto_en,
    contexto_historico_pt,
    contexto_historico_en,
    simbolismo_pt,
    simbolismo_en,
    engajamento_pt,
    engajamento_en,
    temas_chave_pt,
    temas_chave_en,
    detalhes_autor_pt,
    detalhes_autor_en,
    estilo_escrita_pt,
    estilo_escrita_en,
    verossimilhanca_pt,
    verossimilhanca_en,
    caracteristicas_literarias_pt,
    caracteristicas_literarias_en,
    conclusao_pt,
    conclusao_en,
    video_url,
    ano_publicacao,
    anoPublicacao,
    paginas,
    avaliacao,
    media_avaliacao,
    avaliacao_media,
  } = livro;

  const tituloTexto = obterTextoValido(titulo, livro.titulo, livro.title, livro.tituloDoLivro);
  const generoTexto = obterTextoValido(genero_pt, livro.genero, livro.genre);
  const videoUrl = video_url;
  const capaImagem = resolverUrlCapa(capa_url || imagem_url || imagem || capas || foto || "");
  const ano = ano_publicacao || anoPublicacao || null;
  const rating = parseFloat(avaliacao || media_avaliacao || avaliacao_media || 0);

  const resumo = obterTextoValido(sinopse, descricao_pt, descricao_en);
  const contextoTexto = obterTextoValido(contexto_historico_pt, contexto_historico_en, contexto_pt, contexto_en);
  const detalhesAutor = obterTextoValido(detalhes_autor_pt, detalhes_autor_en);
  const estilo = obterTextoValido(estilo_escrita_pt, estilo_escrita_en);
  const verossimilhanca = obterTextoValido(verossimilhanca_pt, verossimilhanca_en);
  const caracteristicas = obterTextoValido(caracteristicas_literarias_pt, caracteristicas_literarias_en);
  const conclusao = obterTextoValido(conclusao_pt, conclusao_en);

  const simbolismoTexto = obterTextoValido(simbolismo_pt, simbolismo_en);
  const engajamentoTexto = obterTextoValido(engajamento_pt, engajamento_en);
  const temasTexto = obterTextoValido(temas_chave_pt, temas_chave_en);

  const simbolismoLines = normalizarParagrafos(simbolismoTexto);
  const engajamentoLines = normalizarParagrafos(engajamentoTexto);
  const temasLines = normalizarParagrafos(temasTexto);

  const hasFicha = Boolean(detalhesAutor || estilo || verossimilhanca || caracteristicas || conclusao || paginas || ano);
  const hasAnalise = Boolean(simbolismoTexto || engajamentoTexto || temasTexto);
  const autorDisplay = extrairNomeObjeto(autor) || extrairNomeObjeto(livro.author) || extrairNomeObjeto(livro.autores) || "";
  const activeTabPadrao = "resumo";
  const abaAtiva = activeTab || activeTabPadrao;

  const routeNormalizado = normalizarChave(routeId);
  const isCapitaesDaAreia =
    routeNormalizado === "capitaes-da-areia" ||
    normalizarChave(tituloTexto).includes("capitaes da areia") ||
    normalizarChave(tituloTexto).includes("capitaes de areia");

  const listaPersonagens = isCapitaesDaAreia ? personagens : [];

  const tabs = [
    { id: "resumo", label: "Resumo" },
    { id: "contexto", label: "Contexto histórico" },
    { id: "ficha", label: "Ficha técnica" },
    { id: "dados", label: "Análise da obra" },
  ];

  if (isCapitaesDaAreia && listaPersonagens.length > 0) {
    tabs.splice(1, 0, { id: "personagens", label: "Personagens" });
  }

  if (videoUrl) {
    tabs.splice(3, 0, { id: "video", label: "Vídeo" });
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button onClick={() => navigate(-1)} className={styles.voltarBtn}>
          ← Voltar ao catálogo
        </button>

        <section className={styles.hero}>
          <div className={styles.coverCard}>
            {capaImagem ? (
              <img
                src={capaImagem}
                alt={tituloTexto || "Capa do livro"}
                className={styles.coverImage}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = CAPA_PADRAO;
                }}
              />
            ) : (
              <div className={styles.coverFallback}>Sem capa</div>
            )}
          </div>

          <div className={styles.heroContent}>
            {generoTexto && <span className={styles.tag}>{generoTexto}</span>}
            <h1 className={styles.title}>{tituloTexto}</h1>

            {rating > 0 && (
              <div className={styles.ratingRow}>
                <div className={styles.ratingStars} aria-hidden>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.17L12 18.896l-7.336 3.872 1.402-8.17L.132 9.21l8.2-1.192z"
                        fill={i <= Math.round(rating) ? "#fbbf24" : "#e5e7eb"}
                      />
                    </svg>
                  ))}
                </div>
                <span className={styles.ratingNumber}>{rating.toFixed(1)}</span>
              </div>
            )}

            <div className={styles.metaInfo}>
              {anoPublicacao && <span>📅 {anoPublicacao}</span>}
              {paginas && <span>📄 {paginas} páginas</span>}
              {autorDisplay && (
                <span>
                  Autor: <strong>{autorDisplay}</strong>
                </span>
              )}
            </div>

            <div className={styles.actions}>
              {videoUrl && (
                <a
                  className={styles.primaryButton}
                  href={videoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Assistir vídeo
                </a>
              )}
              <button
                className={styles.secondaryButton}
                onClick={() => navigate("/biblioteca")}
              >
                Ver catálogo
              </button>
            </div>
          </div>
        </section>

        {tabs.length > 0 && (
          <main className={styles.main}>
            <div
              className={styles.tabsBar}
              role="tablist"
              aria-label="Seções do livro"
            >
              {tabs.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={abaAtiva === t.id}
                  className={abaAtiva === t.id ? styles.tabActive : styles.tab}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className={styles.tabContent}>
              {abaAtiva === "resumo" && resumo && (
                <section className={styles.introCard}>
                  <h2 className={styles.sectionTitle}>Resumo da obra</h2>
                  <p className={styles.fieldValue}>{resumo}</p>
                </section>
              )}

              {abaAtiva === "resumo" && !resumo && (
                <section className={styles.introCard}>
                  <h2 className={styles.sectionTitle}>Resumo da obra</h2>
                  <p className={styles.fieldValue}>Resumo indisponível no momento.</p>
                </section>
              )}

              {abaAtiva === "contexto" && contextoTexto && (
                <section className={styles.introCard}>
                  <h2 className={styles.sectionTitle}>Contexto histórico</h2>
                  <p className={styles.fieldValue}>{contextoTexto}</p>
                </section>
              )}

              {abaAtiva === "contexto" && !contextoTexto && (
                <section className={styles.introCard}>
                  <h2 className={styles.sectionTitle}>Contexto histórico</h2>
                  <p className={styles.fieldValue}>Contexto histórico indisponível no momento.</p>
                </section>
              )}

              {abaAtiva === "personagens" && isCapitaesDaAreia && listaPersonagens.length > 0 && (
                <section className={styles.introCard}>
                  <h2 className={styles.sectionTitle}>Personagens</h2>
                  <ul className={styles.list}>
                    {listaPersonagens.map((personagem, index) => (
                      <li key={index}>{personagem}</li>
                    ))}
                  </ul>
                </section>
              )}

              {abaAtiva === "personagens" && isCapitaesDaAreia && listaPersonagens.length === 0 && (
                <section className={styles.introCard}>
                  <h2 className={styles.sectionTitle}>Personagens</h2>
                  <p className={styles.fieldValue}>Personagens indisponíveis no momento.</p>
                </section>
              )}

              {abaAtiva === "ficha" && (
                <section className={styles.grid}>
                  {detalhesAutor && (
                    <article className={styles.field}>
                      <p className={styles.fieldLabel}>Sobre o autor</p>
                      <p className={styles.fieldValue}>{detalhesAutor}</p>
                    </article>
                  )}
                  {estilo && (
                    <article className={styles.field}>
                      <p className={styles.fieldLabel}>Estilo de escrita</p>
                      <p className={styles.fieldValue}>{estilo}</p>
                    </article>
                  )}
                  {verossimilhanca && (
                    <article className={styles.field}>
                      <p className={styles.fieldLabel}>Verossimilhança</p>
                      <p className={styles.fieldValue}>{verossimilhanca}</p>
                    </article>
                  )}
                  {caracteristicas && (
                    <article className={styles.field}>
                      <p className={styles.fieldLabel}>
                        Características literárias
                      </p>
                      <p className={styles.fieldValue}>{caracteristicas}</p>
                    </article>
                  )}
                  {conclusao && (
                    <article className={styles.field}>
                      <p className={styles.fieldLabel}>Conclusão</p>
                      <p className={styles.fieldValue}>{conclusao}</p>
                    </article>
                  )}
                  {!hasFicha && (
                    <article className={styles.field}>
                      <p className={styles.fieldLabel}>Ficha técnica</p>
                      <p className={styles.fieldValue}>Dados técnicos indisponíveis no momento.</p>
                    </article>
                  )}
                </section>
              )}

              {abaAtiva === "video" && videoUrl && (
                <section className={styles.introCard}>
                  <h2 className={styles.sectionTitle}>Conteúdo em vídeo</h2>
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.primaryButton}
                  >
                    Abrir vídeo explicativo externo
                  </a>
                </section>
              )}

              {abaAtiva === "video" && !videoUrl && (
                <section className={styles.introCard}>
                  <h2 className={styles.sectionTitle}>Conteúdo em vídeo</h2>
                  <p className={styles.fieldValue}>Vídeo indisponível no momento.</p>
                </section>
              )}

              {abaAtiva === "dados" && (
                <section>
                  <div className={styles.analysisGrid}>
                    {simbolismoLines.length > 0 && (
                      <div className={styles.analysisCard}>
                        <h3 className={styles.analysisCardTitle}>Simbolismo</h3>
                        <div className={styles.analysisCardContent}>
                          {simbolismoLines.map((line, idx) => (
                            <p key={idx} className={styles.fieldValue}>
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {engajamentoLines.length > 0 && (
                      <div className={styles.analysisCard}>
                        <h3 className={styles.analysisCardTitle}>
                          Engajamento
                        </h3>
                        <div className={styles.analysisCardContent}>
                          {engajamentoLines.map((line, idx) => (
                            <p key={idx} className={styles.fieldValue}>
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {temasLines.length > 0 && (
                      <div className={styles.analysisCard}>
                        <h3 className={styles.analysisCardTitle}>
                          Temas chave
                        </h3>
                        <div className={styles.analysisCardContent}>
                          {temasLines.map((line, idx) => (
                            <p key={idx} className={styles.fieldValue}>
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {!hasAnalise && (
                      <div className={styles.analysisCard}>
                        <h3 className={styles.analysisCardTitle}>Análise da obra</h3>
                        <div className={styles.analysisCardContent}>
                          <p className={styles.fieldValue}>
                            Análise indisponível no momento.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={styles.introCard}>
                    <h2 className={styles.sectionTitle}>
                      Metadados do Registro
                    </h2>
                    <div className={styles.metaGrid}>
                      {tituloTexto && (
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Título original</span>
                          <span className={styles.metaValue}>{tituloTexto}</span>
                        </div>
                      )}
                      {autorDisplay && (
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Autor</span>
                          <span className={styles.metaValue}>{autorDisplay}</span>
                        </div>
                      )}
                      {livro.criadoEm && (
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Data de cadastro</span>
                          <span className={styles.metaValue}>
                            {new Date(livro.criadoEm).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      )}
                      {livro.atualizadoEm && (
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Última sincronização</span>
                          <span className={styles.metaValue}>
                            {new Date(livro.atualizadoEm).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}
            </div>
          </main>
        )}
      </div>
    </div>
  ); 
}

export default Livro;
