import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import {styled} from '@mui/material/styles';
import AppTheme from './theme/AppTheme';
import SitemarkIcon from './components/SitemarkIcon';
import {useNavigate, useSearchParams} from 'react-router-dom';
import axios from './axios';

const Card = styled(MuiCard)(({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {maxWidth: '450px'},
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const Container = styled(Stack)(({theme}) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {padding: theme.spacing(4)},
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function ResetPassword(props: {disableCustomTheme?: boolean}) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password') as string;
    const confirm = formData.get('confirm') as string;

    if (!password || password.length < 6) {
      setPasswordError('Пароль має бути не менше 6 символів');
      return;
    }
    if (password !== confirm) {
      setPasswordError('Паролі не співпадають');
      return;
    }
    setPasswordError('');
    setError('');
    setLoading(true);

    try {
      await axios.post('/auth/reset-password', {token, password});
      setSuccess(true);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Помилка сервера');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme/>
        <Container direction="column" justifyContent="space-between">
          <Card variant="outlined">
            <Alert severity="error">Невірне посилання для відновлення паролю.</Alert>
            <Button variant="contained" onClick={() => navigate('/login')}>На сторінку входу</Button>
          </Card>
        </Container>
      </AppTheme>
    );
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme/>
      <Container direction="column" justifyContent="space-between">
        <Button
          href="/"
          variant="outlined"
          color="primary"
          size="small"
          sx={{position: 'fixed', top: '1rem', left: '1rem'}}
        >
          Головна
        </Button>
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}>
            <SitemarkIcon/>&nbsp;&nbsp;Новий пароль
          </Typography>

          {success ? (
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
              <Alert severity="success">Пароль успішно змінено!</Alert>
              <Button variant="contained" fullWidth onClick={() => navigate('/login')}>
                Увійти
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{display: 'flex', flexDirection: 'column', width: '100%', gap: 2}}>
              <FormControl>
                <FormLabel htmlFor="password">Новий пароль</FormLabel>
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••"
                  required
                  fullWidth
                  variant="outlined"
                  error={!!passwordError}
                  helperText={passwordError}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="confirm">Підтвердити пароль</FormLabel>
                <TextField
                  id="confirm"
                  name="confirm"
                  type="password"
                  placeholder="••••••"
                  required
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
              {error && <Alert severity="error">{error}</Alert>}
              <Button type="submit" fullWidth variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={20}/> : 'Зберегти пароль'}
              </Button>
            </Box>
          )}
        </Card>
      </Container>
    </AppTheme>
  );
}
