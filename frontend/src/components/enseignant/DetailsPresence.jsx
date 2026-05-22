import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import {
    Typography, Box, CircularProgress, Alert, Divider, Chip, Paper, Button
} from '@mui/material';
import { School, ArrowBack, Layers, Add, History } from '@mui/icons-material';

export default function GestionPresence() {
    const { id } = useParams(); // ID an'ilay Matière avy amin'ny URL
    const navigate = useNavigate();

    const [matiereInfo, setMatiereInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatiereInfo = async () => {
            try {
                setLoading(true);
                setError(null);

                // Alaina fotsiny ny mombamomba ny taranja (Matière)
                const response = await axiosInstance.get(`/matieres/${id}/`);
                setMatiereInfo(response.data);

            } catch (err) {
                console.error("Erreur lors du chargement des données :", err);
                setError("Impossible de récupérer les détails de la matière.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchMatiereInfo();
    }, [id]);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            {/* 1. Bokotra Hiverenana (Retour) */}
            <Box sx={{ mb: 2 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{ color: '#64748b', '&:hover': { color: '#0f172a' }, textTransform: 'none', fontWeight: '600' }}
                >
                    Retour
                </Button>
            </Box>

            {/* Fampisehoana mandritra ny fikarohana (Loading) */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 10 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Fampisehoana rehefa misy diso (Error) */}
            {error && !loading && (
                <Box sx={{ width: '100%', maxWidth: '900px', mx: 'auto' }}>
                    <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
                </Box>
            )}

            {/* 2. Votoatiny lehibe (Main Content) */}
            {!loading && !error && matiereInfo && (
                <Box sx={{ mx: 'auto', maxWidth: '1200px' }}>
                    <Paper
                        elevation={0}
                        sx={{ p: { xs: 2, md: 4 }, width: '100%', borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff', mb: 4 }}
                    >
                        {/* EN-TETE : Lohateny momba ny Matiere */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ bgcolor: '#eff6ff', p: 1.5, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <School sx={{ color: '#2563eb', fontSize: '2.5rem' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h4" fontWeight="800" color="#0f172a" sx={{ lineHeight: 1.2, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                                        {matiereInfo.titre}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 3, mt: 0.5, flexWrap: 'wrap' }}>
                                        <Typography variant='caption' color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                            Code : <strong style={{ color: '#1e293b' }}>{matiereInfo.code_matiere}</strong>
                                        </Typography>
                                        <Typography variant='caption' color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                            Crédit : <strong style={{ color: '#1e293b' }}>{matiereInfo.credits_ects} ECTS</strong>
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 0.5 }}>
                                <Typography sx={{ fontSize: 13, fontWeight: '700', letterSpacing: 1 }} color="primary" variant='overline'>
                                    {matiereInfo.filiere_details?.nom_filiere || matiereInfo.filiere || 'Non défini'}
                                </Typography>
                                <Chip
                                    icon={<Layers sx={{ fontSize: '0.9rem !important' }} />}
                                    label={matiereInfo.filiere_details?.niveau || matiereInfo.niveau || "Niveau inconnu"}
                                    color="secondary"
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontWeight: 'bold', borderRadius: '6px' }}
                                />
                            </Box>
                        </Box>

                        <Divider sx={{ my: 4, borderColor: '#f1f5f9' }} />

                        {/* Faritra Fampahalalana sy Bokotra Fanampiana */}
                        <Box sx={{ 
                            mb: 4, 
                            display: 'flex', 
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between', 
                            alignItems: { xs: 'flex-start', sm: 'center' }, 
                            gap: 2 
                        }}>
                            <Box>
                                <Typography variant="h5" fontWeight="700" color="#1e293b" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                                    Détails de la Matière
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Consultation du : <strong>{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
                                </Typography>
                            </Box>
                            
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Add />}
                                component={Link}
                                to={`/ajouter-presence/${matiereInfo.id}`}
                                sx={{ 
                                    textTransform: 'none', 
                                    borderRadius: '10px', 
                                    fontWeight: '600', 
                                    px: 3, 
                                    py: 1,
                                    bgcolor: '#2563eb',
                                    boxShadow: 'none',
                                    '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' },
                                    width: { xs: '100%', sm: 'auto' }
                                }}
                            >
                                Ajouter une présence
                            </Button>
                        </Box>

                        {/* Faritra fampisehoana ny Tantara (Historique placeholder) */}
                        <Box 
                            sx={{ 
                                p: 4, 
                                bgcolor: '#f8fafc', 
                                borderRadius: '12px', 
                                border: '2px dashed #e2e8f0',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                minHeight: '180px'
                            }}
                        >
                            <History sx={{ color: '#94a3b8', fontSize: '3rem', mb: 1.5 }} />
                            <Typography variant="h6" fontWeight="600" color="#475569" sx={{ mb: 0.5 }}>
                                Historique des présences
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '400px' }}>
                                Les feuilles de présence enregistrées pour cette matière seront affichées ici. (À implémenter)
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            )}
        </Box>
    );
}