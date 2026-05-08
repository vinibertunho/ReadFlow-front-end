import styles from './Biblioteca.module.css';
import Navbar from '../../components/Navbar/Navbar';

const books = [
    {
        id: 1,
        title: 'Capitães da Areia',
        author: 'Jorge Amado',
        cover: 'https://m.media-amazon.com/images/I/817+f2vshsL._AC_UF1000,1000_QL80_.jpg',
        year: '1937',
    },
    {
        id: 2,
        title: 'O Cortiço',
        author: 'Aluísio Azevedo',
        cover: 'https://m.media-amazon.com/images/I/71p-Z3m76zL.jpg',
        year: '1890',
    },
    {
        id: 3,
        title: 'Dom Casmurro',
        author: 'Machado de Assis',
        cover: 'https://m.media-amazon.com/images/I/81aY1lxkS9L.jpg',
        year: '1899',
    },
    {
        id: 4,
        title: 'Memórias de um Sargento de Milícias',
        author: 'Manuel Antônio de Almeida',
        cover: 'https://m.media-amazon.com/images/I/71pQ7nVnFUL.jpg',
        year: '1852',
    },
    {
        id: 5,
        title: 'Quincas Borba',
        author: 'Machado de Assis',
        cover: 'https://m.media-amazon.com/images/I/81gJCHHqYdL.jpg',
        year: '1891',
    },
    {
        id: 6,
        title: 'Senhora',
        author: 'José de Alencar',
        cover: 'https://m.media-amazon.com/images/I/71iQ5pxzJiL.jpg',
        year: '1875',
    },
    {
        id: 7,
        title: 'Grande Sertão: Veredas',
        author: 'Guimarães Rosa',
        cover: 'https://m.media-amazon.com/images/I/71VsYm5kVJL.jpg',
        year: '1956',
    },
    {
        id: 8,
        title: 'Vidas Secas',
        author: 'Graciliano Ramos',
        cover: 'https://m.media-amazon.com/images/I/71KS-8YFUUL.jpg',
        year: '1938',
    },
];

function Biblioteca() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Navbar />
                <div className={styles.headerContent}>
                    <h1>Biblioteca de Livros</h1>
                    <p>Explore obras clássicas da literatura brasileira</p>
                </div>
            </header>

            <section className={styles.librarySection}>
                <div className={styles.filtersBar}>
                    <input
                        type="text"
                        placeholder="Pesquisar por título ou autor..."
                        className={styles.searchInput}
                    />
                    <select className={styles.filterSelect}>
                        <option value="">Ordenar por...</option>
                        <option value="az">A - Z</option>
                        <option value="recent">Mais recentes</option>
                        <option value="classic">Clássicos</option>
                    </select>
                </div>

                <div className={styles.booksGrid}>
                    {books.map((book) => (
                        <div key={book.id} className={styles.bookCard}>
                            <div className={styles.bookCover}>
                                <img src={book.cover} alt={book.title} />
                                <div className={styles.overlay}>
                                    <button className={styles.explorerBtn}>Explorar</button>
                                </div>
                            </div>
                            <div className={styles.bookInfo}>
                                <h3>{book.title}</h3>
                                <p className={styles.author}>{book.author}</p>
                                <p className={styles.year}>{book.year}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Biblioteca;
