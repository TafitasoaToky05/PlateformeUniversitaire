import * as React from 'react';
import {
  Box, Container, CssBaseline, Typography, TextField, Button,
  InputAdornment, Paper, Link, Alert
} from '@mui/material';
import {
  EmailOutlined, LockResetOutlined, ArrowBackOutlined
} from '@mui/icons-material';

export default function ForgotPassword() {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false); // Raha fahombiazana
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!email) {
      setError('Azafady, ampidiro ny adiresy email-nao.');
      return;
    }

    setLoading(true);

    // Simulation ny fandefasana mail (API call simulation)
    setTimeout(() => {
      // Ohatra fotsiny: mampiseho fahombiazana rehefa feno ny email
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
            bgcolor: '#ffffff'
          }}
        >
          {/* Icone Lock Reset */}
          <Box
            sx={{
              m: 1,
              bgcolor: '#1e3a8a',
              color: 'white',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              boxShadow: '0px 4px 10px rgba(30, 58, 138, 0.3)'
            }}
          >
            <LockResetOutlined fontSize="large" />
          </Box>

          {/* Raha mbola tsy lasa ny email (Formulaire eto) */}
          {!success ? (
            <>
              <Typography component="h1" variant="h5" fontWeight="bold" color="#1e3a8a" sx={{ mt: 1, mb: 1 }}>
                Mot de passe oublié ?
              </Typography>
              
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Ampidiro ny email nampiasainao tamin'ny namorona kaonty, ary handefasanay rohy hanovana izany ianao.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 1.5 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                {/* Input Email */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Adresse Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                {/* Bokotra handefasana mail */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    mb: 3,
                    py: 1.2,
                    borderRadius: 2,
                    bgcolor: '#2563eb',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#1d4ed8' },
                    boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.2)'
                  }}
                >
                  {loading ? 'Y mandefa rohy...' : 'Envoyer le lien'}
                </Button>
              </Box>
            </>
          ) : (
            /* Rehefa lasa soa aman-tsara ilay email (Success State) */
            <Box sx={{ textAlign: 'center', width: '100%' }}>
              <Typography component="h1" variant="h5" fontWeight="bold" color="#1e3a8a" sx={{ mt: 1, mb: 1 }}>
                Vérifiez votre boîte mail
              </Typography>
              
              <Alert severity="success" sx={{ width: '100%', my: 2, borderRadius: 1.5, textAlign: 'left' }}>
                Sokafy ny mailaka nalefa any amin'ny <strong>{email}</strong>. Misy torolalana any anatiny hanovana ny teny miafinao.
              </Alert>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Raha tsy hitanao ilay mailaka, azafady jereo ao amin'ny fizarana <em>Spam</em> na <em>Courrier indésirable</em>.
              </Typography>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => setSuccess(false)}
                sx={{
                  mb: 2,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: '#2563eb',
                  color: '#2563eb',
                  '&:hover': { borderColor: '#1d4ed8', bgcolor: 'rgba(37, 99, 235, 0.04)' }
                }}
              >
                Ranger indray (Ressayer)
              </Button>
            </Box>
          )}

          {/* Bokotra miverina any amin'ny Login */}
          <Box sx={{ mt: 1 }}>
            <Link 
              href="#" 
              sx={{ 
                color: '#1e3a8a', 
                fontWeight: 'medium', 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '0.875rem',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              <ArrowBackOutlined fontSize="small" /> Retour à la connexion
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}