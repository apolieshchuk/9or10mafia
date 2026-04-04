import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { Link as RouterLink } from 'react-router-dom';
import axios from '../axios';

const SESSION_KEY = 'upcoming_tournament_bar_v3';

type UpcomingItem = {
  id: string;
  name: string;
};

/**
 * Compact centered pill under AppAppBar; width fits content (not full header).
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

  if (!open || !tournament) return null;

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={(t) => {
        const dark = t.palette.mode === 'dark';
        return {
          mt: 1,
          mb: 0.25,
          width: 'fit-content',
          maxWidth: 'min(100%, calc(100vw - 20px))',
          borderRadius: 999,
          px: 0,
          py: 0,
          border: dark
            ? `1px solid ${alpha('#e2e8f0', 0.22)}`
            : `1px solid ${alpha(t.palette.primary.main, 0.28)}`,
          backgroundColor: dark ? alpha('#020617', 0.78) : alpha(t.palette.grey[50], 0.95),
          backdropFilter: 'blur(12px)',
          boxShadow: dark
            ? `0 4px 20px ${alpha('#000', 0.45)}, inset 0 1px 0 ${alpha('#fff', 0.06)}`
            : `0 4px 16px ${alpha('#000', 0.08)}`,
        };
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          flexWrap: 'wrap',
          px: { xs: 1.25, sm: 1.5 },
          py: { xs: 0.65, sm: 0.6 },
          pr: { xs: 0.5, sm: 0.75 },
        }}
      >
        <EmojiEventsOutlinedIcon
          sx={(t) => ({
            fontSize: 18,
            flexShrink: 0,
            color: t.palette.mode === 'dark' ? alpha('#f1f5f9', 0.88) : t.palette.primary.dark,
          })}
        />
        <Typography
          component="span"
          variant="body2"
          sx={(t) => ({
            lineHeight: 1.35,
            minWidth: 0,
            color: t.palette.mode === 'dark' ? alpha('#f8fafc', 0.96) : t.palette.text.primary,
            fontWeight: 600,
          })}
        >
          <Box component="span" sx={{ fontWeight: 800 }}>
            {tournament.name}
          </Box>{' '}
          <Box
            component="span"
            sx={(t) => ({
              fontWeight: 500,
              color: t.palette.mode === 'dark' ? alpha('#cbd5e1', 0.95) : alpha(t.palette.text.primary, 0.75),
            })}
          >
            — вже скоро!
          </Box>
        </Typography>
        <Link
          component={RouterLink}
          to={`/tournaments/${tournament.id}`}
          onClick={dismiss}
          underline="hover"
          variant="body2"
          sx={(t) => ({
            flexShrink: 0,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            color: t.palette.mode === 'dark' ? '#7dd3fc' : t.palette.primary.main,
            '&:hover': {
              color: t.palette.mode === 'dark' ? '#bae6fd' : t.palette.primary.dark,
            },
          })}
        >
          Перейти
        </Link>
        <IconButton
          size="small"
          aria-label="Закрити оголошення"
          onClick={dismiss}
          sx={(t) => ({
            p: 0.35,
            ml: { xs: 'auto', sm: 0 },
            color: t.palette.mode === 'dark' ? alpha('#94a3b8', 0.95) : t.palette.text.secondary,
            '&:hover': {
              bgcolor: alpha(t.palette.common.white, t.palette.mode === 'dark' ? 0.08 : 0.06),
              color: t.palette.mode === 'dark' ? '#e2e8f0' : t.palette.text.primary,
            },
          })}
        >
          <CloseRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Stack>
    </Box>
  );
}
