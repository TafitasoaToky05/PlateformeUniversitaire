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
    EventNote,
    Save
} from '@mui/icons-material';

export default function AjouterExamen() {
    const navigate = useNavigate();
    const { matiereId } = useParams(); // Alaina avy amin'ny to={`/ajouter-examen/${matiereId}`}

    // =========================
    // STATES
    // =========================
    // Tehirizina eto ny anaran'ilay matiere haseho fotsiny (affichage)
    const [nomMatiere, setNomMatiere] = useState(''); 

    const [formData, setFormData] = useState({
        titre_examen: '',
        description: '',
        date_limite: '' 
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
                // Alaina ny antsipirian'ilay matière iray monja
                const response = await axiosInstance.get(`/matieres/${matiereId}/`);
                
                // Atambatra ny code sy ny titre mba ho hita tsara (Ohatra: "INF101 - Algorithmique")
                if (response.data) {
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

        if (!matiereId) {
            setErrorMsg("ID de la matière manquant.");
            return;
        }
        if (!formData.titre_examen.trim()) {
            setErrorMsg("Veuillez entrer le titre de l'examen.");
            return;
        }
        if (!formData.description.trim()) {
            setErrorMsg("Veuillez entrer une description.");
            return;
        }
        if (!formData.date_limite) {
            setErrorMsg("Veuillez fixer une date et heure limite.");
            return;
        }

        try {
            setLoadingSubmit(true);

            const payload = {
                matiere: Number(matiereId), // Ny ID avy amin'ny URL ihany no alefa eto
                titre_examen: formData.titre_examen,
                description: formData.description,
                date_limite: formData.date_limite 
            };

            await axiosInstance.post('/examens/', payload);

            setSuccessMsg("Examen planifié avec succès !");

            // Reset formulaire
            setFormData({
                titre_examen: '',
                description: '',
                date_limite: ''
            });

            setTimeout(() => {
                // Miverina any amin'ny pejy antsipiriany
                navigate(`/details-examen-devoir/${matiereId}`); 
            }, 1500);

        } catch (error) {
            console.error(error);
            if (error.response?.data) {
                const data = error.response.data;
                const firstError = Object.values(data)[0];
                setErrorMsg(
                    Array.isArray(firstError)
                        ? firstError[0]
                        : "Erreur lors de la création de l'examen."
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
                    <Box sx={{ bgcolor: '#fef3c7', p: 1.5, borderRadius: '12px' }}>
                        <EventNote sx={{ color: '#d97706' }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" fontWeight="800" color="#0f172a">
                            Créer un examen
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Planification d'une nouvelle évaluation avec date limite
                        </Typography>
                    </Box>
                </Box>

                {/* ALERTS */}
                {successMsg && <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }}>{successMsg}</Alert>}
                {errorMsg && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>{errorMsg}</Alert>}

                {/* FORM */}
                <Box component="form" onSubmit={handleSubmit}>
                    
                    {/* INPUT MATIERE (READ-ONLY TEXTFIELD, NOT SELECT) */}
                    <TextField
                        fullWidth
                        label="Matière concernée"
                        margin="normal"
                        value={loadingMatiere ? "Chargement..." : nomMatiere}
                        slotProps={{
                            input: {
                                readOnly: true, // Tsy afaka ovana fa vakiana fotsiny
                                endAdornment: loadingMatiere ? (
                                    <CircularProgress color="inherit" size={20} sx={{ mr: 2 }} />
                                ) : null,
                            }
                        }}
                        sx={{ 
                            '& .MuiOutlinedInput-root': { 
                                borderRadius: '10px',
                                bgcolor: '#f1f5f9' // Loko somary gris satria tsy azo ovaina
                            } 
                        }}
                    />

                    {/* TITRE EXAMEN */}
                    <TextField
                        fullWidth
                        label="Titre de l'examen"
                        name="titre_examen"
                        margin="normal"
                        value={formData.titre_examen}
                        onChange={handleChange}
                        disabled={loadingSubmit || loadingMatiere}
                        required
                        placeholder="Ex : Examen Fin de Semestre - Algorithmique"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />

                    {/* DATE LIMITE */}
                    <TextField
                        fullWidth
                        label="Date et Heure Limite"
                        name="date_limite"
                        type="datetime-local"
                        margin="normal"
                        value={formData.date_limite}
                        onChange={handleChange}
                        disabled={loadingSubmit || loadingMatiere}
                        required
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />

                    {/* DESCRIPTION */}
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label="Description / Consignes de l'examen"
                        name="description"
                        margin="normal"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={loadingSubmit || loadingMatiere}
                        required
                        placeholder="Soraty eto ny toromarika..."
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
                            mt: 4,
                            py: 1.5,
                            borderRadius: '10px',
                            fontWeight: '700',
                            bgcolor: '#d97706',
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#b45309' }
                        }}
                    >
                        {loadingSubmit ? 'Planification en cours...' : 'Planifier l’examen'}
                    </Button>

                </Box>
            </Paper>
        </Box>
    );
}