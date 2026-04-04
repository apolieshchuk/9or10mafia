import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import AppTheme from './theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import Footer from './components/Footer';
import axios from './axios';
import { formatDateUkVancouver } from './utils/vancouverDate';

type PublicPlayer = { id: string; nickname: string; avatarUrl: string | null };
type PublicSlot = { seatIndex: number; players: PublicPlayer[] };

type PublicPayload = {
  id: string;
  name: string;
  numGames: number;
  scheduledDate: string | null;
  status: string;
  clubName: string;
  publicDescription: string;
  participantSlots: PublicSlot[];
};

const statusUa: Record<string, string> = {
  draft: 'Анонс',
  in_progress: 'Триває',
  completed: 'Завершено',
};

function PlayerCell({ players }: { players: PublicPlayer[] }) {
  if (!players.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    );
  }
  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2}>
      {players.map((p, i) => (
        <React.Fragment key={p.id}>
          {i > 0 ? (
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              /
            </Typography>
          ) : null}
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Avatar
              src={p.avatarUrl || undefined}
              alt={p.nickname}
              sx={{
                width: { xs: 56, sm: 80 },
                height: { xs: 56, sm: 80 },
                fontSize: '1.5rem',
                border: (t) => `3px solid ${alpha(t.palette.primary.main, 0.35)}`,
                boxShadow: 2,
              }}
            >
              {p.nickname.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6" component="span" fontWeight={600} sx={{ fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
              {p.nickname}
            </Typography>
          </Stack>
        </React.Fragment>
      ))}
    </Stack>
  );
}

export default function PublicTournamentPage(props: { disableCustomTheme?: boolean }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = React.useState<PublicPayload | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const { data: body } = await axios.get<PublicPayload>(`/public/tournament/${id}`);
        if (!cancelled) {
          setData(body);
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled) {
          setData(null);
          setError(e?.response?.status === 404 ? 'Турнір не знайдено або сторінка недоступна.' : 'Не вдалося завантажити.');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Box
        component="main"
        sx={{
          minHeight: '70vh',
          pt: { xs: 10, sm: 12 },
          pb: 6,
          px: 2,
        }}
      >
        <Container maxWidth="md">
          {error ? (
            <Stack spacing={2} alignItems="flex-start">
              <Typography color="error">{error}</Typography>
              <Button variant="outlined" onClick={() => navigate('/')}>
                На головну
              </Button>
            </Stack>
          ) : !data ? (
            <Typography>Завантаження…</Typography>
          ) : (
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="overline" color="text.secondary" letterSpacing={1}>
                  {data.clubName ? `Клуб: ${data.clubName}` : 'Турнір'}
                </Typography>
                <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem' }, fontWeight: 800 }}>
                  {data.name}
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
                  <Chip
                    label={statusUa[data.status] || data.status}
                    color={data.status === 'in_progress' ? 'success' : data.status === 'completed' ? 'default' : 'primary'}
                    size="small"
                  />
                  {data.scheduledDate ? (
                    <Typography variant="body1" color="text.secondary">
                      {formatDateUkVancouver(data.scheduledDate)}
                    </Typography>
                  ) : null}
                  <Typography variant="body2" color="text.secondary">
                    Ігор: {data.numGames}
                  </Typography>
                </Stack>
              </Stack>

              {data.publicDescription?.trim() ? (
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Про турнір
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.65 }}
                  >
                    {data.publicDescription.trim()}
                  </Typography>
                </Paper>
              ) : null}

              <Divider />

              <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                Учасники
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: -1.5 }}>
                Зареєстровані гравці та пари (один рядок — одне місце за столом).
              </Typography>

              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: (t) => `1px solid ${t.palette.divider}`,
                  overflow: 'hidden',
                  boxShadow: (t) => t.shadows[4],
                }}
              >
                <Table size="medium" sx={{ minWidth: 280 }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        background: (t) =>
                          `linear-gradient(90deg, ${alpha(t.palette.primary.main, 0.92)} 0%, ${alpha(t.palette.primary.dark, 0.88)} 100%)`,
                        '& .MuiTableCell-head': {
                          color: 'primary.contrastText',
                          fontWeight: 700,
                          fontSize: '1rem',
                          borderBottom: 'none',
                          py: 2,
                        },
                      }}
                    >
                      <TableCell width={72} align="center">
                        №
                      </TableCell>
                      <TableCell>Гравці</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.participantSlots.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ py: 6 }}>
                          <Typography color="text.secondary">Список учасників ще формується.</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.participantSlots.map((row, idx) => (
                        <TableRow
                          key={`${row.seatIndex}-${idx}`}
                          sx={{
                            '&:nth-of-type(even)': { bgcolor: (t) => alpha(t.palette.action.hover, 0.35) },
                            '&:last-child td': { borderBottom: 0 },
                          }}
                        >
                          <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                            <Typography variant="h6" fontWeight={700} color="primary">
                              {row.seatIndex}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: { xs: 2, sm: 2.5 }, verticalAlign: 'middle' }}>
                            <PlayerCell players={row.players} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ pt: 1 }}>
                <Button variant="outlined" onClick={() => navigate('/')}>
                  На головну
                </Button>
                <Button variant="text" onClick={() => navigate('/clubs')}>
                  Клуби
                </Button>
                <Button variant="text" onClick={() => navigate('/login')}>
                  Увійти
                </Button>
              </Stack>
            </Stack>
          )}
        </Container>
      </Box>
      <Footer />
    </AppTheme>
  );
}
