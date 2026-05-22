import * as React from 'react';
import { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box, Drawer, CssBaseline, AppBar as MuiAppBar, Toolbar, List, Typography,
  Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Container, ListSubheader, Badge, Avatar,
  Button
} from '@mui/material';


import {
  Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon,
  Assignment, Calculate, HowToReg, AssignmentTurnedIn,
  Campaign, BarChart, Mail, School,
  Logout
} from '@mui/icons-material';


import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const drawerWidth = 280;

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

export default function NavbarEnseignant({ children }) { // CORRECTION: Utilisation de children
  const theme = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // CORRECTION DES LIENS pour correspondre aux routes définies dans AppContent
  const menuSections = [
    {
      category: 'Tableau de Bord',
      items: [
        { text: 'Tableau de Bord', icon: <School />, lien: '/enseignant/dashboard' },
      ]
    },
    {
      category: 'Espace Pédagogique',
      items: [
        { text: 'Gestion des Matières', icon: <Assignment />, lien: '/enseignant/gestion-matieres' },
        { text: 'Devoirs & Examens', icon: <AssignmentTurnedIn />, lien: '/enseignant/gestion-exercices-examens' }
      ]
    },
    {
      category: 'Suivi des Étudiants',
      items: [
        { text: 'Gestion Présence', icon: <HowToReg />, lien: '/enseignant/presence' },
        { text: 'Gestion des Notes', icon: <Calculate />, lien: '/enseignant/notes' } // Assurez-vous que cette route existe
      ]
    },
    {
      category: 'Outils & Analyses',
      items: [
        { text: 'Communication', icon: <Campaign />, lien: '/enseignant/communication' },
        { text: 'Statistiques', icon: <BarChart />, lien: '/enseignant/statistiques' }
      ]
    }
  ];

  const allItems = menuSections.flatMap(section => section.items);
  const currentItem = allItems.find(item => item.lien === location.pathname);
  const activeMenuTitle = currentItem ? currentItem.text : 'Espace Enseignant';

  const { logoutUser } = useAuth();
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" open={open} sx={{ bgcolor: '#1e3a8a', boxShadow: 2,  display:'flex', flexDirection:'row', alignItems:'center', justifyContent:"space-between"}}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleDrawerOpen} edge="start" sx={{ mr: 2, ...(open && { display: 'none' }) }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: '600' }}>
            {activeMenuTitle}
          </Typography>
        </Toolbar>
        <Box>
          <Button
            color="inherit"
            onClick={logoutUser}
            startIcon={<Logout />}
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            Se déconnecter
          </Button>
        </Box>
      </AppBar>

      <Drawer
        sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, bgcolor: '#0f172a', color: 'white' } }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader sx={{ bgcolor: '#111827', display: 'flex', justifyContent: 'space-between', px: 2 }}>
          <Typography variant="subtitle2" color="#64748b" textTransform="uppercase">Panel Enseignant</Typography>
          <IconButton onClick={handleDrawerClose} sx={{ color: 'white' }}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ bgcolor: '#1e293b' }} />

        {menuSections.map((section) => (
          <Box key={section.category}>
            <ListSubheader sx={{ bgcolor: 'transparent', color: '#64748b', fontWeight: 'bold', fontSize: '0.75rem', pt: 2, textTransform: 'uppercase' }}>
              {section.category}
            </ListSubheader>
            <List disablePadding>
              {section.items.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    selected={location.pathname === item.lien}
                    component={Link}
                    to={item.lien}
                    sx={{
                      mx: 1, borderRadius: 1, mb: 0.5,
                      '&.Mui-selected': { backgroundColor: '#2563eb', color: '#ffffff' },
                      '&:hover': { backgroundColor: '#334155' }
                    }}
                  >
                    <ListItemIcon sx={{ color: '#94a3b8', minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.85rem' }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Drawer>

      <Main open={open}>
        <DrawerHeader />
        <Container maxWidth="xl">
          {children} {/* CORRECTION: Injection des routes ici */}
        </Container>
      </Main>
    </Box>
  );
}