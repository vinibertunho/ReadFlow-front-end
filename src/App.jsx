import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Livro from "./pages/Livro/Livro";
import Biblioteca from "./pages/Biblioteca de livros/Biblioteca";
import Equipe from "./pages/Equipe/Equipe";
import Vestibular from "./pages/Vestibular/Vestibular";
import Videoaulas from "./pages/Videoaulas/Videoaulas";
import Simulados from "./pages/Simulados e quiz/Simulados";
import Footer from "../src/components/Footer/Footer"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/biblioteca" element={<Biblioteca />} />
        <Route path="/livro/:id" element={<Livro />} />
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
