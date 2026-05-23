import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
    Box, Drawer, CssBaseline, AppBar as MuiAppBar, Toolbar, List, Typography,
    Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Container, Chip, ListSubheader,
    Button
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon,
    AdminPanelSettings, People, AccountBalance, School, Assessment,
    Security, NotificationsActive, InsertChart, Logout,
} from '@mui/icons-material';
import axiosInstance from '../api/axios';
import { useAuth } from '../auth/AuthContext';

const drawerWidth = 280;

// ==========================================
// STYLES
// ==========================================
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export default function NavbarAdmin({ children }) {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const [totalFilieres, setTotalFilieres] = useState(0);

    const { logoutUser } = useAuth();

    useEffect(() => {
        axiosInstance.get("filieres/")
            .then(res => {
                const len = Array.isArray(res.data) ? res.data.length : (res.data.results?.length || 0);
                setTotalFilieres(len);
            })
            .catch(err => console.error("Erreur:", err));
    }, []);

    const menuSections = [
        { category: 'Vue Générale', items: [{ text: 'Tableau de Bord', icon: <InsertChart />, lien: '/admin/dashboard-admin' }] },
        { category: '1. Gouvernance', items: [{ text: 'Gestion Utilisateurs', icon: <People />, lien: '/admin/gestion-utilisateurs' }] },
        { category: '2. Architecture Académique', items: [{ text: 'Filières', icon: <AccountBalance />, lien: '/admin/architecture-academique' }] },
        { category: '3. Pédagogie', items: [
            { text: 'Matiere', icon: <School />, lien: '/admin/admin-cours' },
            // { text: 'Communication', icon: <NotificationsActive />, lien: '/admin/admin-communication' }
            
            ] },
        // { category: '4. Audit', items: [{ text: 'Notes', icon: <Assessment />, lien: '/admin/controle-notes' }, { text: 'Sécurité', icon: <Security />, lien: '/admin/securite-backups' }] }
    ];

    const currentItem = menuSections.flatMap(s => s.items).find(i => i.lien === location.pathname);
    const activeMenuTitle = currentItem ? currentItem.text : 'Administration';

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* HEADER UNIQUE */}
            <AppBar position="fixed" open={open} sx={{ bgcolor: '#1e3a8a', boxShadow: 2 }}>
                <Toolbar>
                    <IconButton color="inherit" onClick={() => setOpen(!open)} edge="start" sx={{ mr: 2, ...(open && { display: 'none' }) }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: '600' }}>{activeMenuTitle}</Typography>
                    <Chip label={`Filières: ${totalFilieres}`} color="info" sx={{ fontWeight: 'bold', mr: 2 }} />
                    <Button
                        color="inherit"
                        onClick={logoutUser}
                        startIcon={<Logout />}
                        sx={{
                            ml: 1,
                            textTransform: 'none', // Mba tsy ho lasa "uppercase" ho azy ny soratra
                            '&:hover': { bgcolor: '#dc2626', color: '#fff' }
                        }}
                    >
                        Se deconnecter
                    </Button>
                </Toolbar>
            </AppBar>

            {/* DRAWER */}
            <Drawer sx={{ width: drawerWidth, '& .MuiDrawer-paper': { width: drawerWidth, bgcolor: '#0f172a', color: 'white' } }} variant="persistent" anchor="left" open={open}>
                <DrawerHeader sx={{ bgcolor: '#111827', display: 'flex', justifyContent: 'space-between', px: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AdminPanelSettings sx={{ color: '#38bdf8', mr: 1 }} />
                        <Typography variant="subtitle1" fontWeight="bold" color="#38bdf8">CENTRAL ADMIN</Typography>
                    </Box>
                    <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }}><ChevronLeftIcon /></IconButton>
                </DrawerHeader>
                <Divider sx={{ bgcolor: '#1e293b' }} />

                {menuSections.map((section) => (
                    <Box key={section.category}>
                        <ListSubheader sx={{ bgcolor: 'transparent', color: '#64748b', fontSize: '0.75rem', fontWeight: 'bold' }}>{section.category}</ListSubheader>
                        <List disablePadding>
                            {section.items.map((item) => (
                                <ListItem key={item.text} disablePadding>
                                    <ListItemButton component={Link} to={item.lien} selected={location.pathname === item.lien} sx={{ mx: 1, borderRadius: 1, mb: 0.5, '&.Mui-selected': { bgcolor: '#2563eb' } }}>
                                        <ListItemIcon sx={{ color: '#94a3b8', minWidth: 40 }}>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.text} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ))}
            </Drawer>

            {/* MAIN CONTENT */}
            <Main open={open}>
                <DrawerHeader />
                <Container maxWidth="xl">{children}</Container>
            </Main>
        </Box>
    );
}