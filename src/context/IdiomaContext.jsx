import { createContext, useContext, useState, useEffect } from 'react';

const IdiomaContext = createContext();

export function useIdioma() {
    const context = useContext(IdiomaContext);

    if (!context) {
        throw new Error('useIdioma must be used within an IdiomaProvider');
    }

    return context;
}

function getIdiomaInicial() {
    const idiomaSalvo = localStorage.getItem('idioma');
    if (idiomaSalvo) return idiomaSalvo;

    const navegador = navigator.language.toLowerCase();
    if (navegador.startsWith('en')) return 'EN';

    return 'PT';
}

export function IdiomaProvider({ children }) {
    const [idioma, setIdioma] = useState(getIdiomaInicial);

    // Persiste no localStorage quando mudar
    useEffect(() => {
        localStorage.setItem('idioma', idioma);
    }, [idioma]);

    const alternarIdioma = () => {
        setIdioma((prev) => (prev === 'PT' ? 'EN' : 'PT'));
    };

    return (
        <IdiomaContext.Provider value={{ idioma, alternarIdioma }}>
            {children}
        </IdiomaContext.Provider>
    );
}
