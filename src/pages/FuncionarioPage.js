import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Container, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import './FuncionarioPage.css';

const FuncionarioPage = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [projetos, setProjetos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [selectedFuncionario] = useState(null);
    const [form, setForm] = useState({
        nome: '',
        cpf: '',
        email: '',
        salario: '',
        projetoIds: [] 
    });
    const [errors, setErrors] = useState({
        nome: false,
        cpf: false,
        email: false,
        salario: false,
        projetoIds: false 
    });
    const [validationOpen, setValidationOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchFuncionarios();
        fetchProjetos();
    }, []);

    const fetchFuncionarios = async () => {
        try {
            const response = await axios.get('http://localhost:8080/funcionarios');
            setFuncionarios(response.data);
            setLoading(false);
        } catch (err) {
            setError('Erro ao buscar funcionários');
            setLoading(false);
        }
    };

    const fetchProjetos = async () => {
        try {
            const response = await axios.get('http://localhost:8080/projetos');
            setProjetos(response.data);
        } catch (err) {
            setError('Erro ao buscar projetos');
        }
    };

    const handleOpen = (funcionario) => {
        setEditItem(funcionario);
        setForm({
            nome: funcionario ? funcionario.nome : '',
            cpf: funcionario ? funcionario.cpf : '',
            email: funcionario ? funcionario.email : '',
            salario: funcionario ? funcionario.salario : '',
            projetoIds: funcionario && funcionario.projetos ? funcionario.projetos.map(f => f.id) : []
        });
        setErrors({
            nome: false,
            cpf: false,
            email: false,
            salario: false,
            projetoIds: false
        });
        setValidationOpen(false);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setValidationOpen(false);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/funcionarios/${deleteId}`);
            fetchFuncionarios();
            setConfirmOpen(false);
            setDeleteId(null);
        } catch (err) {
            setError('Erro ao deletar funcionário');
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
        if (name === 'cpf') {
            const numericValue = value.replace(/\D/g, '');
            const formattedValue = numericValue.slice(0, 11)
                .replace(/(\d{3})(\d{3})/, '$1.$2.')
                .replace(/(\d{3})(\d{2})$/, '$1-$2');
            setForm({
                ...form,
                [name]: formattedValue
            });
        } else {
            setForm({
                ...form,
                [name]: value
            });
        }
    };

    const handleSelectChange = (e) => {
        setForm({
            ...form,
            projetoIds: e.target.value
        });
    };

    const validateForm = () => {
        const newErrors = {
            nome: !form.nome,
            cpf: !form.cpf,
            email: !form.email,
            salario: !form.salario,
            projetoIds: !form.projetoIds
        };
        setErrors(newErrors);
        return !Object.values(newErrors).includes(true);
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setValidationOpen(true);
            return;
        }

        try {
            const data = {
                nome: form.nome,
                cpf: form.cpf,
                email: form.email,
                salario: form.salario,
                projetos: form.projetoIds.map(id => ({ id })) 
            };

            if (editItem) {
                await axios.put(`http://localhost:8080/funcionarios/${editItem.id}`, data);
            } else {
                await axios.post('http://localhost:8080/funcionarios', data);
            }

            fetchFuncionarios();
            fetchProjetos();
            handleClose();
            navigate('/funcionarios');
        } catch (err) {
            console.error('Erro ao salvar funcionário:', err);
            setError('Erro ao salvar funcionário');
        }
    };

    const formatCPF = (cpf) => {
        if (!cpf) return '';
        cpf = cpf.replace(/\D/g, '');
        return cpf.slice(0, 11)
            .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const projetosFiltrados = projetos.filter(projeto => {
        if (selectedFuncionario && selectedFuncionario.projetos.length > 0) {
            return !selectedFuncionario.projetos.some(f => f.id === projeto.id);
        }
        return true;
    });

    if (loading) return <Typography variant="h6">Carregando...</Typography>;
    if (error) return <Typography variant="h6">{error}</Typography>;

    return (
        <Container className="funcionario page-container">
            <div className="page-header">
                <Typography variant="h4" className="funcionario page-title">Funcionários</Typography>
                <Button variant="contained" color="primary" onClick={() => handleOpen(null)} className="funcionario button">Adicionar Funcionário</Button>
            </div>
            <div className="funcionario-list">
                {funcionarios.map(funcionario => (
                    <div key={funcionario.id} className="funcionario-item">
                        <div className="funcionario-info">
                            <Typography variant="h6" className="funcionario name">{funcionario.nome}</Typography>
                            <Typography variant="body2" className="funcionario info">CPF: {formatCPF(funcionario.cpf)}</Typography>
                            <Typography variant="body2" className="funcionario info">Email: {funcionario.email}</Typography>
                            <Typography variant="body2" className="funcionario info">Salário: R${funcionario.salario.toFixed(2)}</Typography>
                        </div>
                        <div className="funcionario projetos">
                            <Typography variant="body2" className="projetos-title">Projetos:</Typography>
                            {funcionario.projetos.length > 0 ? (
                                <ul className="projetos-list">
                                    {funcionario.projetos.map((projeto, index) => (
                                        <li key={index}>
                                            <Typography variant="body2">{projeto.nome}</Typography>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <Typography variant="body2">Nenhum projeto associado</Typography>
                            )}
                        </div>
                        <div className="funcionario-actions">
                            <Button variant="outlined" color="primary" onClick={() => handleOpen(funcionario)}>Editar</Button>
                            <Button variant="outlined" color="error" onClick={() => handleConfirmOpen(funcionario.id)}>Excluir</Button>
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
                    <Typography>Você tem certeza que deseja excluir este funcionário?</Typography>
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
                <DialogTitle id="form-dialog-title">{editItem ? 'Editar Funcionário' : 'Adicionar Funcionário'}</DialogTitle>
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
                        name="cpf"
                        label="CPF *"
                        type="text"
                        fullWidth
                        value={form.cpf}
                        onChange={handleChange}
                        error={errors.cpf}
                        helperText={errors.cpf ? 'CPF é obrigatório' : ''}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email *"
                        type="email"
                        fullWidth
                        value={form.email}
                        onChange={handleChange}
                        error={errors.email}
                        helperText={errors.email ? 'Email é obrigatório' : ''}
                    />
                    <TextField
                        margin="dense"
                        name="salario"
                        label="Salário *"
                        type="number"
                        fullWidth
                        value={form.salario}
                        onChange={handleChange}
                        error={errors.salario}
                        helperText={errors.salario ? 'Salário é obrigatório' : ''}
                    />
                    <InputLabel id="projeto-select-label">Projetos</InputLabel>
                    <Select
                        multiple
                        labelId="projeto-select-label"
                        value={form.projetoIds}
                        onChange={handleSelectChange}
                        renderValue={(selected) => (
                            <div>
                                {projetos.filter(projeto => form.projetoIds.includes(projeto.id)).map(projeto => (
                                    <div key={projeto.id}>{projeto.nome}</div>
                                ))}
                            </div>
                        )}
                        fullWidth
                    >
                        {projetosFiltrados.map((projeto) => (
                            <MenuItem key={projeto.id} value={projeto.id}>
                                {projeto.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {editItem ? 'Salvar' : 'Adicionar'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={validationOpen} onClose={() => setValidationOpen(false)}>
                <DialogTitle>Validação do Formulário</DialogTitle>
                <DialogContent>
                    <Typography>Por favor, preencha todos os campos obrigatórios.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setValidationOpen(false)} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default FuncionarioPage;
