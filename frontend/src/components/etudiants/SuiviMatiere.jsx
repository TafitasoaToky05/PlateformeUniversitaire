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

export default function SuiviMatiere() {
    const [matieres, setMatieres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Ny API dia hamerina ny matières efa voasivana (filtered) 
                // araka ny maha-enseignant na maha-etudiant ny user connecté
                const [matieresResponse, coursResponse] = await Promise.all([
                    axiosInstance.get('/matieres/'),
                    axiosInstance.get('/cours/')
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
                console.error("Erreur:", err);
                setError("Tsy tafiditra ny angon-drakitra. Hamarino ny fifandraisana.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{ mb: 4, pb: 3, borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="h4" fontWeight="800" color="#0f172a">Gestion des Matières</Typography>
                <Typography variant="body1" color="text.secondary">
                    Ireo matières azo raisina ho an'ny filiere misy anao.
                </Typography>
            </Box>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && !loading && <Alert severity="error">{error}</Alert>}

            {!loading && !error && matieres.length === 0 && (
                <Alert severity="info">Tsy misy matière hita ho an'ny filiere misy anao.</Alert>
            )}

            {!loading && !error && (
                <Grid container spacing={3}>
                    {matieres.map((matiere) => (
                        <Grid item xs={12} sm={6} md={4} key={matiere.id}>
                            <Card sx={{ height: '100%', borderRadius: '16px', p: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Chip label={matiere.code || "N/A"} size="small" />
                                        <Chip label={`${matiere.cours_count} Cours`} color="primary" size="small" />
                                    </Box>
                                    
                                    <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
                                        {matiere.titre || matiere.nom_matiere}
                                    </Typography>
                                    
                                    <Stack direction="row" alignItems="center" gap={1}>
                                        <School color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            Filière: {matiere.filiere?.nom_filiere || matiere.filiere || 'Tsy voafaritra'}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                                
                                <CardActions sx={{ justifyContent: 'flex-end', px: 2 }}>
                                    <Button
                                        variant="contained"
                                        component={Link}
                                        // Raha mpianatra ianao dia tokony ho /etudiant/details-matieres/ 
                                        // na azonao atao lalana tokana izy raha mitovy ny pejy
                                        to={`/details-matieres/${matiere.id}`} 
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