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
    Chip, 
    Stack,
    CircularProgress,
    IconButton,
    TextField,        // Nampiana: Ho an'ny zone de recherche
    InputAdornment,   // Nampiana: Hanesorana icon ao anaty TextField
    TablePagination   // Nampiana: Ho an'ny pagination
} from '@mui/material';
import { PersonAdd, CloudUpload, Edit, Block, Search } from '@mui/icons-material'; // Nampiana ny Search icon
import { Link } from 'react-router-dom'; 
import axiosInstance from '../api/axios'; 

export default function GestionUtilisateurs() {
    const [currentTab, setCurrentTab] = useState(0);
    const [users, setUsers] = useState(null); 
    const [loading, setLoading] = useState(true);

    // State vaovao ho an'ny fikarohana sy pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Mpampiasa 5 isaky ny pejy mialoha

    // 1. Maka ny lisitry ny mpampiasa rehetra rehefa misokatra ny pejy
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/utilisateurs/');
                setUsers(response.data);
            } catch (error) {
                console.error("Erreur chargement des utilisateurs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Averina ho 0 ny pejy rehefa miova ny Tab na miova ny fikarohana
    useEffect(() => {
        setPage(0);
    }, [currentTab, searchTerm]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // 2. Fonksiona manasivana (filter) ny mpampiasa amin'ny alalan'ny Tab SY ny Fikarohana
    const getFilteredUsers = () => {
        if (!users) return [];
        
        return users.filter(user => {
            // Sivana voalohany: Rôle (Tabs)
            const roleMatch = () => {
                switch (currentTab) {
                    case 1: return user.role?.toLowerCase() === 'enseignant';
                    case 2: return user.role?.toLowerCase() === 'etudiant';
                    case 3: return user.role?.toLowerCase() === 'admin';
                    default: return true; // Tous les comptes
                }
            };

            // Sivana faharoa: Fikarohana (Anarana, Email, na Username)
            const fullName = (user.nom || `${user.first_name || ''} ${user.last_name || ''}`).toLowerCase();
            const email = (user.email || '').toLowerCase();
            const username = (user.username || '').toLowerCase();
            const search = searchTerm.toLowerCase();

            const searchMatch = fullName.includes(search) || email.includes(search) || username.includes(search);

            return roleMatch() && searchMatch;
        });
    };

    const filteredUsers = getFilteredUsers();

    // 3. Fitantanana ny pagination (Pejy)
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Ny mpampiasa ho hita eo amin'ny pejy ankehitriny ihany
    const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="#1e293b">
                Gestion des Utilisateurs & Rôles
            </Typography>
            
                {/* Fizarana bokotra ambony
                <Stack direction="row" spacing={2} sx={{ mb: 3, mt: 2 }}>
                    <Button 
                        variant="contained" 
                        startIcon={<PersonAdd />} 
                        sx={{ bgcolor: '#2563eb', fontWeight: 'bold' }}
                        component={Link}
                        to="/ajouter-enseignant"
                    >
                        Nouvel Utilisateur
                    </Button>
                    <Button variant="outlined" startIcon={<CloudUpload />} color="primary" sx={{ fontWeight: 'bold' }}>
                        Importer un lot (CSV/Excel)
                    </Button>
                </Stack> */}

            {/* Zone de recherche sy ny Tabs napetraka mifanila na mifanindry tsara */}
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={2} sx={{ mb: 2 }}>
                <Tabs 
                    value={currentTab} 
                    onChange={(e, val) => setCurrentTab(val)} 
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Tous les Comptes" />
                    <Tab label="Enseignants" />
                    <Tab label="Étudiants" />
                    <Tab label="Administrateurs" />
                </Tabs>

                {/* NAHITSY: Zone de recherche */}
                <TextField
                    size="small"
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: { xs: '100%', md: '300px' } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

            <TableContainer component={Paper} sx={{ boxShadow: 1, borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                        <TableRow>
                            <TableCell size="small" sx={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nom & Prénom</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Adresse Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Rôle</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                    Aucun utilisateur trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedUsers.map((user) => {
                                const fullName = user.nom || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;
                                const userRole = user.role || 'etudiant';

                                return (
                                    <TableRow key={user.id} hover>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell sx={{ fontWeight: 'medium' }}>{fullName}</TableCell>
                                        <TableCell>{user.email || "Pas d'email"}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={userRole.toUpperCase()} 
                                                size="small" 
                                                color={userRole === 'admin' ? 'error' : userRole === 'enseignant' ? 'warning' : 'primary'} 
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" color="primary" title="Modifier">
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" title="Suspendre">
                                                <Block fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
                
                {/* NAHITSY: Pagination eo ambany tabilao */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredUsers.length} // Ny isan'ny mpampiasa voadio ihany
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Lignes par page:"
                />
            </TableContainer>
        </Box>
    );
}