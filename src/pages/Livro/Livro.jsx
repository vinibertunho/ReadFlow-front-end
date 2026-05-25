import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./Livro.module.css";

const URL_API = "https://readflow-m8o6.onrender.com/api/livros";
const API_INTEGRACAO_URL = "https://readflow-m8o6.onrender.com/api/integracao";
const API_KEY = import.meta.env.VITE_API_KEY;

const CAPA_PADRAO =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="%23eef2ff"/><rect x="24" y="24" width="352" height="552" rx="16" fill="%23dbeafe"/><text x="200" y="300" text-anchor="middle" fill="%23334155" font-size="28" font-family="Arial">Sem capa</text></svg>';

const ALIASES_LIVROS = {
  "o-guarani": ["o guarani", "guarani"],
  guarani: ["o guarani", "guarani"],
  "quartos-despejo": ["quartos de despejo", "quartos-despejo"],
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

function textoIndesejado(valor) {
  const texto = String(valor || "").toLowerCase();
  return (
    texto.includes("fontes de apoio") ||
    texto.includes("fonte de apoio") ||
    texto.includes("cnnbrasil.com.br") ||
    texto.includes("fonte:")
  );
}

function textoSeguro(valor, fallback = "") {
  if (typeof valor === "string") {
    const texto = valor.trim();
    if (!texto || textoIndesejado(texto)) return fallback;
    return texto;
  }
  if (typeof valor === "number" || typeof valor === "boolean")
    return String(valor);

  if (Array.isArray(valor)) {
    const itens = valor.map((item) => textoSeguro(item, "")).filter(Boolean);
    return itens.join("\n") || fallback;
  }

  if (valor && typeof valor === "object") {
    const candidatos = [
      valor.nome,
      valor.name,
      valor.titulo,
      valor.title,
      valor.descricao,
      valor.biografia,
      valor.contextoHistorico,
      valor.texto,
    ];

    for (const candidato of candidatos) {
      const texto = textoSeguro(candidato, "");
      if (texto) return texto;
    }

    return fallback;
  }

  return fallback;
}

function normalizarParagrafos(valor) {
  if (!valor) return [];
  if (Array.isArray(valor)) {
    return valor
      .flatMap((item) => textoSeguro(item, "").split(/\n+/))
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (typeof valor === "string") {
    return valor
      .split(/\n+|\s*;\s*/)
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

function Livro() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const routeId =
    id || location.pathname.split("/livro/")[1]?.split("/")[0] || "";

  const [livro, setLivro] = useState(location.state?.livro || null);
  const [carregando, setCarregando] = useState(!livro);
  const [erro, setErro] = useState(null);

  // Controlamos apenas o ID da aba ativa como estado recarregável
  const [activeTab, setActiveTab] = useState("");
  const livroBase = livro || {};

  // 1. useEffect Corrigido (Apenas routeId como dependência)
  useEffect(() => {
    if (livro) return;

    // Se o livro já veio por state, não busca de novo
    async function fetchLivro() {
      try {
        setCarregando(true);
        setErro(null);
        const headersPadrao = {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${API_KEY}`,
        };

        let dadosLivro = null;

        // Tenta buscar no banco local por ID
        try {
          const response = await fetch(`${URL_API}/${routeId}`, {
            headers: headersPadrao,
          });
          if (response.ok) {
            dadosLivro = await response.json();
          }
        } catch {
          console.log("Buscando rotas alternativas de integração...");
        }

        // Se não achar local, varre a API de integração
        if (!dadosLivro) {
          const resposta = await fetch(API_INTEGRACAO_URL, {
            headers: headersPadrao,
          });
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

            dadosLivro = listaUnificada.find((l) => {
              let t = l?.titulo || l?.title || l?.tituloDoLivro || "";
              let autorMapeado = l?.autor || l?.author || l?.autores || "";

              if (!t && autorMapeado.toLowerCase().includes("memória")) {
                t = autorMapeado;
                autorMapeado = "Machado de Assis";
              }

              if (
                t.toLowerCase().includes("nao informado") &&
                autorMapeado.toLowerCase().includes("memorias postumas")
              ) {
                t = "Memórias Póstumas de Brás Cubas";
              }

              const livroId = l?.id ? String(l.id).toLowerCase().trim() : "";
              const tituloNormalizado = normalizarChave(t);

              return (
                termosBusca.includes(tituloNormalizado) ||
                termosBusca.includes(livroId)
              );
            });
          }
        }

        if (!dadosLivro) throw new Error("Livro não encontrado nos catálogos.");

        // Normaliza dados antes de guardar
        if (
          !dadosLivro.titulo &&
          dadosLivro.autor &&
          dadosLivro.autor.toLowerCase().includes("memória")
        ) {
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

  const tituloTexto = textoSeguro(livroBase.titulo, "Título não cadastrado");
  const autorTexto = textoSeguro(livroBase.autor, "Autor não informado");
  const generoTexto = textoSeguro(
    livroBase.genero_pt || livroBase.genero_en,
    "",
  );
  const resumo = obterTextoValido(
    textoSeguro(livroBase.sinopse, ""),
    textoSeguro(livroBase.descricao_pt, ""),
    textoSeguro(livroBase.descricao_en, ""),
  );
  const contextoTexto = obterTextoValido(
    textoSeguro(livroBase.contexto_historico_pt, ""),
    textoSeguro(livroBase.contexto_historico_en, ""),
    textoSeguro(livroBase.contexto_pt, ""),
    textoSeguro(livroBase.contexto_en, ""),
  );
  const detalhesAutor = obterTextoValido(
    textoSeguro(livroBase.detalhes_autor_pt, ""),
    textoSeguro(livroBase.detalhes_autor_en, ""),
  );
  const estilo = obterTextoValido(
    textoSeguro(livroBase.estilo_escrita_pt, ""),
    textoSeguro(livroBase.estilo_escrita_en, ""),
  );
  const verossimilhanca = obterTextoValido(
    textoSeguro(livroBase.verossimilhanca_pt, ""),
    textoSeguro(livroBase.verossimilhanca_en, ""),
  );
  const caracteristicas = obterTextoValido(
    textoSeguro(livroBase.caracteristicas_literarias_pt, ""),
    textoSeguro(livroBase.caracteristicas_literarias_en, ""),
  );
  const conclusao = obterTextoValido(
    textoSeguro(livroBase.conclusao_pt, ""),
    textoSeguro(livroBase.conclusao_en, ""),
  );
  const anoPublicacao =
    livroBase.ano_publicacao || livroBase.anoPublicacao || null;
  const listaPersonagens = normalizarParagrafos(
    textoSeguro(
      livroBase.personagens_pt ||
        livroBase.personagens ||
        livroBase.personagens_en ||
        "",
      "",
    ),
  );
  const simbolismoLines = normalizarParagrafos(
    obterTextoValido(
      textoSeguro(livroBase.simbolismo_pt, ""),
      textoSeguro(livroBase.simbolismo_en, ""),
    ),
  );
  const engajamentoLines = normalizarParagrafos(
    obterTextoValido(
      textoSeguro(livroBase.engajamento_pt, ""),
      textoSeguro(livroBase.engajamento_en, ""),
    ),
  );
  const temasLines = normalizarParagrafos(
    obterTextoValido(
      textoSeguro(livroBase.temas_chave_pt, ""),
      textoSeguro(livroBase.temas_chave_en, ""),
    ),
  );

  const hasFicha = Boolean(
    detalhesAutor ||
    estilo ||
    verossimilhanca ||
    caracteristicas ||
    conclusao ||
    livroBase.paginas ||
    anoPublicacao,
  );
  const hasAnalise = Boolean(
    simbolismoLines.length ||
    engajamentoLines.length ||
    temasLines.length ||
    livroBase.simbolismo_pt ||
    livroBase.simbolismo_en ||
    livroBase.engajamento_pt ||
    livroBase.engajamento_en ||
    livroBase.temas_chave_pt ||
    livroBase.temas_chave_en,
  );

  const tabs = [];
  if (resumo) tabs.push({ id: "resumo", label: "Sinopse" });
  if (listaPersonagens.length > 0)
    tabs.push({ id: "personagens", label: "Personagens" });
  if (contextoTexto) tabs.push({ id: "contexto", label: "Contexto Histórico" });
  if (hasFicha) tabs.push({ id: "ficha", label: "Especificações Técnicas" });
  if (livroBase.video_url) tabs.push({ id: "video", label: "Vídeo" });
  if (hasAnalise) tabs.push({ id: "dados", label: "Análise" });
  const abaAtiva = tabs.some((tab) => tab.id === activeTab)
    ? activeTab
    : tabs[0]?.id || "";

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

  const capaImagem = resolverUrlCapa(
    textoSeguro(
      livro.capa_url ||
        livro.imagem_url ||
        livro.imagem ||
        livro.capas ||
        livro.foto ||
        "",
      "",
    ),
  );
  const paginas = livro.paginas;
  const videoUrl = livro.video_url;
  const rating = parseFloat(
    livro.avaliacao || livro.media_avaliacao || livro.avaliacao_media || 0,
  );

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
              {autorTexto && (
                <span>
                  Autor: <strong>{autorTexto}</strong>
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

              {abaAtiva === "personagens" && listaPersonagens.length > 0 && (
                <section className={styles.introCard}>
                  <h2 className={styles.sectionTitle}>Personagens</h2>
                  <ul className={styles.list}>
                    {listaPersonagens.map((personagem, index) => (
                      <li key={index}>{personagem}</li>
                    ))}
                  </ul>
                </section>
              )}

              {abaAtiva === "contexto" && contextoTexto && (
                <section className={styles.introCard}>
                  <h2 className={styles.sectionTitle}>Contexto histórico</h2>
                  <p className={styles.fieldValue}>{contextoTexto}</p>
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
                  </div>

                  <div className={styles.introCard}>
                    <h2 className={styles.sectionTitle}>
                      Metadados do Registro
                    </h2>
                    <ul className={styles.list}>
                      {tituloTexto && (
                        <li>
                          <strong>Título original:</strong> {tituloTexto}
                        </li>
                      )}
                      {autorTexto && (
                        <li>
                          <strong>Autor mapeado:</strong> {autorTexto}
                        </li>
                      )}
                      {livro.criadoEm && (
                        <li>
                          <strong>Data de cadastro:</strong>{" "}
                          {new Date(livro.criadoEm).toLocaleDateString("pt-BR")}
                        </li>
                      )}
                      {livro.atualizadoEm && (
                        <li>
                          <strong>Última sincronização:</strong>{" "}
                          {new Date(livro.atualizadoEm).toLocaleDateString(
                            "pt-BR",
                          )}
                        </li>
                      )}
                    </ul>
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
