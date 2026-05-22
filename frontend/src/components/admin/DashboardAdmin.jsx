import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Card, CardContent, CircularProgress } from '@mui/material';
import { People, School, AccountBalance } from '@mui/icons-material';
import axiosInstance from '../api/axios';

export default function DashboardAdmin() {
    const [counts, setCounts] = useState({
        utilisateurs: 0,
        filieres: 0,
        matieres: 0 
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [usersRes, filieresRes, matieresRes] = await Promise.all([
                    axiosInstance.get('/utilisateurs/'),
                    axiosInstance.get('/filieres/'),
                    axiosInstance.get('/matieres/') 
                ]);

                const getLength = (res) => Array.isArray(res.data) ? res.data.length : (res.data.results?.length || 0);

                setCounts({
                    utilisateurs: getLength(usersRes),
                    filieres: getLength(filieresRes),
                    matieres: getLength(matieresRes)
                });
            } catch (error) {
                console.error("Erreur lors du chargement des statistiques", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = [
        {
            title: 'Utilisateurs Actifs',
            value: loading ? <CircularProgress size={24} /> : counts.utilisateurs.toLocaleString(),
            icon: <People fontSize="large" color="primary" />,
            desc: 'Membres inscrits'
        },
        {
            title: 'Filières Ouvertes',
            value: loading ? <CircularProgress size={24} /> : counts.filieres.toLocaleString(),
            icon: <AccountBalance fontSize="large" color="success" />,
            desc: 'Année universitaire courante'
        },
        {
            title: 'Matières au Catalogue',
            value: loading ? <CircularProgress size={24} /> : counts.matieres.toLocaleString(), 
            icon: <School fontSize="large" color="warning" />,
            desc: "Unités d'Enseignement (UE)"
        },
    ];

    return (
        <Box sx={{ p: 1 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="#1e293b">
                Vue Générale & Statistiques
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Bienvenue dans votre espace de contrôle centralisé du système universitaire.
            </Typography>

            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ boxShadow: 1, borderRadius: 2, height: '100%' }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                    {stat.icon}
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                        {stat.title}
                                    </Typography>
                                    <Box sx={{ my: 0.5, minHeight: '40px', display: 'flex', alignItems: 'center' }}>
                                        {/* NAHITSY: Nosarahina tsara amin'ny Typography ny fampiasana dika renders samihafa */}
                                        {loading ? stat.value : (
                                            <Typography variant="h4" fontWeight="bold">
                                                {stat.value}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        {stat.desc}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}