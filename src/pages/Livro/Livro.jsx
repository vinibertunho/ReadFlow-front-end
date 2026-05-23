import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./Livro.module.css";

const URL_API = "https://readflow-m8o6.onrender.com/api/livros";
const API_INTEGRACAO_URL = "https://readflow-m8o6.onrender.com/api/integracao";
const API_KEY = import.meta.env.VITE_API_KEY;

const CAPA_PADRAO =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="%23eef2ff"/><rect x="24" y="24" width="352" height="552" rx="16" fill="%23dbeafe"/><text x="200" y="300" text-anchor="middle" fill="%23334155" font-size="28" font-family="Arial">Sem capa</text></svg>';

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

function normalizarParagrafos(valor) {
  if (!valor) return [];
  if (Array.isArray(valor)) {
    return valor
      .flatMap((item) => String(item).split(/\n+/))
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

function Livro() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [livro, setLivro] = useState(location.state?.livro || null);
  const [carregando, setCarregando] = useState(!livro);
  const [erro, setErro] = useState(null);
  const [activeTab, setActiveTab] = useState("");
  const [listaPersonagens, setListaPersonagens] = useState([]);

  useEffect(() => {
    if (!livro && id) {
      async function fetchLivro() {
        try {
          setCarregando(true);
          const headersPadrao = {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${API_KEY}`,
          };

          let dadosLivro = null;

          // 1. Tenta buscar no banco local por ID
          try {
            const response = await fetch(`${URL_API}/${id}`, {
              headers: headersPadrao,
            });
            if (response.ok) {
              dadosLivro = await response.json();
            }
          } catch {
            console.log("Buscando rotas alternativas de integração...");
          }

          // 2. Se não achar local, varre a API de integração buscando por ID ou Título
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

              const termoBusca = decodeURIComponent(id).toLowerCase().trim();
              
              dadosLivro = listaUnificada.find((l) => {
                let t = l?.titulo || l?.title || l?.tituloDoLivro || "";
                let autorMapeado = l?.autor || l?.author || l?.autores || "";

                // Correção em tempo de execução para os metadados de Memórias Póstumas
                if (t.toLowerCase().includes('nao informado') && autorMapeado.toLowerCase().includes('memorias postumas')) {
                  t = "Memórias Póstumas de Brás Cubas";
                }

                const livroId = l?.id ? String(l.id).toLowerCase().trim() : "";
                return (
                  t.toLowerCase().trim() === termoBusca ||
                  livroId === termoBusca
                );
              });
            }
          }

          if (!dadosLivro)
            throw new Error("Livro não encontrado nos catálogos.");

          setLivro(dadosLivro);
        } catch (error) {
          setErro(error.message);
          console.error("Erro ao buscar livro:", error);
        } finally {
          setCarregando(false);
        }
      }

      fetchLivro();
    }
  }, [id, livro]);

  // Sincroniza os dados de personagens e define a primeira aba padrão ativa
  useEffect(() => {
    if (livro) {
      setListaPersonagens(
        normalizarParagrafos(
          livro.personagens_pt ||
            livro.personagens ||
            livro.personagens_en ||
            "",
        ),
      );
    }
  }, [livro]);

  // Efeito isolado para garantir que a activeTab seja calculada de forma correta e sem loops
  useEffect(() => {
    if (livro) {
      const resumo = obterTextoValido(livro.sinopse, livro.descricao_pt, livro.descricao_en);
      const personagensExistentes = normalizarParagrafos(livro.personagens_pt || livro.personagens || livro.personagens_en || "");
      const contextoTexto = obterTextoValido(livro.contexto_historico_pt, livro.contexto_historico_en, livro.contexto_pt, livro.contexto_en);
      
      const hasFicha = Boolean(
        obterTextoValido(livro.detalhes_autor_pt, livro.detalhes_autor_en) ||
        obterTextoValido(livro.estilo_escrita_pt, livro.estilo_escrita_en) ||
        obterTextoValido(livro.verossimilhanca_pt, livro.verossimilhanca_en) ||
        obterTextoValido(livro.caracteristicas_literarias_pt, livro.caracteristicas_literarias_en) ||
        obterTextoValido(livro.conclusao_pt, livro.conclusao_en) ||
        livro.paginas ||
        livro.ano_publicacao || 
        livro.anoPublicacao
      );

      const hasAnalise = Boolean(
        livro.simbolismo_pt || livro.simbolismo_en || 
        livro.engajamento_pt || livro.engajamento_en || 
        livro.temas_chave_pt || livro.temas_chave_en
      );

      if (resumo) setActiveTab("resumo");
      else if (personagensExistentes.length > 0) setActiveTab("personagens");
      else if (contextoTexto) setActiveTab("contexto");
      else if (hasFicha) setActiveTab("ficha");
      else if (livro.video_url) setActiveTab("video");
      else if (hasAnalise) setActiveTab("dados");
    }
  }, [livro]);

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
    genero_en,
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
    criadoEm,
    atualizadoEm,
  } = livro;

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

  const tabs = [];
  if (resumo) tabs.push({ id: "resumo", label: "Resumo" });
  if (listaPersonagens.length > 0) tabs.push({ id: "personagens", label: "Personagens" });
  if (contextoTexto) tabs.push({ id: "contexto", label: "Contexto histórico" });
  if (hasFicha) tabs.push({ id: "ficha", label: "Ficha técnica" });
  if (video_url) tabs.push({ id: "video", label: "Vídeo" });
  if (hasAnalise) tabs.push({ id: "dados", label: "Análise da obra" });

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
                alt={titulo || "Capa do livro"}
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
            {(genero_pt || genero_en) && (
              <span className={styles.tag}>{genero_pt || genero_en}</span>
            )}
            <h1 className={styles.title}>
              {titulo || "Título não cadastrado"}
            </h1>

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
              {ano && <span>📅 {ano}</span>}
              {paginas && <span>📄 {paginas} páginas</span>}
              {autor && (
                <span>
                  Autor: <strong>{autor}</strong>
                </span>
              )}
            </div>

            <div className={styles.actions}>
              {video_url && (
                <a
                  className={styles.primaryButton}
                  href={video_url}
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
                  aria-selected={activeTab === t.id}
                  className={activeTab === t.id ? styles.tabActive : styles.tab}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className={styles.tabContent}>
              {activeTab === "resumo" && resumo && (
                <section className={styles.introCard}>
                  <h2 className={styles.sectionTitle}>Resumo da obra</h2>
                  <p className={styles.fieldValue}>{resumo}</p>
                </section>
              )}

              {activeTab === "personagens" && listaPersonagens.length > 0 && (
                <section className={styles.introCard}>
                  <h2 className={styles.sectionTitle}>Personagens</h2>
                  <ul className={styles.list}>
                    {listaPersonagens.map((personagem, index) => (
                      <li key={index}>{personagem}</li>
                    ))}
                  </ul>
                </section>
              )}

              {activeTab === "contexto" && contextoTexto && (
                <section className={styles.introCard}>
                  <h2 className={styles.sectionTitle}>Contexto histórico</h2>
                  <p className={styles.fieldValue}>{contextoTexto}</p>
                </section>
              )}

              {activeTab === "ficha" && (
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

              {activeTab === "video" && video_url && (
                <section className={styles.introCard}>
                  <h2 className={styles.sectionTitle}>Conteúdo em vídeo</h2>
                  <a
                    href={video_url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.primaryButton}
                  >
                    Abrir vídeo explicativo externo
                  </a>
                </section>
              )}

              {activeTab === "dados" && (
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
                      {titulo && (
                        <li>
                          <strong>Título original:</strong> {titulo}
                        </li>
                      )}
                      {autor && (
                        <li>
                          <strong>Autor mapeado:</strong> {autor}
                        </li>
                      )}
                      {criadoEm && (
                        <li>
                          <strong>Data de cadastro:</strong>{" "}
                          {new Date(criadoEm).toLocaleDateString("pt-BR")}
                        </li>
                      )}
                      {atualizadoEm && (
                        <li>
                          <strong>Última sincronização:</strong>{" "}
                          {new Date(atualizadoEm).toLocaleDateString("pt-BR")}
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