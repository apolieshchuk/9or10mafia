import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
// import TwitterIcon from '@mui/icons-material/X';
import SitemarkIcon from './SitemarkIcon';

export function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Copyright © '}
      <Link color="text.secondary" href="https://www.instagram.com/mafia_vancouver_9or10_club/">
        Nine or Ten Vancouver Mafia Club
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 2, sm: 4 },
        py: { xs: 2, sm: 2 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: { xs: 1, sm: 2 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <div>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 3 }}>
            <SitemarkIcon />
            <Box>
              <Typography variant="body2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                Контакти
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                +1 (403) 390-1484
              </Typography>
            </Box>
          </Box>
          {/*<Link color="text.secondary" variant="body2" href="#">*/}
          {/*  Privacy Policy*/}
          {/*</Link>*/}
          {/*<Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>*/}
          {/*  &nbsp;•&nbsp;*/}
          {/*</Typography>*/}
          {/*<Link color="text.secondary" variant="body2" href="#">*/}
          {/*  Terms of Service*/}
          {/*</Link>*/}
          <Copyright />
        </div>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ justifyContent: 'left', color: 'text.secondary' }}
        >
          <IconButton
            color="inherit"
            size="small"
            // href="https://www.instagram.com/mafia_vancouver_9or10_club/"
            aria-label="Instagram"
            onClick={() => window.open('https://www.instagram.com/mafia_vancouver_9or10_club/', "_blank")}
            sx={{ alignSelf: 'center' }}
          >
            <InstagramIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            // href="https://www.youtube.com/@9or10MafiaVancouver"
            onClick={() => window.open('https://www.youtube.com/@9or10MafiaVancouver', "_blank")}
            aria-label="YouTube"
            sx={{ alignSelf: 'center' }}
          >
            <YouTubeIcon />
          </IconButton>
          {/*<IconButton*/}
          {/*  color="inherit"*/}
          {/*  size="small"*/}
          {/*  href="https://www.linkedin.com/company/mui/"*/}
          {/*  aria-label="LinkedIn"*/}
          {/*  sx={{ alignSelf: 'center' }}*/}
          {/*>*/}
          {/*  <LinkedInIcon />*/}
          {/*</IconButton>*/}
        </Stack>
      </Box>
    </Container>
  );
}
