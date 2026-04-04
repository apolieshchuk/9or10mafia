import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Link as RouterLink } from 'react-router-dom';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import axios from '../axios';
import { formatDateTimeUkVancouver } from '../utils/vancouverDate';

const SESSION_KEY = 'upcoming_tournaments_announced_v1';

type UpcomingItem = {
  id: string;
  name: string;
  scheduledDate: string;
  numGames: number;
  status: string;
  clubName: string;
};

export default function UpcomingTournamentDialog() {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<UpcomingItem[]>([]);

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
          setItems(list);
          setOpen(true);
        }
      } catch {
        /* ignore on marketing page if API unreachable */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  if (items.length === 0) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="upcoming-tournaments-title"
      slotProps={{
        paper: {
          sx: {
            maxWidth: 440,
            borderRadius: 2,
            border: (t) => `2px solid ${t.palette.primary.main}`,
            background: (t) =>
              t.palette.mode === 'dark'
                ? `linear-gradient(145deg, ${t.palette.grey[900]} 0%, ${t.palette.grey[800]} 100%)`
                : `linear-gradient(145deg, ${t.palette.primary.light}18 0%, ${t.palette.background.paper} 55%)`,
          },
        },
      }}
    >
      <DialogTitle id="upcoming-tournaments-title" sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
          <EventAvailableIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h6" component="span" fontWeight={700}>
              Незабаром турнір!
            </Typography>
            <Chip
              label="Анонс"
              color="primary"
              size="small"
              sx={{ ml: 1, verticalAlign: 'middle', fontWeight: 600 }}
            />
          </Box>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          У найближчі два тижні заплановано такі турніри. Щоб брати участь, увійдіть у свій акаунт або
          приєднайтесь до клубу.
        </Typography>
        <Stack spacing={2}>
          {items.map((t) => (
            <Box
              key={t.id}
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                {t.name}
              </Typography>
              {t.clubName ? (
                <Typography variant="caption" color="text.secondary" display="block">
                  Клуб: {t.clubName}
                </Typography>
              ) : null}
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {formatDateTimeUkVancouver(t.scheduledDate)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ігор у турнірі: {t.numGames}
              </Typography>
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Button component={RouterLink} to="/login" variant="contained" size="small">
          Увійти
        </Button>
        <Button component={RouterLink} to="/register" variant="outlined" size="small">
          Реєстрація
        </Button>
        <Button component={RouterLink} to="/clubs" variant="text" size="small">
          Клуби
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={handleClose} color="inherit" size="small">
          Закрити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
