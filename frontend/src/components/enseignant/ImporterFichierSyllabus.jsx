import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axios';
import {
    Box, Typography, Paper, Button, TextField, 
    CircularProgress, Alert, LinearProgress, MenuItem
} from '@mui/material';
import { ArrowBack, CloudUpload, InsertDriveFile } from '@mui/icons-material';

export default function ImporterFichierSyllabus() {
    const { id: matiereId } = useParams(); // Récupère l'ID de la matière depuis la route
    const navigate = useNavigate();
    const location = useLocation();

    // Récupération des données transmises par le bouton local de l'accordéon (si applicable)
    const coursIdInitial = location.state?.coursId || '';
    const coursTitreInitial = location.state?.coursTitre || '';

    // États du formulaire
    const [coursId, setCoursId] = useState(coursIdInitial);
    const [nomFichier, setNomFichier] = useState('');
    const [fichier, setFichier] = useState(null);

    // Liste des cours de la matière (utilisée si l'on vient du bouton global)
    const [listeCours, setListeCours] = useState([]);
    const [loadingCours, setLoadingCours] = useState(false);

    // États de gestion d'UI
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Charger les cours de la matière si aucun cours spécifique n'a été injecté au départ
    useEffect(() => {
        const fetchCoursDeMatiere = async () => {
            if (!coursIdInitial && matiereId) {
                try {
                    setLoadingCours(true);
                    const response = await axiosInstance.get('/cours/', { params: { matiere: matiereId } });
                    // Filtrage de sécurité optionnel
                    const coursFiltres = Array.isArray(response.data)
                        ? response.data.filter(c => String(c.matiere) === String(matiereId))
                        : [];
                    setListeCours(coursFiltres);
                } catch (err) {
                    console.error("Erreur lors de la récupération des chapitres:", err);
                    setError("Impossible de charger la liste des chapitres de cette matière.");
                } finally {
                    setLoadingCours(false);
                }
            }
        };

        fetchCoursDeMatiere();
    }, [coursIdInitial, matiereId]);

    // Gestion du changement de fichier
    const handleFileChange = (e) => {
        const fileSelected = e.target.files[0];
        if (fileSelected) {
            setFichier(fileSelected);
            // Si l'utilisateur n'a pas encore écrit de nom personnalisé, on pré-remplit avec le nom du fichier
            if (!nomFichier) {
                setNomFichier(fileSelected.name);
            }
        }
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!fichier) {
            setError("Veuillez sélectionner un fichier à uploader.");
            return;
        }

        if (!coursId) {
            setError("Veuillez lier ce fichier à un cours ou chapitre.");
            return;
        }

        const formData = new FormData();
        formData.append('cours', coursId); 
        formData.append('nom_fichier', nomFichier);
        formData.append('fichier', fichier); 

        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            await axiosInstance.post('/fichiers-cours/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                }
            });

            setSuccess(true);
            setFichier(null);
            setNomFichier('');
            
            // Retour aux détails de la matière après succès
            setTimeout(() => navigate(-1), 1500);

        } catch (err) {
            console.error("Erreur lors de la soumission du fichier :", err);
            setError(
                err.response?.data?.detail || 
                "Une erreur est survenue lors de l'enregistrement du fichier."
            );
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            
            {/* Bouton Retour */}
            <Box sx={{ mb: 3 }}>
                <Button 
                    startIcon={<ArrowBack />} 
                    onClick={() => navigate(-1)}
                    sx={{ color: '#64748b', textTransform: 'none', '&:hover': { color: '#0f172a' } }}
                >
                    Retour
                </Button>
            </Box>

            <Paper 
                elevation={0} 
                sx={{ p: 4, maxWidth: '550px', mx: 'auto', borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}
            >
                <Typography variant="h5" fontWeight="700" color="#0f172a" sx={{ mb: 1 }}>
                    Ajouter un document de cours
                </Typography>
                
                {location.state?.matiereTitre && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Matière : <strong>{location.state.matiereTitre}</strong>
                    </Typography>
                )}

                {coursTitreInitial && (
                    <Typography variant="body2" color="primary" fontWeight="600" sx={{ mb: 3 }}>
                        Cours ciblé : {coursTitreInitial}
                    </Typography>
                )}

                {/* Messages de retour */}
                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>Le document a été téléversé avec succès !</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    
                    {/* Sélection du cours (S'affiche sous forme de liste déroulante propre si on vient du bouton global) */}
                    {!coursIdInitial && (
                        <TextField
                            select
                            label="Sélectionner le chapitre / cours"
                            variant="outlined"
                            value={coursId}
                            onChange={(e) => setCoursId(e.target.value)}
                            required
                            fullWidth
                            disabled={loadingCours}
                            helperText={loadingCours ? "Chargement des chapitres..." : "Choisissez le chapitre concerné par ce document"}
                        >
                            {listeCours.length > 0 ? (
                                listeCours.map((c) => (
                                    <MenuItem key={c.id} value={c.id}>
                                        {c.titre_cours}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled value="">
                                    Aucun chapitre trouvé pour cette matière
                                </MenuItem>
                            )}
                        </TextField>
                    )}

                    {/* Nom personnalisé du fichier */}
                    <TextField
                        label="Nom d'affichage du document"
                        variant="outlined"
                        value={nomFichier}
                        onChange={(e) => setNomFichier(e.target.value)}
                        placeholder="Ex: TD1 - Exercices corrigés"
                        required
                        fullWidth
                    />

                    {/* Zone de Sélection de fichier */}
                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        sx={{
                            py: 4,
                            borderStyle: 'dashed',
                            borderWidth: '2px',
                            borderColor: fichier ? 'success.main' : 'primary.main',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            textTransform: 'none',
                            bgcolor: fichier ? '#f0fdf4' : 'transparent',
                            '&:hover': { bgcolor: fichier ? '#bbf7d0' : '#f1f5f9' }
                        }}
                    >
                        {fichier ? "Changer le document" : "Sélectionner un fichier (PDF, Word, Code...)"}
                        <input
                            type="file"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>

                    {/* Affichage du fichier sélectionné */}
                    {fichier && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, bgcolor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <InsertDriveFile color="primary" />
                            <Box sx={{ overflow: 'hidden' }}>
                                <Typography variant="body2" noWrap fontWeight="600" color="#334155">
                                    {fichier.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {(fichier.size / 1024 / 1024).toFixed(2)} MB
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {/* Barre de chargement en temps réel */}
                    {uploadProgress > 0 && (
                        <Box sx={{ width: '100%', mt: 1 }}>
                            <LinearProgress variant="determinate" value={uploadProgress} color="success" />
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                                {uploadProgress}% envoyé
                            </Typography>
                        </Box>
                    )}

                    {/* Bouton de Validation */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading || !fichier || !coursId}
                        sx={{ py: 1.5, fontWeight: 'bold', textTransform: 'none', borderRadius: '8px' }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Enregistrer le support"}
                    </Button>

                </Box>
            </Paper>
        </Box>
    );
}