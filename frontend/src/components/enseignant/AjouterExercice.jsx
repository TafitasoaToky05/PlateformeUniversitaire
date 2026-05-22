import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress
} from '@mui/material';

import {
    Assignment,
    Save
} from '@mui/icons-material';

export default function AjouterExercice() {
    const navigate = useNavigate();
    const { matiereId } = useParams(); // Alaina avy amin'ny to={`/ajouter-exercice/${matiereId}`}

    // =========================
    // STATES
    // =========================
    // Tehirizina eto ny anaran'ilay matiere haseho fotsiny (affichage)
    const [nomMatiere, setNomMatiere] = useState('');

    const [formData, setFormData] = useState({
        titre_exercice: '',
        description: ''
    });

    const [loadingMatiere, setLoadingMatiere] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // =========================
    // CHARGER LA MATIERE SPECIFIQUE
    // =========================
    useEffect(() => {
        const fetchMatiereDetails = async () => {
            if (!matiereId) {
                setErrorMsg("Aucune matière n'a été spécifiée.");
                return;
            }

            try {
                setLoadingMatiere(true);
                // Alaina ny antsipirian'ilay matière iray monja mifanitsy amin'ny ID ao amin'ny URL
                const response = await axiosInstance.get(`/matieres/${matiereId}/`);
                
                if (response.data) {
                    // Atambatra ny code sy ny titre (Ohatra: "INF101 - Algorithmique")
                    const label = `${response.data.code_matiere || ''} - ${response.data.titre || ''}`;
                    setNomMatiere(label.trim());
                }
            } catch (error) {
                console.error(error);
                setErrorMsg("Impossible de charger les informations de la matière.");
            } finally {
                setLoadingMatiere(false);
            }
        };

        fetchMatiereDetails();
    }, [matiereId]);

    // =========================
    // HANDLE CHANGE
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =========================
    // HANDLE SUBMIT
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');

        // Validation
        if (!matiereId) {
            setErrorMsg("ID de la matière manquant.");
            return;
        }
        if (!formData.titre_exercice.trim()) {
            setErrorMsg("Veuillez entrer le titre de l'exercice.");
            return;
        }
        if (!formData.description.trim()) {
            setErrorMsg("Veuillez entrer une description.");
            return;
        }

        try {
            setLoadingSubmit(true);

            // Ny matiereId avy amin'ny useParams (URL) ihany no avadika ho Number sady alefa
            const payload = {
                matiere: Number(matiereId),
                titre_exercice: formData.titre_exercice,
                description: formData.description
            };

            await axiosInstance.post('/exercices/', payload);

            setSuccessMsg("Exercice ajouté avec succès.");

            // Reset formulaire
            setFormData({
                titre_exercice: '',
                description: ''
            });

            setTimeout(() => {
                // Miverina any amin'ny pejy antsipiriany rehefa mivoaka ny fahombiazana
                navigate(`/enseignant/details-examen-devoir/${matiereId}`);
            }, 1500);

        } catch (error) {
            console.error(error);
            if (error.response?.data) {
                const data = error.response.data;
                const firstError = Object.values(data)[0];
                setErrorMsg(
                    Array.isArray(firstError)
                        ? firstError[0]
                        : "Erreur lors de l'ajout de l'exercice."
                );
            } else {
                setErrorMsg("Erreur serveur.");
            }
        } finally {
            setLoadingSubmit(false);
        }
    };

    return (
        <Box
            sx={{
                p: 4,
                bgcolor: '#f8fafc',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: '700px',
                    p: 4,
                    borderRadius: '18px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}
            >
                {/* HEADER */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ bgcolor: '#eff6ff', p: 1.5, borderRadius: '12px' }}>
                        <Assignment sx={{ color: '#2563eb' }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" fontWeight="800" color="#0f172a">
                            Ajouter un exercice
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Création d’un nouvel exercice pour une matière
                        </Typography>
                    </Box>
                </Box>

                {/* ALERTS */}
                {successMsg && <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }}>{successMsg}</Alert>}
                {errorMsg && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>{errorMsg}</Alert>}

                {/* FORM */}
                <Box component="form" onSubmit={handleSubmit}>

                    {/* INPUT MATIERE (READ-ONLY TEXTFIELD) */}
                    <TextField
                        fullWidth
                        label="Matière"
                        margin="normal"
                        value={loadingMatiere ? "Chargement..." : nomMatiere}
                        slotProps={{
                            input: {
                                readOnly: true, // Tsy azo ovaina ho matiere hafa
                                endAdornment: loadingMatiere ? (
                                    <CircularProgress color="inherit" size={20} sx={{ mr: 2 }} />
                                ) : null,
                            }
                        }}
                        sx={{ 
                            '& .MuiOutlinedInput-root': { 
                                borderRadius: '10px',
                                bgcolor: '#f1f5f9' // Loko somary gris satria read-only
                            } 
                        }}
                    />

                    {/* TITRE EXERCICE */}
                    <TextField
                        fullWidth
                        label="Titre de l'exercice"
                        name="titre_exercice"
                        margin="normal"
                        value={formData.titre_exercice}
                        onChange={handleChange}
                        disabled={loadingSubmit || loadingMatiere}
                        required
                        placeholder="Ex : TD 1 - Structures de données"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />

                    {/* DESCRIPTION */}
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label="Description / Consignes"
                        name="description"
                        margin="normal"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={loadingSubmit || loadingMatiere}
                        required
                        placeholder="Entrez ici les consignes de l'exercice..."
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />

                    {/* BUTTON SUBMIT */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        startIcon={loadingSubmit ? <CircularProgress size={20} color="inherit" /> : <Save />}
                        disabled={loadingSubmit || loadingMatiere}
                        sx={{
                            mt: 3,
                            py: 1.5,
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: '700',
                            bgcolor: '#2563eb',
                            '&:hover': { bgcolor: '#1d4ed8' }
                        }}
                    >
                        {loadingSubmit ? 'Enregistrement...' : 'Enregistrer l’exercice'}
                    </Button>

                </Box>
            </Paper>
        </Box>
    );
}