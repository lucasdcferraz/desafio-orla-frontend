import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import FuncionarioPage from './pages/FuncionarioPage';
import ProjetoPage from './pages/ProjetoPage';
import './style.css';

const Menu = () => {
    const location = useLocation(); 

    return (
        <nav className="nav-links">
            <Link 
                to="/funcionarios" 
                className={location.pathname === '/funcionarios' ? 'active' : ''}
            >
                FUNCIONÁRIOS
            </Link>
            <Link 
                to="/projetos" 
                className={location.pathname === '/projetos' ? 'active' : ''}
            >
                PROJETOS
            </Link>
        </nav>
    );
};

const App = () => {
    return (
        <Router>
            <div>
                <header>
                    <div className="header-container">
                        <Link to="/" className="logo">
                            <img src="/orla-logo.png" alt="Desafio Orla Logo" className="logo-img" />
                        </Link>
                        <Menu />
                    </div>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={
                            <div className="home-page">
                                <img src="/fundo.png" alt="Fundo" className="image-fundo" />
                                <div className="texto-orla">
                                    <h1>Orla - frontend</h1>
                                </div>
                                <div className="texto-descricao">
                                    <p>Gestão de projetos e funcionários, com operações de criação, leitura, atualização e exclusão de dados, além de permitir associar funcionários a projetos e vice-versa.</p>
                                </div>
                            </div>
                        } />
                        <Route path="/funcionarios/*" element={<FuncionarioPage />} />
                        <Route path="/projetos/*" element={<ProjetoPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
