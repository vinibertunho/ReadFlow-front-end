import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Biblioteca from './pages/Biblioteca de livros/Biblioteca';
import Curiosidades from './pages/Curiosidades e dicas/Curiosidades';
import Equipe from './pages/Equipe/Equipe';
import Videoaulas from './pages/Videoaulas/Videoaulas';
import Vestibular from './pages/Vestibular/Vestibular';
import Simulados from './pages/Simulados e quiz/Simulados';
import Livro from './pages/Livro/Livro';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/biblioteca" element={<Biblioteca />} />
                <Route path="/curiosidades" element={<Curiosidades />} />
                <Route path="/equipe" element={<Equipe />} />
                <Route path="/videoaulas" element={<Videoaulas />} />
                <Route path="/vestibular" element={<Vestibular />} />
                <Route path="/simulados" element={<Simulados />} />
                <Route path="/livro/:id" element={<Livro />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
