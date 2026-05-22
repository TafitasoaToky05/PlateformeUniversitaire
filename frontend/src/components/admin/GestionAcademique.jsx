import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Button,
    CardActions, Divider, Chip, CircularProgress, Alert
} from '@mui/material';
import { Add, Visibility } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

export default function GestionAcademique() {
    const [filieres, setFilieres] = useState([]);
    const [inscriptions, setInscriptions] = useState([]); // Tahiry ho an'ny inscription rehetra
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Alaina miaraka ny filières sy ny inscriptions rehetra
    useEffect(() => {
        Promise.all([
            axiosInstance.get("filieres/"),
            axiosInstance.get("inscriptions/") // Alaina mba ahafahana manisa azy eto amin'ny React
        ])
            .then(([resFilieres, resInscriptions]) => {
                setFilieres(resFilieres.data);
                setInscriptions(resInscriptions.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur fangalana angon-drakitra:", err);
                setError("Tsy tontosa ny fangalana ny lisitry ny filières na ny fisoratana anarana.");
                setLoading(false);
            });
    }, []);

    // Asa (Fonction) manisa ny isan'ny mpianatra isaky ny filière id
    const getIsanMpianatra = (filiereId) => {
        return inscriptions.filter(inscription => inscription.filiere === filiereId).length;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>;
    }

    return (
        <Box sx={{ p: 1 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="#1e293b">
                Architecture Académique & Filières
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configurez les promotions d'études et gérez les affectations administratives annuelles.
            </Typography>

            {/* Bokotra Action */}
            <Grid container spacing={2} sx={{ mb: 4, gap: 2, pl: 2 }}>
                <Button variant="contained" startIcon={<Add />} color='success' component={Link} to="/admin/ajouter-filiere">
                    Créer une Nouvelle Filière
                </Button>
                <Button variant="contained" startIcon={<Add />} color='primary' component={Link} to="/admin/ajouter-etudiant">
                    Affecter Etudiant à une Filière
                </Button>
            </Grid>

            {filieres.length === 0 ? (
                <Alert severity="info">Mbola tsy misy filière voasoratra ao amin'ny rafitra.</Alert>
            ) : (
                <Grid container spacing={3}>
                    {filieres.map((filiere) => {
                        // Antsoina ilay fonction teo ambony mba hahazoana ny isany marina
                        const isanMpianatra = getIsanMpianatra(filiere.id);

                        return (
                            <Grid item xs={12} sm={6} md={4} key={filiere.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 1, borderRadius: 2 }}>
                                    <CardContent>
                                        <Chip 
                                            label={filiere.niveau || "NIVEAU"} 
                                            color="info" 
                                            size="small" 
                                            sx={{ mb: 1, fontWeight: 'bold' }} 
                                        />
                                        <Typography variant="h6" fontWeight="bold" component="div" gutterBottom sx={{ color: '#0f172a' }}>
                                            {filiere.nom_filiere || filiere.nom || filiere.code}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Effectif actuel : <strong>{isanMpianatra} {isanMpianatra > 1 ? 'étudiants' : 'étudiant'}</strong> inscrit(s).
                                        </Typography>
                                    </CardContent>
                                    <Divider />
                                    <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
                                        <Button
                                            size="small"
                                            startIcon={<Visibility />}
                                            color="secondary"
                                            component={Link}
                                            to={`/admin/details-filiere/${filiere.id}`} // Azonao amboarina ny lalan'ity pejy ity
                                        >
                                            Détails
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
}