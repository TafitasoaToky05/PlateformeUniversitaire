import * as React from 'react';
import { Box, Container, CssBaseline, Typography, Button, Paper } from '@mui/material';
import { CheckCircleOutlineOutlined, LoginOutlined } from '@mui/icons-material';

export default function SuccessResetPassword() {
  return (
    <Box
      sx={{
        backgroundColor: '#f8fafc', // Fond mazava mitovy amin'ny pejy rehetra
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3,
            bgcolor: '#ffffff',
            textAlign: 'center'
          }}
        >
          {/* Icone Success Maitso tsara tarehy */}
          <Box
            sx={{
              m: 2,
              bgcolor: 'rgba(34, 197, 94, 0.1)', // Maitso tamberina maivana (Light Green alert)
              color: '#22c55e', // Maitso fahombiazana
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              mb: 3,
              boxShadow: '0px 4px 20px rgba(34, 197, 94, 0.15)'
            }}
          >
            <CheckCircleOutlineOutlined sx={{ fontSize: 50 }} />
          </Box>

          {/* Lohateny */}
          <Typography component="h1" variant="h5" fontWeight="bold" color="#1e3a8a" sx={{ mb: 1 }}>
            Mot de passe modifié !
          </Typography>
          
          {/* Hafatra fanazavana */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, px: 2, lineHeight: 1.6 }}>
            Voasolo soa aman-tsara ny teny miafinao. Azonao ampiasaina mivantana ilay teny miafina vaovao izao rehefa hiditra amin'ny sehatra ianao.
          </Typography>

          {/* Bokotra miverina mampifandray (Login Button) */}
          <Button
            fullWidth
            variant="contained"
            href="#" // Soloy ny rohy mankany amin'ny pejy Login-nao eto (ohatra: "/login")
            startIcon={<LoginOutlined />}
            sx={{
              mb: 2,
              py: 1.3,
              borderRadius: 2,
              bgcolor: '#2563eb', // Manga mitovy amin'ny rafitra manontolo
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': { bgcolor: '#1d4ed8' },
              boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.2)'
            }}
          >
            Se connecter
          </Button>
          
        </Paper>
      </Container>
    </Box>
  );
}