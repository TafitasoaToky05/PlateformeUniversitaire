import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
// 1. Ampio ny useLocation
import { useNavigate, useParams, useLocation } from 'react-router-dom'; 

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
    CloudUpload,
    Send
} from '@mui/icons-material';

export default function SoumettreReponseExercice() {
    const navigate = useNavigate();
    const location = useLocation(); // 2. Initialization ny location
    const { id: exerciceId } = useParams();

    // 3. Raiso ny anarana avy amin'ny state (raha misy), raha tsy misy dia "Chargement..."
    const [nomMatiere, setNomMatiere] = useState(location.state?.nomMatiere || '');
    const [file, setFile] = useState(null);
    const [commentaire, setCommentaire] = useState('');

    const [loadingMatiere, setLoadingMatiere] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // CHARGER LA MATIERE VIA L'EXERCICE
    useEffect(() => {
        // 4. Raha efa misy ny nomMatiere avy amin'ny state, tsy mila manao call API intsony
        if (nomMatiere) return;

        const fetchDetails = async () => {
            if (!exerciceId) return;

            setLoadingMatiere(true);
            try {
                const res = await axiosInstance.get(`/exercices/${exerciceId}/`);
                const data = res.data;

                if (data && data.matiere_details) {
                    setNomMatiere(`${data.matiere_details.code_matiere} - ${data.matiere_details.titre}`);
                } else if (data.matiere) {
                    setNomMatiere(`Matière ID: ${data.matiere}`);
                } else {
                    setNomMatiere("Matière non définie");
                }
            } catch (error) {
                setErrorMsg("Impossible de charger les détails.");
            } finally {
                setLoadingMatiere(false);
            }
        };
        fetchDetails();
    }, [exerciceId, nomMatiere]); // Nampiana nomMatiere ao amin'ny dependency array

    // HANDLE SUBMIT ... (tsy nisy niova ity ampahany ity)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');

        if (!file) {
            setErrorMsg("Veuillez sélectionner un fichier à soumettre.");
            return;
        }

        const formData = new FormData();
        formData.append('exercice', exerciceId);
        formData.append('fichier_reponse', file);
        formData.append('commentaire', commentaire);

        try {
            setLoadingSubmit(true);
            await axiosInstance.post('/soumissions-exercices/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSuccessMsg("Travail rendu avec succès !");
            setTimeout(() => navigate(-1), 1500);
        } catch (error) {
            console.error(error);
            setErrorMsg("Erreur lors de la soumission. Vérifiez que vous n'avez pas déjà rendu ce devoir.");
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ bgcolor: '#eff6ff', p: 1.5, borderRadius: '12px' }}>
                        <CloudUpload sx={{ color: '#2563eb' }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" fontWeight="800" color="#0f172a">
                            Soumettre mon travail
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {/* 5. Asehoy hoe "Chargement" raha mbola tsy misy nomMatiere */}
                            {nomMatiere || "Chargement des détails..."}
                        </Typography>
                    </Box>
                </Box>

                {successMsg && <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }}>{successMsg}</Alert>}
                {errorMsg && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>{errorMsg}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Matière concernée"
                        margin="normal"
                        // 6. Raha mbola tsy misy nomMatiere dia atao "Chargement..."
                        value={loadingMatiere ? "Chargement..." : (nomMatiere || "Chargement...")}
                        slotProps={{
                            input: {
                                readOnly: true,
                                endAdornment: loadingMatiere ? <CircularProgress color="inherit" size={20} /> : null,
                            }
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#f1f5f9' } }}
                    />

                    {/* ... (Ny sisa amin'ny form dia tsy niova) */}
                    <Box sx={{ mt: 2, mb: 1 }}>
                        <Typography variant="body2" sx={{ mb: 1, ml: 1, fontWeight: 'bold' }}>Sélectionner le fichier (PDF, Word, Zip)</Typography>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                            style={{
                                width: '100%',
                                padding: '14px',
                                border: '1px solid #c4c4c4',
                                borderRadius: '10px',
                                backgroundColor: '#fff'
                            }}
                        />
                    </Box>

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Commentaire (Optionnel)"
                        margin="normal"
                        value={commentaire}
                        onChange={(e) => setCommentaire(e.target.value)}
                        disabled={loadingSubmit}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loadingSubmit || (loadingMatiere && !nomMatiere)}
                        startIcon={loadingSubmit ? <CircularProgress size={20} color="inherit" /> : <Send />}
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
                        {loadingSubmit ? 'Envoi en cours...' : 'Envoyer le devoir'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}