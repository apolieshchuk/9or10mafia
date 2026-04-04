import * as React from 'react';
import type {} from '@mui/x-data-grid/themeAugmentation';
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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { alpha } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AppTheme from './theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import Footer from './components/Footer';
import axios from './axios';
import { formatDateUkVancouver } from './utils/vancouverDate';

type PublicPlayer = { id: string; nickname: string; avatarUrl: string | null };
type PublicSlot = { seatIndex: number; players: PublicPlayer[] };

type SeatingByGame = Record<string, Record<string, { userIds: string[] }>>;

type PublicStandingRow = {
  rank: number;
  userId: string;
  nickname: string;
  avatarUrl: string | null;
  pointsSum: number;
  supportFiveSum: number;
  bonusSum: number;
  total: number;
  gamesPlayed: number;
};

type PublicPayload = {
  id: string;
  name: string;
  numGames: number;
  scheduledDate: string | null;
  status: string;
  clubName: string;
  publicDescription: string;
  participantSlots: PublicSlot[];
  seatingByGame: SeatingByGame | null;
  standingsRows: PublicStandingRow[];
};

const statusUa: Record<string, string> = {
  draft: 'Анонс',
  in_progress: 'Триває',
  completed: 'Завершено',
};

function nickMapFromData(data: PublicPayload | null) {
  const m = new Map<string, string>();
  if (!data) return m;
  for (const row of data.participantSlots) {
    for (const p of row.players) m.set(p.id, p.nickname);
  }
  for (const r of data.standingsRows) {
    if (!m.has(r.userId)) m.set(r.userId, r.nickname);
  }
  return m;
}

function formatSeatingCell(userIds: string[] | undefined, nick: Map<string, string>) {
  if (!userIds?.length) return '—';
  return userIds.map((id) => nick.get(id) || `…${id.slice(-4)}`).join(' / ');
}

