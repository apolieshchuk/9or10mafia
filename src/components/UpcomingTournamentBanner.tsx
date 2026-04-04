import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { Link as RouterLink } from 'react-router-dom';
import axios from '../axios';

type UpcomingItem = {
  id: string;
  name: string;
  status?: string;
};

/**
 * Compact centered pill under AppAppBar on the home page; width fits content (not full header).
 */
export default function UpcomingTournamentBanner() {
  const [tournament, setTournament] = React.useState<UpcomingItem | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get<{ items: UpcomingItem[] }>('/public/upcoming-tournaments');
        const list = (data.items || []).filter(
          (x) => x.status !== 'in_progress' && x.status !== 'completed'
        );
        if (!cancelled && list.length > 0) {
          setTournament(list[0]);
        } else if (!cancelled) {
          setTournament(null);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!tournament) return null;

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={(t) => {
        const dark = t.palette.mode === 'dark';
        const primary = t.palette.primary.main;
        return {
          mt: 1,
          mb: 0.25,
          width: 'fit-content',
          maxWidth: 'min(100%, calc(100vw - 20px))',
          borderRadius: 999,
          px: 0,
          py: 0,
          border: dark
            ? `1px solid ${alpha('#93c5fd', 0.55)}`
            : `1px solid ${alpha(primary, 0.45)}`,
          background: dark
            ? `linear-gradient(125deg, ${alpha(primary, 0.55)} 0%, #1e40af 42%, #172554 100%)`
            : `linear-gradient(125deg, ${alpha(primary, 0.14)} 0%, ${alpha('#dbeafe', 0.95)} 55%, ${alpha('#eff6ff', 1)} 100%)`,
          backdropFilter: 'blur(10px)',
          boxShadow: dark
            ? `0 4px 22px ${alpha('#1e3a8a', 0.55)}, 0 0 0 1px ${alpha('#60a5fa', 0.12)} inset`
            : `0 4px 16px ${alpha(primary, 0.12)}`,
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
        }}
      >
        <EmojiEventsOutlinedIcon
          sx={(t) => ({
            fontSize: 18,
            flexShrink: 0,
            color: t.palette.mode === 'dark' ? '#e0f2fe' : t.palette.primary.dark,
          })}
        />
        <Typography
          component="span"
          variant="body2"
          sx={(t) => ({
            lineHeight: 1.35,
            minWidth: 0,
            color: t.palette.mode === 'dark' ? '#ffffff' : t.palette.text.primary,
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
              color: t.palette.mode === 'dark' ? '#e0e7ff' : alpha(t.palette.text.primary, 0.78),
            })}
          >
            — вже скоро!
          </Box>
        </Typography>
        <Link
          component={RouterLink}
          to={`/tournaments/${tournament.id}`}
          underline="always"
          variant="body2"
          sx={(t) => ({
            flexShrink: 0,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            textDecorationColor: t.palette.mode === 'dark' ? alpha('#fef08a', 0.85) : alpha(t.palette.primary.main, 0.55),
            color: t.palette.mode === 'dark' ? '#fef9c3' : t.palette.primary.dark,
            '&:hover': {
              color: t.palette.mode === 'dark' ? '#fffbeb' : t.palette.primary.main,
              textDecorationColor: t.palette.mode === 'dark' ? '#fff' : alpha(t.palette.primary.main, 0.8),
            },
          })}
        >
          Перейти
        </Link>
      </Stack>
    </Box>
  );
}
