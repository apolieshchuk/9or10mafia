import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import visuallyHidden from '@mui/utils/visuallyHidden';
import {styled} from '@mui/material/styles';
import {useAuth} from "../AuthProvider";

const StyledBox = styled('div')(({theme}) => ({
  alignSelf: 'center',
  padding: '10rem',
  width: '100%',
  height: 400,
  marginTop: theme.spacing(8),
  borderRadius: (theme.vars || theme).shape.borderRadius,
  outline: '6px solid',
  outlineColor: 'hsla(220, 25%, 80%, 0.2)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.grey[200],
  boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
  backgroundImage: `url(${process.env.TEMPLATE_IMAGE_URL || './images/bg.png'})`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  [theme.breakpoints.up('xs')]: {
    marginTop: theme.spacing(10),
    height: 100,
  },
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(10),
    height: 400,
  },
  [theme.breakpoints.up('md')]: {
    marginTop: theme.spacing(10),
    height: 750,
  },
  ...theme.applyStyles('dark', {
    boxShadow: '0 0 24px 12px hsla(210, 100%, 25%, 0.2)',
    backgroundImage: `url(${process.env.TEMPLATE_IMAGE_URL || './images/bg.png'})`,
    outlineColor: 'hsla(220, 20%, 42%, 0.1)',
    borderColor: (theme.vars || theme).palette.grey[700],
  }),
}));

export default function Hero() {
  const { user } = useAuth();

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',

        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: {xs: 14, sm: 20},
          pb: {xs: 8, sm: 12},
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{alignItems: 'center', width: {xs: '100%', sm: '70%'}}}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: {xs: 'column', sm: 'row'},
              alignItems: 'center',
              fontSize: {xs: '2.5rem', sm: 'clamp(3rem, 10vw, 3.5rem)'},
              background: 'linear-gradient(to bottom right, blue, yellow);',
              // radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)
              // background: linear-gradient(45deg, red, black);
              '-webkit-background-clip': 'text',
              '-webkit-text-fill-color': 'transparent',
            }}
          >
            Nine&nbsp;or&nbsp;Ten&nbsp;Mafia
            {/*<Typography*/}
            {/*  component="span"*/}
            {/*  variant="h1"*/}
            {/*  sx={(theme) => ({*/}
            {/*    fontSize: 'inherit',*/}
            {/*    color: 'primary.main',*/}
            {/*    ...theme.applyStyles('dark', {*/}
            {/*      color: 'primary.light',*/}
            {/*    }),*/}
            {/*      // background: 'linear-gradient(45deg, red, grey)',*/}
            {/*      // '-webkit-background-clip': 'text',*/}
            {/*      // '-webkit-text-fill-color': 'transparent'*/}
            {/*  })}*/}
            {/*>*/}
            {/*    Мафія*/}
            {/*</Typography>*/}
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: {sm: '100%', md: '80%'},
            }}
          >
            Рейтингова платформа інтелектуально-психологічної гри "Мафія".
            Створюйте клуби, редагуйте та діліться рейтингами з іншими гравцями.
          </Typography>
          <Stack
            direction={{xs: 'column', sm: 'row'}}
            spacing={1}
            useFlexGap
            sx={{pt: 2, width: {xs: '100%', sm: '380px'}}}
          >
            {
              user && <>
                    <Typography
                        variant="h2"
                        sx={{
                          textAlign: 'center',
                          color: 'text.secondary',
                          width: {sm: '100%'},
                        }}
                    >
                        Привіт, {user.authType === 'Клуб' ? user.name : user.nickname }!
                    </Typography>
                </>
            }
            {
              !user && <>
                    <Button
                        href={'login'}
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{minWidth: 'fit-content'}}
                    >
                        Увійти
                    </Button>
                    <Button
                        href={'register'}
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{minWidth: 'fit-content'}}
                    >
                        Зареєструватися
                    </Button>
                    <Button
                        disabled
                        variant="outlined"
                        color="primary"
                        href={'register-club'}
                        size="small"
                        sx={{minWidth: 'fit-content'}}
                    >
                        Зареєструвати клуб
                    </Button>
                </>
            }
          </Stack>
          {/*<Typography*/}
          {/*  variant="caption"*/}
          {/*  color="text.secondary"*/}
          {/*  sx={{ textAlign: 'center' }}*/}
          {/*>*/}
          {/*  By clicking &quot;Start now&quot; you agree to our&nbsp;*/}
          {/*  <Link href="#" color="primary">*/}
          {/*    Terms & Conditions*/}
          {/*  </Link>*/}
          {/*  .*/}
          {/*</Typography>*/}
        </Stack>
        <StyledBox id="image"/>
      </Container>
    </Box>
  );
}