function PlayerCell({ players }: { players: PublicPlayer[] }) {
  if (!players.length) {
    return (
      <Typography variant="caption" color="text.secondary">
        —
      </Typography>
    );
  }
  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap" gap={0.75} sx={{ rowGap: 0.5 }}>
      {players.map((p, i) => (
        <React.Fragment key={p.id}>
          {i > 0 ? (
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, px: 0.25 }}>
              /
            </Typography>
          ) : null}
          <Stack direction="row" alignItems="center" gap={0.75} sx={{ minWidth: 0 }}>
            <Avatar
              src={p.avatarUrl || undefined}
              alt={p.nickname}
              sx={{
                width: 44,
                height: 44,
                fontSize: '1rem',
                flexShrink: 0,
                border: (t) => `2px solid ${alpha(t.palette.primary.main, 0.4)}`,
              }}
            >
              {p.nickname.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              variant="body1"
              component="span"
              fontWeight={600}
              sx={{
                lineHeight: 1.35,
                fontSize: { xs: '0.95rem', sm: '1rem' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {p.nickname}
            </Typography>
          </Stack>
        </React.Fragment>
      ))}
    </Stack>
  );
}

function PublicParticipantsChunk({ rows }: { rows: PublicSlot[] }) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 2,
        border: (t) => `1px solid ${t.palette.divider}`,
        boxShadow: (t) => t.shadows[2],
        width: '100%',
      }}
    >
      <Table
        size="medium"
        sx={{
          width: '100%',
          '& .MuiTableCell-body': { py: 1.35, px: 1.25, verticalAlign: 'middle' },
        }}
      >
        <TableHead>
          <TableRow
            sx={{
              background: (t) =>
                `linear-gradient(90deg, ${alpha(t.palette.primary.main, 0.88)} 0%, ${alpha(t.palette.primary.dark, 0.82)} 100%)`,
              '& .MuiTableCell-head': {
                color: 'primary.contrastText',
                fontWeight: 700,
                fontSize: '0.8125rem',
                borderBottom: 'none',
                py: 1.1,
                px: 1.25,
              },
            }}
          >
            <TableCell width={52} align="center">
              №
            </TableCell>
            <TableCell>Гравці</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.seatIndex}
              sx={{
                '&:nth-of-type(even)': { bgcolor: (t) => alpha(t.palette.action.hover, 0.2) },
                '&:last-child td': { borderBottom: 0 },
              }}
            >
              <TableCell align="center">
                <Typography variant="body1" fontWeight={700} color="primary">
                  {row.seatIndex}
                </Typography>
              </TableCell>
              <TableCell>
                <PlayerCell players={row.players} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const standingsColumns: GridColDef<PublicStandingRow>[] = [
  { field: 'rank', headerName: '№', width: 52, align: 'center', headerAlign: 'center' },
  {
    field: 'nickname',
    headerName: 'Гравець',
    flex: 1.2,
    minWidth: 160,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
        <Avatar src={params.row.avatarUrl || undefined} sx={{ width: 28, height: 28, fontSize: 12 }}>
          {params.row.nickname?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography variant="body2" noWrap fontWeight={600}>
          {params.row.nickname}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'pointsSum',
    headerName: 'Бали гри',
    type: 'number',
    width: 88,
    headerAlign: 'right',
    align: 'right',
  },
  {
    field: 'supportFiveSum',
    headerName: 'ОП5',
    type: 'number',
    width: 72,
    headerAlign: 'right',
    align: 'right',
  },
  {
    field: 'bonusSum',
    headerName: 'ДБ',
    type: 'number',
    width: 64,
    headerAlign: 'right',
    align: 'right',
  },
  {
    field: 'total',
    headerName: 'Всього',
    type: 'number',
    width: 78,
    headerAlign: 'right',
    align: 'right',
  },
  {
    field: 'gamesPlayed',
    headerName: 'Ігор',
    type: 'number',
    width: 64,
    headerAlign: 'right',
    align: 'right',
  },
];

export default function PublicTournamentPage(props: { disableCustomTheme?: boolean }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = React.useState<PublicPayload | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState(0);

  React.useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const { data: body } = await axios.get<PublicPayload>(`/public/tournament/${id}`);
        if (!cancelled) {
          setData({
            ...body,
            seatingByGame: body.seatingByGame ?? null,
            standingsRows: body.standingsRows ?? [],
          });
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

  const nickLookup = React.useMemo(() => nickMapFromData(data), [data]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Box
        component="main"
        sx={{
          minHeight: '60vh',
          pt: { xs: 10, sm: 12 },
          pb: 4,
          px: { xs: 1.5, sm: 2 },
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
          {error ? (
            <Stack spacing={2} alignItems="flex-start">
              <Typography color="error">{error}</Typography>
              <Button variant="outlined" onClick={() => navigate('/')}>
                На головну
              </Button>
            </Stack>
          ) : !data ? (
            <Typography variant="body2">Завантаження…</Typography>
          ) : (
            <Stack spacing={1.5}>
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.4 }}>
                  {data.clubName ? `Клуб: ${data.clubName}` : 'Турнір'}
                </Typography>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 800, fontSize: { xs: '1.15rem', sm: '1.35rem' }, lineHeight: 1.3 }}>
                  {data.name}
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={0.75} alignItems="center">
                  <Chip
                    label={statusUa[data.status] || data.status}
                    color={data.status === 'in_progress' ? 'success' : data.status === 'completed' ? 'default' : 'primary'}
                    size="small"
                    sx={{ height: 24, '& .MuiChip-label': { px: 1, typography: 'caption' } }}
                  />
                  {data.scheduledDate ? (
                    <Typography variant="caption" color="text.secondary">
                      {formatDateUkVancouver(data.scheduledDate)}
                    </Typography>
                  ) : null}
                  <Typography variant="caption" color="text.secondary">
                    Ігор: {data.numGames}
                  </Typography>
                </Stack>
              </Stack>

              {data.publicDescription?.trim() ? (
                <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                    Про турнір
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>
                    {data.publicDescription.trim()}
                  </Typography>
                </Paper>
              ) : null}

              <Divider sx={{ my: 0.5 }} />

              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  minHeight: 40,
                  '& .MuiTab-root': { minHeight: 40, py: 0.5, typography: 'body2', fontWeight: 600 },
                }}
              >
                <Tab label="Учасники" />
                <Tab label="Розсадка" />
                <Tab label="Таблиця результатів" />
              </Tabs>

              {tab === 0 && (
                <Box sx={{ pt: 1 }}>
                  {data.participantSlots.length === 0 ? (
                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{
                        borderRadius: 2,
                        border: (t) => `1px solid ${t.palette.divider}`,
                        boxShadow: (t) => t.shadows[2],
                        width: '100%',
                      }}
                    >
                      <Table size="medium">
                        <TableBody>
                          <TableRow>
                            <TableCell align="center" sx={{ py: 4 }}>
                              <Typography variant="body2" color="text.secondary">
                                Список учасників ще формується.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: 2,
                        width: '100%',
                        alignItems: 'start',
                      }}
                    >
                      <PublicParticipantsChunk
                        rows={data.participantSlots.slice(0, Math.ceil(data.participantSlots.length / 2))}
                      />
                      <PublicParticipantsChunk
                        rows={data.participantSlots.slice(Math.ceil(data.participantSlots.length / 2))}
                      />
                    </Box>
                  )}
                </Box>
              )}

              {tab === 1 && (
                <Box sx={{ pt: 1 }}>
                  {!data.seatingByGame ? (
                    <Typography variant="body2" color="text.secondary">
                      Розсадку ще не згенеровано.
                    </Typography>
                  ) : (
                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{
                        borderRadius: 2,
                        border: (t) => `1px solid ${t.palette.divider}`,
                        boxShadow: (t) => t.shadows[2],
                        overflowX: 'auto',
                        width: '100%',
                      }}
                    >
                      <Table size="small" sx={{ minWidth: 640 }}>
                        <TableHead>
                          <TableRow
                            sx={{
                              background: (t) =>
                                `linear-gradient(90deg, ${alpha(t.palette.primary.main, 0.88)} 0%, ${alpha(t.palette.primary.dark, 0.82)} 100%)`,
                              '& .MuiTableCell-head': {
                                color: 'primary.contrastText',
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                borderBottom: 'none',
                                py: 0.65,
                                px: 0.5,
                              },
                            }}
                          >
                            <TableCell width={36}>Гра</TableCell>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                              <TableCell key={s} align="center" sx={{ minWidth: 72 }}>
                                {s}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Array.from({ length: data.numGames }, (_, gi) => gi + 1).map((g) => (
                            <TableRow
                              key={g}
                              sx={{
                                '&:nth-of-type(even)': { bgcolor: (t) => alpha(t.palette.action.hover, 0.2) },
                              }}
                            >
                              <TableCell sx={{ fontWeight: 700 }}>{g}</TableCell>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                                <TableCell key={s} align="center" sx={{ fontSize: '0.7rem', maxWidth: 120, py: 0.5, px: 0.5 }}>
                                  {formatSeatingCell(data.seatingByGame?.[String(g)]?.[String(s)]?.userIds, nickLookup)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              )}

              {tab === 2 && (
                <Box sx={{ pt: 1, width: '100%' }}>
                  {data.standingsRows.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Таблиця результатів з’явиться після збережених ігор турніру.
                    </Typography>
                  ) : (
                    <DataGrid
                      rows={data.standingsRows}
                      columns={standingsColumns}
                      getRowId={(r) => r.userId}
                      disableColumnMenu
                      disableColumnResize
                      disableColumnSorting
                      density="compact"
                      initialState={{
                        pagination: { paginationModel: { pageSize: 15 } },
                      }}
                      pageSizeOptions={[15]}
                      getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                      }
                      sx={{
                        border: (t) => `1px solid ${t.palette.divider}`,
                        borderRadius: 2,
                        '& .MuiDataGrid-columnHeaders': {
                          background: (t) =>
                            `linear-gradient(90deg, ${alpha(t.palette.primary.main, 0.88)} 0%, ${alpha(t.palette.primary.dark, 0.82)} 100%)`,
                        },
                        '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700, fontSize: '0.75rem' },
                      }}
                    />
                  )}
                </Box>
              )}
            </Stack>
          )}
        </Container>
      </Box>
      <Footer />
    </AppTheme>
  );
}
