import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    Select,
    MenuItem,
    FormControl,
    Grid
} from '@mui/material';
import { CalendarToday, AddHomeWork, PostAdd } from '@mui/icons-material';
import { Link } from 'react-router';
// NAHITSY: Nampidirina ny axiosInstance
import axiosInstance from '../api/axios';

export default function GestionCoursEDT() {
    const [subTab, setSubTab] = useState(0);

    // NAHITSY: Iray ihany ny etat mitantana ny cours azo avy amin'ny API
    const [coursListe, setCoursListe] = useState([]);
    const [enseignantChoices, setEnseignantChoices] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Maka ny lisitry ny Cours sy ny Mpampianatra rehefa misokatra ny pejy
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resCours, resEnseignants] = await Promise.all([
                    axiosInstance.get("/matieres/"),
                    axiosInstance.get("/enseignants/")
                ]);
                setCoursListe(resCours.data);
                setEnseignantChoices(resEnseignants.data);
            } catch (error) {
                console.error("Erreur chargement des données", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 2. Fonksiona mandray ny fiovana rehefa manendry mpampianatra (Affectation)
    const handleAffectationChange = async (coursId, enseignantId) => {
        // Ny sanda alefa any amin'ny Django: raha banga dia atao null
        const selectedEnseignant = enseignantId === "" ? null : enseignantId;

        try {
            // Alefa any amin'ny API amin'ny alalan'ny PATCH ny fanovana
            await axiosInstance.patch(`/matieres/${coursId}/`, {
                enseignant: selectedEnseignant
            });

            // Ovaina ny sary eo amin'ny Frontend rehefa mahomby ny API
            setCoursListe(prev => prev.map(c =>
                c.id === coursId ? { ...c, enseignant: selectedEnseignant } : c
            ));
        } catch (err) {
            console.error("Erreur d'affectation", err);
            alert("Impossible de modifier l'enseignant affecté.");
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">Chargement des données...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="#1e293b">
                Supervision Pédagogique &amp; Logistique
            </Typography>

            <Tabs value={subTab} onChange={(e, val) => setSubTab(val)} sx={{ borderBottom: 1, borderColor: 'divider', my: 2 }}>
                <Tab label="Catalogue des Cours (Matières)" />
                <Tab label="Emploi du Temps (EDT)" />
                <Tab label="Gestion du Parc Immobilier (Salles)" />
            </Tabs>

            <Alert severity="info" sx={{ mb: 3 }}>
                Le système intègre un **gestionnaire automatisé de conflits** empêchant la double réservation simultanée d'un enseignant ou d'une salle physique.
            </Alert>

            {subTab === 0 && (
                <Box>
                    <Grid sx={{ gap: 3, display: 'flex', mb: 3 }}>
                        <Button variant="contained" startIcon={<PostAdd />} color='success' sx={{ fontWeight: 'bold' }} component={Link} to="/admin/ajouter-matiere">
                            Créer un cours (UE)
                        </Button>
                        <Button variant="contained" startIcon={<PostAdd />} color='primary' sx={{ fontWeight: 'bold' }} component={Link} to="/admin/ajouter-enseignant">
                            Ajouter un Enseignant
                        </Button>
                    </Grid>

                    <TableContainer component={Paper} sx={{ boxShadow: 1, borderRadius: 2 }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Intitulé de la matière</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Crédits ECTS</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', width: '320px' }}>Enseignant Affecté</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {coursListe.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                            Aucun cours disponible au programme.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    coursListe.map((item) => (
                                        <TableRow key={item.id} hover>
                                            {/* NAHITSY: Mifanaraka amin'ny Django Model Fields ny anaran'ny saha */}
                                            <TableCell>{item.code_matiere}</TableCell>
                                            <TableCell sx={{ fontWeight: 'medium' }}>{item.titre}</TableCell>
                                            <TableCell>{item.credits_ects} ECTS</TableCell>
                                            <TableCell>
                                                {item.enseignant_details?.user_details ? (
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {item.enseignant_details.user_details.first_name} {item.enseignant_details.user_details.last_name}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                        Aucun enseignant affecté
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {subTab === 1 && (
                <Box sx={{ p: 4, border: '2px dashed #cbd5e1', borderRadius: 2, textAlign: 'center', bgcolor: '#f8fafc' }}>
                    <CalendarToday sx={{ fontSize: 48, color: '#94a3b8', mb: 1 }} />
                    <Typography color="text.secondary">
                        Interface interactive du Calendrier Semestriel (Grille de Planification / FullCalendar v6 à connecter ici).
                    </Typography>
                </Box>
            )}

            {subTab === 2 && (
                <Box>
                    <Button variant="contained" startIcon={<AddHomeWork />} sx={{ mb: 2, bgcolor: '#2563eb' }}>
                        Ajouter une Infrastructure
                    </Button>
                    <Typography variant="body1" color="text.secondary">
                        Liste des Amphis, Labos de TP, et salles de TD disponibles.
                    </Typography>
                </Box>
            )}
        </Box>
    );
}