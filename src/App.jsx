import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Biblioteca from './pages/Biblioteca de livros/Biblioteca';
import Livro from './pages/Livro/Livro';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/biblioteca" element={<Biblioteca />} />
                <Route path="/livro" element={<Livro />} />
                <Route path="/livro/:id" element={<Livro />} />
            </Routes>
        </BrowserRouter>
    );
}


export default App;
