import React from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Alert,
    Stack 
} from '@mui/material';
import { Verified, FileDownload } from '@mui/icons-material';

export default function ControleNotes() {
    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="#1e293b">
                Audit &amp; Contrôle des Évaluations
            </Typography>
            
            <Alert severity="warning" sx={{ mb: 3 }}>
                <strong>Droit de validation final :</strong> Les enseignants saisissent les notes, mais la validation définitive et la clôture des PV de délibération relèvent de votre responsabilité exclusive.
            </Alert>

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Button variant="contained" color="success" startIcon={<Verified />}>
                    Valider le Semestre Actuel (Clôture)
                </Button>
                <Button variant="outlined" startIcon={<FileDownload />}>
                    Exporter les Rapports de Réussite (.XLS)
                </Button>
            </Stack>

            <TableContainer component={Paper} sx={{ boxShadow: 1, borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Filière</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Matière / Code</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Moyenne Générale</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Statut Saisie</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                        </TableRow>
                    </TableHead> {/* HOZITRA : Nahitsy teto (</TableHead> fa tsy </Head>) */}
                    <TableBody>
                        <TableRow hover>
                            <TableCell sx={{ fontWeight: 'medium' }}>Master 2 IoT</TableCell>
                            <TableCell>Sécurité IoT (INF-401)</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>14.25 / 20</TableCell>
                            <TableCell sx={{ color: '#16a34a', fontWeight: '600' }}>
                                Complète (En attente de verrouillage)
                            </TableCell>
                            <TableCell align="right">
                                <Button size="small" variant="text" color="primary">
                                    Auditer le carnet
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}