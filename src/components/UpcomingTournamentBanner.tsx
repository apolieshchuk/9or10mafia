import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { Link as RouterLink } from 'react-router-dom';
import axios from '../axios';

const SESSION_KEY = 'upcoming_tournament_toast_v2';

type UpcomingItem = {
  id: string;
  name: string;
};

/**
 * Non-blocking corner hint for the nearest upcoming tournament (marketing home).
 */
export default function UpcomingTournamentBanner() {
  const [open, setOpen] = React.useState(false);
  const [tournament, setTournament] = React.useState<UpcomingItem | null>(null);

  React.useEffect(() => {
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get<{ items: UpcomingItem[] }>('/public/upcoming-tournaments');
        const list = data.items || [];
        if (!cancelled && list.length > 0) {
          setTournament(list[0]);
          setOpen(true);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dismiss = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  if (!tournament) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={null}
      onClose={(_, reason) => {
        if (reason === 'escapeKeyDown') dismiss();
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{
        bottom: { xs: 16, sm: 24 },
        right: { xs: 16, sm: 24 },
        left: { xs: 16, sm: 'auto' },
        maxWidth: '100%',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 1.75,
          pr: 1,
          maxWidth: 360,
          borderRadius: 2,
          border: (t) => `1px solid ${t.palette.divider}`,
          background: (t) =>
            t.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${t.palette.grey[900]} 0%, ${t.palette.grey[800]} 100%)`
              : `linear-gradient(135deg, ${t.palette.primary.light}22 0%, ${t.palette.background.paper} 100%)`,
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <EmojiEventsOutlinedIcon color="primary" sx={{ fontSize: 28, mt: 0.25, flexShrink: 0 }} />
          <Stack spacing={1} sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" sx={{ lineHeight: 1.45 }}>
              <Typography component="span" fontWeight={700} color="primary">
                {tournament.name}
              </Typography>{' '}
              вже скоро!
            </Typography>
            <Button
              component={RouterLink}
              to={`/tournaments/${tournament.id}`}
              variant="contained"
              size="small"
              disableElevation
              sx={{ alignSelf: 'flex-start', textTransform: 'none', fontWeight: 600 }}
              onClick={dismiss}
            >
              Дивитись учасників
            </Button>
          </Stack>
          <IconButton size="small" aria-label="Закрити" onClick={dismiss} sx={{ mt: -0.5, mr: -0.5 }}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Paper>
    </Snackbar>
  );
}
