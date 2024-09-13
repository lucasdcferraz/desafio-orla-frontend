import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Container, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './ProjetoPage.css';

const ProjetoPage = () => {
    const [projetos, setProjetos] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [selectedProjeto] = useState(null);
    const [form, setForm] = useState({
        nome: '',
        dataCriacao: '',
        funcionarioIds: []
    });
    const [errors, setErrors] = useState({
        nome: false,
        dataCriacao: false,
        funcionarioIds: false
    });

    const navigate = useNavigate();

    const fetchProjetos = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/projetos');
            const projetosFormatados = response.data.map((p) => ({
                ...p,
                dataCriacao: formatDate(p.dataCriacao) 
            }));
            setProjetos(projetosFormatados);
            setLoading(false);
        } catch (err) {
            setError('Erro ao buscar projetos');
            setLoading(false);
        }
    }, []);

    const fetchFuncionarios = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/funcionarios');
            setFuncionarios(response.data);
        } catch (err) {
            setError('Erro ao buscar funcionários');
        }
    }, []);

    useEffect(() => {
        fetchProjetos();
        fetchFuncionarios();
    }, [fetchProjetos, fetchFuncionarios]);

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const day = d.getUTCDate().toString().padStart(2, '0');
        const month = (d.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = d.getUTCFullYear();
        return `${year}-${month}-${day}`;
    };

    const parseDate = (date) => {
        if (!date) return '';
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleOpen = (projeto) => {
        setEditItem(projeto);
        setForm({
            nome: projeto ? projeto.nome : '', 
            dataCriacao: projeto ? formatDate(projeto.dataCriacao) : '',
            funcionarioIds: projeto && projeto.funcionarios ? projeto.funcionarios.map(f => f.id) : []
        });
        setErrors({
            nome: false,
            dataCriacao: false,
            funcionarioIds: false
        });
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/projetos/${deleteId}`);
            fetchProjetos();
            setConfirmOpen(false);
            setDeleteId(null);
        } catch (err) {
            setError('Erro ao deletar projeto');
        }
    };

    const handleConfirmOpen = (id) => {
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const handleConfirmClose = () => {
        setConfirmOpen(false);
        setDeleteId(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSelectChange = (e) => {
        setForm({
            ...form,
            funcionarioIds: e.target.value
        });
    };

    const validateForm = () => {
        const newErrors = {
            nome: !form.nome,
            dataCriacao: !form.dataCriacao,
            funcionarioIds: !form.funcionarioIds.length
        };
        setErrors(newErrors);
        return !Object.values(newErrors).includes(true);
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
    
        try {
            const data = {
                nome: form.nome,
                dataCriacao: form.dataCriacao,
                funcionarios: form.funcionarioIds.map(id => ({ id })) 
            };
    
            if (editItem) {
                await axios.put(`http://localhost:8080/projetos/${editItem.id}`, data);
            } else {
                await axios.post('http://localhost:8080/projetos', data);
            }
    
            fetchFuncionarios();
            fetchProjetos();
            handleClose();
            navigate('/projetos');
        } catch (err) {
            console.error('Erro ao salvar projeto:', err);
            setError('Erro ao salvar projeto');
        }
    };

    const funcionariosFiltrados = funcionarios.filter(funcionario => {
        if (selectedProjeto && selectedProjeto.funcionarios.length > 0) {
            return !selectedProjeto.funcionarios.some(f => f.id === funcionario.id);
        }
        return true;
    });

    if (loading) return <Typography variant="h6">Carregando...</Typography>;
    if (error) return <Typography variant="h6">{error}</Typography>;

    return (
        <Container className="projeto page-container">
            <div className="page-header">
                <Typography variant="h4" className="projeto page-title">Projetos</Typography>
                <Button variant="contained" color="primary" onClick={() => handleOpen(null)} className="projeto button">Adicionar Projeto</Button>
            </div>
            <div className="projeto-list">
                {projetos.map(projeto => (
                    <div key={projeto.id} className="projeto-item">
                        <div className="projeto-info">
                            <Typography variant="h6" className="projeto name">{projeto.nome}</Typography>
                            <Typography variant="body2" className="projeto info">Data de Criação: {parseDate(projeto.dataCriacao)}</Typography>
                        </div>
                        <div className="projeto funcionarios">
                            <Typography variant="body2" className="funcionarios-title">Funcionários:</Typography>
                            {projeto.funcionarios.length > 0 ? (
                                <ul className="funcionarios-list">
                                    {projeto.funcionarios.map((funcionario, index) => (
                                        <li key={index}>
                                            <Typography variant="body2">{funcionario.nome}</Typography>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <Typography variant="body2">Nenhum funcionário associado</Typography>
                            )}
                        </div>
                        <div className="projeto-actions">
                            <Button variant="outlined" onClick={() => handleOpen(projeto)}>Editar</Button>
                            <Button variant="outlined" color="error" onClick={() => handleConfirmOpen(projeto.id)}>Excluir</Button>
                        </div>
                    </div>
                ))}
            </div>
            <Dialog 
                open={confirmOpen}
                onClose={handleConfirmClose}
                aria-labelledby="confirm-dialog-title"
            >
                <DialogTitle id="confirm-dialog-title">Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <Typography>Você tem certeza que deseja excluir este projeto?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{editItem ? 'Editar Projeto' : 'Adicionar Projeto'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="nome"
                        label="Nome *"
                        type="text"
                        fullWidth
                        value={form.nome}
                        onChange={handleChange}
                        error={errors.nome}
                        helperText={errors.nome ? 'Nome é obrigatório' : ''}
                    />
                    <TextField
                        margin="dense"
                        name="dataCriacao"
                        label="Data de Criação *"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={form.dataCriacao}
                        onChange={handleChange}
                        error={errors.dataCriacao}
                        helperText={errors.dataCriacao ? 'Data de Criação é obrigatória' : ''}
                    />
                    <InputLabel id="funcionarios-label">Funcionários *</InputLabel>
                    <Select
                        labelId="funcionarios-label"
                        name="funcionarioIds"
                        multiple
                        value={form.funcionarioIds}
                        onChange={handleSelectChange}
                        fullWidth
                        error={errors.funcionarioIds}
                        renderValue={(selected) => (
                            <div className="selected-funcionarios">
                                {selected.map((id) => {
                                    const funcionario = funcionarios.find((f) => f.id === id);
                                    return funcionario ? funcionario.nome : '';
                                }).join(', ')}
                            </div>
                        )}
                    >
                        {funcionariosFiltrados.map((funcionario) => (
                            <MenuItem key={funcionario.id} value={funcionario.id}>
                                {funcionario.nome}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.funcionarioIds && <Typography color="error">Funcionários são obrigatórios</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProjetoPage;
