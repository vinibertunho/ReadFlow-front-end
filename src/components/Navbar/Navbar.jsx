import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";


const NAV_ITEMS = [
  { path: "/", label: "Início" },
  { path: "/biblioteca", label: "Biblioteca" },
  { path: "/livro", label: "Explorar obra" },
  { path: "/equipe", label: "Equipe" },
  { path: "/vestibulandos", label: "Vestibulandos" },
  { path: "/quizzes", label: "Quiz" },
  { path: "/videoaulas", label: "Vídeos" },
  { path: "/curiosidades", label: "Curiosidades" },
];

function Navbar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path
      ? `${styles.navLink} ${styles.active}`
      : styles.navLink;
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.navBrand}>
        <h1>ReadFlow</h1>
      </Link>

      <ul className={styles.navLinks}>
        {NAV_ITEMS.map((item) => (
          <li key={item.path}>
            <Link to={item.path} className={getLinkClass(item.path)}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.language}>
        <button className={styles.langBtn}> PT/EN 🌐 </button>
      </div>
    </nav>
  );
}

export default Navbar;
