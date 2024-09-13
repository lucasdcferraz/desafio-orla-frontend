import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Funcionários
export const getFuncionarios = () => axios.get(`${API_URL}/funcionarios`);
export const getFuncionario = id => axios.get(`${API_URL}/funcionarios/${id}`);
export const createFuncionario = funcionario => axios.post(`${API_URL}/funcionarios`, funcionario);
export const updateFuncionario = (id, funcionario) => axios.put(`${API_URL}/funcionarios/${id}`, funcionario);
export const deleteFuncionario = id => axios.delete(`${API_URL}/funcionarios/${id}`);

// Projetos
export const getProjetos = () => axios.get(`${API_URL}/projetos`);
export const getProjeto = id => axios.get(`${API_URL}/projetos/${id}`);
export const createProjeto = projeto => axios.post(`${API_URL}/projetos`, projeto);
export const updateProjeto = (id, projeto) => axios.put(`${API_URL}/projetos/${id}`, projeto);
export const deleteProjeto = id => axios.delete(`${API_URL}/projetos/${id}`);
