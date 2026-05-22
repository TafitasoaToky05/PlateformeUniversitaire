import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

import {
    Box, Typography, Button, Chip, Grid, Card, CardContent,
    CardActions, Divider, CircularProgress, Alert, Stack
} from '@mui/material';
import {
    School, ArrowForward, Topic, Code
} from '@mui/icons-material';

export default function GestionMatiere() {
    const [matieres, setMatieres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Grâce au get_queryset modifié dans le backend, 
                // ces appels ne renverront que les données de l'enseignant connecté.
                const [matieresResponse, coursResponse] = await Promise.all([
                    axiosInstance.get('/matieres/'),
                    axiosInstance.get('/cours/') // Ne contiendra que les cours de cet enseignant
                ]);

                const dataMatieres = Array.isArray(matieresResponse.data) ? matieresResponse.data : [];
                const dataCours = Array.isArray(coursResponse.data) ? coursResponse.data : [];

                const matieresCalculees = dataMatieres.map(matiere => {
                    const coursDeLaMatiere = dataCours.filter(c => {
                        const matiereId = typeof c.matiere === 'object' ? c.matiere.id : c.matiere;
                        return Number(matiereId) === Number(matiere.id);
                    });

                    return {
                        ...matiere,
                        cours_count: coursDeLaMatiere.length
                    };
                });

                setMatieres(matieresCalculees);
                setError(null);
            } catch (err) {
                console.error("Erreur lors de la récupération des données:", err);
                setError("Impossible de charger vos matières. Veuillez vérifier votre connexion.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>

            {/* 1. LOHA-PEJY */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
                flexWrap: 'wrap',
                gap: 2,
                borderBottom: '1px solid #e2e8f0',
                pb: 3
            }}>
                <Box sx={{ flex: 1, minWidth: '300px' }}>
                    <Typography variant="h4" fontWeight="800" color="#0f172a" sx={{ letterSpacing: '-0.5px' }}>
                        Gestion des Matières
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                        Liste des matières disponibles et gestion des cours associés. Cliquez sur "Voir les cours" pour plus de détails sur chaque matière.
                    </Typography>
                </Box>
            </Box>

            {/* 2. LOADING SPIN */}
            {loading && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10, gap: 2 }}>
                    <CircularProgress size={45} thickness={4.5} sx={{ color: '#2563eb' }} />
                    <Typography variant="body2" fontWeight="medium" color="text.secondary">
                        Teo am-pitanana ny angon-drakitra...
                    </Typography>
                </Box>
            )}

            {/* 3. RAHA MISY ERROR */}
            {error && !loading && (
                <Alert severity="error" variant="outlined" sx={{ borderRadius: 3, mb: 3, fontWeight: 'medium' }}>
                    {error}
                </Alert>
            )}

            {/* 4. RAHA TSY MISY MATIERE */}
            {!loading && !error && matieres.length === 0 && (
                <Alert severity="info" variant="outlined" sx={{ borderRadius: 3, py: 2 }}>
                    Tsy mbola misy taranja (matière) voasoratra ao amin'ny rafitra amin'izao fotoana izao.
                </Alert>
            )}

            {/* 5. NY GRID FAMPISHOANA NY CARDS */}
            {!loading && !error && (
                <Grid container spacing={3}>
                    {matieres.map((matiere) => (
                        <Grid item xs={12} sm={6} md={4} key={matiere.id}>
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)',
                                border: '1px solid #e2e8f0',
                                bgcolor: '#ffffff',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                                    borderColor: '#cbd5e1'
                                }
                            }}>
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>

                                    {/* Amboniny: Mampiseho ny Code sy ny isan'ny Cours */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>

                                        {/* NY KAODY (CODE) */}
                                        <Chip
                                            icon={<Code style={{ fontSize: '0.9rem', color: '#475569' }} />}
                                            label={matiere.code_matiere || matiere.code || "Tsy misy Code"}
                                            sx={{
                                                fontWeight: '700',
                                                borderRadius: '8px',
                                                bgcolor: '#f1f5f9',
                                                color: '#334155',
                                                fontSize: '0.75rem',
                                                px: 0.5
                                            }}
                                        />

                                        {/* Ny isan'ny Cours azo avy amin'ny `.length` tery ambony */}
                                        <Chip
                                            icon={<Topic style={{ color: '#2563eb', fontSize: '0.95rem' }} />}
                                            label={`${matiere.cours_count} Cours`}
                                            sx={{
                                                fontWeight: '700',
                                                borderRadius: '8px',
                                                bgcolor: '#eff6ff',
                                                color: '#2563eb',
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                    </Box>

                                    {/* Anaran'ny Matière */}
                                    <Typography
                                        variant="h6"
                                        fontWeight="700"
                                        color="#1e293b"
                                        sx={{
                                            mb: 2,
                                            minHeight: '56px',
                                            lineHeight: 1.4,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {matiere.titre || matiere.nom_matiere || matiere.nom}
                                    </Typography>

                                    <Divider sx={{ my: 2, borderColor: '#f1f5f9' }} />

                                    {/* Ny antsipirian'ny Filière misy azy */}
                                    <Stack spacing={1.5}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <School sx={{ color: '#64748b', fontSize: '1.2rem' }} />
                                            <Box>
                                                <Typography variant="caption" display="block" color="text.secondary" sx={{ lineHeight: 1 }}>
                                                    Filière
                                                </Typography>
                                                <Typography variant="body2" fontWeight="600" color="#334155">
                                                    {matiere.filiere_details?.nom_filiere || matiere.filiere || 'Tsy voafaritra'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Stack>

                                    {/* Niveau sy Taona */}
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2.5 }}>
                                        <Chip
                                            label={`Niveau: ${matiere.filiere_details?.niveau || matiere.niveau || '?'}`}
                                            size="small"
                                            variant="outlined"
                                            sx={{ borderRadius: '6px', color: '#475569', borderColor: '#cbd5e1', height: 24, fontSize: '0.75rem' }}
                                        />
                                        <Chip
                                            label={`Taona: ${matiere.filiere_details?.annee_academique || matiere.annee || '?'}`}
                                            size="small"
                                            variant="outlined"
                                            sx={{ borderRadius: '6px', color: '#475569', borderColor: '#cbd5e1', height: 24, fontSize: '0.75rem' }}
                                        />
                                    </Box>
                                </CardContent>

                                {/* 6. BOKOTRA MIDITRA */}
                                <CardActions sx={{
                                    justifyContent: 'flex-end',
                                    bgcolor: '#f8fafc',
                                    px: 3,
                                    py: 2,
                                    borderTop: '1px solid #f1f5f9'
                                }}>
                                    <Button
                                        variant="contained"
                                        endIcon={<ArrowForward />}
                                        size="small"
                                        disableElevation
                                        sx={{
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            fontWeight: '600',
                                            px: 2.5,
                                            py: 0.8,
                                            bgcolor: '#0f172a',
                                            '&:hover': { bgcolor: '#1e293b' }
                                        }}
                                        component={Link}
                                        to={`/enseignant/details-matieres/${matiere.id}`}
                                    >
                                        Voir les cours
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}