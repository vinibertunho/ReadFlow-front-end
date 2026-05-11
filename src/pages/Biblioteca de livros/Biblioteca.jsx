import { useEffect, useState } from "react";
import BookCard from '../../components/BookCard/BookCard';

const API_URL = "https://readflow-m8o6.onrender.com/api/livros";

function Biblioteca() {
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchLivros() {
      try {
        setCarregando(true);

        const response = await fetch(API_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error('Não foi possível carregar os livros.');
        }

        const data = await response.json();
        setLivros(Array.isArray(data) ? data : []);
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


  if (carregando) {
    return (
      <main style={{ padding: '2rem' }}>
        <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>Carregando catálogo... 📚</p>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <span style={{ display: 'inline-block', color: '#6b7280', fontSize: '0.9rem' }}>NOSSA COLEÇÃO</span>
        <h1 style={{ fontSize: '2rem', margin: '0.25rem 0 0.5rem' }}>Biblioteca de Livros</h1>
        <div style={{ height: '3px', width: '80px', background: '#4f46e5', borderRadius: '2px' }} />
      </header>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginTop: '1.5rem',
      }}>
        {livros.map((livro) => (
          <BookCard key={livro.id} dados={livro} />
        ))}
      </section>
    </main>
  );
}

export default Biblioteca;
