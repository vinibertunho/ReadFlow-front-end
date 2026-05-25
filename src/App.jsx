import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Livro from "./pages/Livro/Livro";
import Biblioteca from "./pages/Biblioteca de livros/Biblioteca";
import Equipe from "./pages/Equipe/Equipe";
import Vestibular from "./pages/Vestibular/Vestibular";
import Videoaulas from "./pages/Videoaulas/Videoaulas";
import Simulados from "./pages/SimuladosEQuiz/Simulados";
import Curiosidades from "./pages/Curiosidades e dicas/Curiosidades"
import Footer from "../src/components/Footer/Footer"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/biblioteca" element={<Biblioteca />} />
        <Route path="/livro/:slug" element={<Livro />} />
        {/* Rotas antigas redirecionadas para a estrutura nova */}
        <Route path="/guarani" element={<Navigate to="/livro/guarani" replace />} />
        <Route path="/quartos-despejo" element={<Navigate to="/livro/quartos-despejo" replace />} />
        <Route path="/memorias-cubas" element={<Navigate to="/livro/memorias-cubas" replace />} />
        <Route path="/bookverse" element={<Navigate to="/livro/bookverse" replace />} />
        <Route path="/vidas-secas" element={<Navigate to="/livro/vidas-secas" replace />} />
        <Route path="/equipe" element={<Equipe />} />
        <Route path="/vestibular" element={<Vestibular />} />
        <Route path="/videoaulas" element={<Videoaulas />} />
        <Route path="/simulados" element={<Simulados />} />
        <Route path="/curiosidades" element={<Curiosidades />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
