import React from 'react';
import { Box, Typography, Button, Paper, List, ListItem, ListItemIcon, ListItemText, Stack, Alert } from '@mui/material';
import { Backup, BugReport, LockClock } from '@mui/icons-material';

export default function SecuriteBackups() {
    const logs = [
        { time: '10:14:02', event: 'Backup automatique de la base de données exécuté avec succès.', type: 'info' },
        { time: '09:45:12', event: 'Échec de connexion répété (3 fois) sur le compte étudiant ID: 2544', type: 'warn' },
        { time: '08:00:00', event: 'Initialisation du jeton de sécurité système accomplie.', type: 'info' },
    ];

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="#1e293b">
                Sécurité, Logs & Maintenance
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 4, mt: 2 }}>
                <Button variant="contained" startIcon={<Backup />} sx={{ bgcolor: '#0f172a' }}>
                    Lancer un Backup Manuel immédiat
                </Button>
                <Button variant="outlined" color="error" startIcon={<BugReport />}>
                    Vider les caches système
                </Button>
            </Stack>

            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Journal d'audit en temps réel (Système)
            </Typography>

            <Paper sx={{ p: 2, bgcolor: '#1e293b', color: '#38bdf8', fontFamily: 'monospace', borderRadius: 2 }}>
                <List dense>
                    {logs.map((log, index) => (
                        <ListItem key={index}>
                            <ListItemIcon sx={{ color: log.type === 'warn' ? '#f43f5e' : '#34d399', minWidth: 35 }}>
                                <LockClock fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                                primary={`[${log.time}] - ${log.event}`} 
                                primaryTypographyProps={{ fontSize: '0.85rem', fontFamily: 'monospace', color: log.type === 'warn' ? '#fca5a5' : '#e2e8f0' }} 
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
}