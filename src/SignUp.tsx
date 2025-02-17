import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from './theme/AppTheme';
import ColorModeSelect from './theme/ColorModeSelect';
import { GoogleIcon, FacebookIcon } from './components/CustomIcons';
import SitemarkIcon from "./components/SitemarkIcon";

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [nickNameError, setNickNameError] = React.useState(false);
  const [nickNameErrorMessage, setNickNameErrorMessage] = React.useState('');

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const name = document.getElementById('name') as HTMLInputElement;
    const nickname = document.getElementById('nickname') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Введіть коректну електронну адресу');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Пароль повинен бути більше 6ти символів');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Потрібно вказати ім'я" );
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    if (!nickname.value || nickname.value.length < 1) {
      setNickNameError(true);
      setNickNameErrorMessage('Без нікнейму в "мафії" - нікуди');
      isValid = false;
    } else {
      setNickNameError(false);
      setNickNameErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (nameError || emailError || passwordError || nickNameError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get('name'),
      lastName: data.get('lastName'),
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Button
          href={'/'}
          variant="outlined"
          color="primary"
          size="small"
          // sx={{minWidth: 'fit-content'}}
          sx={{ position: 'fixed', top: '1rem', left: '1rem' }}
        >
          Головна
        </Button>
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            <SitemarkIcon />
            &nbsp;&nbsp;Зареєструватися
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Ігровий нік</FormLabel>
              <TextField
                autoComplete="nickname"
                name="nickname"
                required
                fullWidth
                id="nickname"
                placeholder="Jon Snow"
                error={nickNameError}
                helperText={nickNameErrorMessage}
                color={nickNameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="name">Імя</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Іван Шевченко"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Електронна адреса</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Пароль</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            {/*<FormControlLabel*/}
            {/*  control={<Checkbox value="allowExtraEmails" color="primary" />}*/}
            {/*  label="I want to receive updates via email."*/}
            {/*/>*/}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign up
            </Button>
          </Box>
          {/*<Divider>*/}
          {/*  <Typography sx={{ color: 'text.secondary' }}>or</Typography>*/}
          {/*</Divider>*/}
          {/*<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>*/}
          {/*  <Button*/}
          {/*    fullWidth*/}
          {/*    variant="outlined"*/}
          {/*    onClick={() => alert('Sign up with Google')}*/}
          {/*    startIcon={<GoogleIcon />}*/}
          {/*  >*/}
          {/*    Sign up with Google*/}
          {/*  </Button>*/}
          {/*  <Button*/}
          {/*    fullWidth*/}
          {/*    variant="outlined"*/}
          {/*    onClick={() => alert('Sign up with Facebook')}*/}
          {/*    startIcon={<FacebookIcon />}*/}
          {/*  >*/}
          {/*    Sign up with Facebook*/}
          {/*  </Button>*/}
          {/*  <Typography sx={{ textAlign: 'center' }}>*/}
          {/*    Already have an account?{' '}*/}
          {/*    <Link*/}
          {/*      href="/material-ui/getting-started/templates/sign-in/"*/}
          {/*      variant="body2"*/}
          {/*      sx={{ alignSelf: 'center' }}*/}
          {/*    >*/}
          {/*      Sign in*/}
          {/*    </Link>*/}
          {/*  </Typography>*/}
          {/*</Box>*/}
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
