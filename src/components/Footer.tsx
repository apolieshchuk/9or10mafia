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

function Copyright() {
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
        py: { xs: 4, sm: 5 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            minWidth: { xs: '100%', sm: '60%' },
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
            <SitemarkIcon />
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              Контакти
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              +1 (403) 390-1484
            </Typography>
            {/*<InputLabel htmlFor="email-newsletter">Email</InputLabel>*/}
            {/*<Stack direction="row" spacing={1} useFlexGap>*/}
            {/*  <TextField*/}
            {/*    id="email-newsletter"*/}
            {/*    hiddenLabel*/}
            {/*    size="small"*/}
            {/*    variant="outlined"*/}
            {/*    fullWidth*/}
            {/*    aria-label="Enter your email address"*/}
            {/*    placeholder="Your email address"*/}
            {/*    slotProps={{*/}
            {/*      htmlInput: {*/}
            {/*        autoComplete: 'off',*/}
            {/*        'aria-label': 'Enter your email address',*/}
            {/*      },*/}
            {/*    }}*/}
            {/*    sx={{ width: '250px' }}*/}
            {/*  />*/}
            {/*  <Button*/}
            {/*    variant="contained"*/}
            {/*    color="primary"*/}
            {/*    size="small"*/}
            {/*    sx={{ flexShrink: 0 }}*/}
            {/*  >*/}
            {/*    Subscribe*/}
            {/*  </Button>*/}
            {/*</Stack>*/}
          </Box>
        </Box>
        {/*<Box*/}
        {/*  sx={{*/}
        {/*    display: { xs: 'none', sm: 'flex' },*/}
        {/*    flexDirection: 'column',*/}
        {/*    gap: 1,*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>*/}
        {/*    Product*/}
        {/*  </Typography>*/}
        {/*  <Link color="text.secondary" variant="body2" href="#">*/}
        {/*    Features*/}
        {/*  </Link>*/}
        {/*  <Link color="text.secondary" variant="body2" href="#">*/}
        {/*    Testimonials*/}
        {/*  </Link>*/}
        {/*  <Link color="text.secondary" variant="body2" href="#">*/}
        {/*    Highlights*/}
        {/*  </Link>*/}
        {/*  <Link color="text.secondary" variant="body2" href="#">*/}
        {/*    Pricing*/}
        {/*  </Link>*/}
        {/*  <Link color="text.secondary" variant="body2" href="#">*/}
        {/*    FAQs*/}
        {/*  </Link>*/}
        {/*</Box>*/}
        {/*<Box*/}
        {/*  sx={{*/}
        {/*    display: { xs: 'none', sm: 'flex' },*/}
        {/*    flexDirection: 'column',*/}
        {/*    gap: 1,*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>*/}
        {/*    Company*/}
        {/*  </Typography>*/}
        {/*  <Link color="text.secondary" variant="body2" href="#">*/}
        {/*    About us*/}
        {/*  </Link>*/}
        {/*  <Link color="text.secondary" variant="body2" href="#">*/}
        {/*    Careers*/}
        {/*  </Link>*/}
        {/*  <Link color="text.secondary" variant="body2" href="#">*/}
        {/*    Press*/}
        {/*  </Link>*/}
        {/*</Box>*/}
        {/*<Box*/}
        {/*  sx={{*/}
        {/*    display: { xs: 'none', sm: 'flex' },*/}
        {/*    flexDirection: 'column',*/}
        {/*    gap: 1,*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>*/}
        {/*    Legal*/}
        {/*  </Typography>*/}
        {/*  <Link color="text.secondary" variant="body2" href="#">*/}
        {/*    Terms*/}
        {/*  </Link>*/}
        {/*  <Link color="text.secondary" variant="body2" href="#">*/}
        {/*    Privacy*/}
        {/*  </Link>*/}
        {/*  <Link color="text.secondary" variant="body2" href="#">*/}
        {/*    Contact*/}
        {/*  </Link>*/}
        {/*</Box>*/}
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: { xs: 2, sm: 4 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <div>
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
            href="https://www.instagram.com/mafia_vancouver_9or10_club/"
            aria-label="Instagram"
            sx={{ alignSelf: 'center' }}
          >
            <InstagramIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href="https://www.youtube.com/@9or10MafiaVancouver"
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
