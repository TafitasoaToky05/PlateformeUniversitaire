import React from 'react';
import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    MenuItem, 
    Paper, 
    Stack, 
    Grid, 
    List, 
    ListItem, 
    ListItemText, 
    Divider, 
    Chip 
} from '@mui/material';
import { Send, Campaign, History } from '@mui/icons-material';

export default function CommunicationAdmin() {
    // Simulation d'un historique d'annonces envoyées
    const historiqueAnnonces = [
        {
            id: 1,
            titre: "Maintenance du serveur InfluxDB",
            cible: "Master 2 IoT",
            date: "16/05/2026 09:30",
            message: "Le serveur de base de données sera indisponible pour maintenance de 14h à 16h.",
            colorCible: "info"
        },
        {
            id: 2,
            titre: "Saisie des notes du Semestre 1",
            cible: "Enseignants",
            date: "14/05/2026 15:45",
            message: "Rappel : La date limite pour la validation des notes est fixée au vendredi prochain.",
            colorCible: "warning"
        },
        {
            id: 3,
            titre: "Fermeture exceptionnelle de l'établissement",
            cible: "Tous",
            date: "10/05/2026 11:20",
            message: "L'université sera fermée le lundi de Pentecôte. Les cours reprendront le mardi.",
            colorCible: "error"
        }
    ];

    return (
        <Box sx={{ p: 1 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="#1e293b">
                Portail de Communication & Flash Infos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Publiez des annonces urgentes ou diffusez des messages par lot à destination de votre écosystème.
            </Typography>

            {/* Grid Container handrindrana ny fizarana roa */}
            <Grid container spacing={4}>
                
                {/* Fizarana 1: Formulaire fandefasana hafatra (Eo ankavia) */}
                <Grid item xs={12} md={5}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Campaign color="primary" /> Nouvelle Annonce
                    </Typography>
                    <Paper sx={{ p: 3, boxShadow: 1, borderRadius: 2 }}>
                        <Stack spacing={3}>
                            <TextField select label="Cible du message" defaultValue="tous" fullWidth>
                                <MenuItem value="tous">Tout l'établissement (Étudiants & Enseignants)</MenuItem>
                                <MenuItem value="enseignants">Enseignants uniquement</MenuItem>
                                <MenuItem value="m2_iot">Classe : Master 2 IoT</MenuItem>
                            </TextField>

                            <TextField label="Titre de l'Annonce" variant="outlined" placeholder="Ex: Report des examens ou Maintenance Système" fullWidth />

                            <TextField label="Corps de l'annonce" multiline rows={6} variant="outlined" placeholder="Écrivez votre message ici..." fullWidth />

                            <Button variant="contained" endIcon={<Send />} sx={{ bgcolor: '#1e3a8a', py: 1.2, fontWeight: 'bold' }}>
                                Diffuser la notification
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Fizarana 2: Historique des discussions (Eo ankavanana) */}
                <Grid item xs={12} md={7}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <History color="action" /> Historique des Annonces Envoyer
                    </Typography>
                    <Paper sx={{ p: 2, boxShadow: 1, borderRadius: 2, maxHeight: '550px', overflowY: 'auto', bgcolor: '#f8fafc' }}>
                        <List disablePadding>
                            {historiqueAnnonces.map((annonce, index) => (
                                <React.Fragment key={annonce.id}>
                                    <ListItem alignItems="flex-start" sx={{ px: 1, py: 2 }}>
                                        <ListItemText
                                            primary={
                                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                                    <Typography variant="subtitle1" fontWeight="bold" color="#0f172a">
                                                        {annonce.titre}
                                                    </Typography>
                                                    <Chip 
                                                        label={annonce.cible} 
                                                        size="small" 
                                                        color={annonce.colorCible} 
                                                        sx={{ fontWeight: '600', fontSize: '0.75rem' }} 
                                                    />
                                                </Stack>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" color="text.primary" sx={{ mb: 1, lineHeight: '1.4rem' }}>
                                                        {annonce.message}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', fontStyle: 'italic' }}>
                                                        Envoyé le : {annonce.date}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < historiqueAnnonces.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    );
}