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
import type { Theme } from '@mui/material/styles';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AppTheme from './theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import Footer from './components/Footer';
import axios from './axios';
import { formatDateUkVancouver } from './utils/vancouverDate';
import { resolveMediaUrl } from './utils/mediaUrl';
import TournamentSeatingTiles from './components/TournamentSeatingTiles';
import { useAuth } from './AuthProvider';

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
  clubId: string | null;
  nextGameIndex: number | null;
  clubName: string;
  clubAvatarUrl: string | null;
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

function RemoteAvatar({
  avatarUrl,
  nickname,
  sx,
}: {
  avatarUrl: string | null | undefined;
  nickname: string;
  sx?: React.ComponentProps<typeof Avatar>['sx'];
}) {
  const [failed, setFailed] = React.useState(false);
  const src = !failed ? resolveMediaUrl(avatarUrl ?? null) : undefined;
  const initial = nickname.trim().charAt(0).toUpperCase() || '?';
  return (
    <Avatar src={src || undefined} alt={nickname} onError={() => setFailed(true)} sx={sx}>
      {initial}
    </Avatar>
  );
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
            <RemoteAvatar
              avatarUrl={p.avatarUrl}
              nickname={p.nickname}
              sx={{
                width: 44,
                height: 44,
                fontSize: '1rem',
                flexShrink: 0,
                border: (t) => `2px solid ${alpha(t.palette.primary.main, 0.4)}`,
              }}
            />
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

const participantsHeadSx = {
  background: (t: Theme) =>
    `linear-gradient(90deg, ${alpha(t.palette.primary.main, 0.88)} 0%, ${alpha(t.palette.primary.dark, 0.82)} 100%)`,
  '& .MuiTableCell-head': {
    color: 'primary.contrastText',
    fontWeight: 700,
    fontSize: '0.8125rem',
    borderBottom: 'none',
    py: 1.1,
    px: { xs: 0.75, sm: 1.25 },
  },
};

function PublicParticipantsTable({ slots }: { slots: PublicSlot[] }) {
  const half = Math.ceil(slots.length / 2);
  const leftCol = slots.slice(0, half);
  const rightCol = slots.slice(half);
  const rowCount = leftCol.length;

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 2,
        border: (t) => `1px solid ${t.palette.divider}`,
        boxShadow: (t) => t.shadows[2],
        width: '100%',
        overflowX: 'auto',
      }}
    >
      <Table
        size="medium"
        sx={{
          width: '100%',
          minWidth: { xs: 520, sm: 640 },
          tableLayout: 'fixed',
          '& .MuiTableCell-body': {
            py: 1.35,
            px: { xs: 0.75, sm: 1.25 },
            verticalAlign: 'middle',
          },
        }}
      >
        <TableHead>
          <TableRow sx={participantsHeadSx}>
            <TableCell align="center" sx={{ width: 52 }}>
              №
            </TableCell>
            <TableCell sx={{ width: '42%' }}>Гравці</TableCell>
            <TableCell
              align="center"
              sx={{
                width: 52,
                borderLeft: (t) => `1px solid ${alpha(t.palette.primary.contrastText, 0.22)}`,
              }}
            >
              №
            </TableCell>
            <TableCell sx={{ width: '42%' }}>Гравці</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rowCount }, (_, i) => {
            const L = leftCol[i];
            const R = rightCol[i];
            return (
              <TableRow
                key={`${L.seatIndex}-${R?.seatIndex ?? i}`}
                sx={{
                  '&:nth-of-type(even)': { bgcolor: (t) => alpha(t.palette.action.hover, 0.2) },
                  '&:last-child td': { borderBottom: 0 },
                }}
              >
                <TableCell align="center">
                  <Typography variant="body1" fontWeight={700} color="primary">
                    {L.seatIndex}
                  </Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 0 }}>
                  <PlayerCell players={L.players} />
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    borderLeft: (t) => `1px solid ${alpha(t.palette.divider, 0.85)}`,
                  }}
                >
                  {R ? (
                    <Typography variant="body1" fontWeight={700} color="primary">
                      {R.seatIndex}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.disabled">
                      —
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ minWidth: 0 }}>
                  <PlayerCell players={R?.players ?? []} />
                </TableCell>
              </TableRow>
            );
          })}
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
        <RemoteAvatar
          avatarUrl={params.row.avatarUrl}
          nickname={params.row.nickname || ''}
          sx={{ width: 28, height: 28, fontSize: 12 }}
        />
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
  const { user } = useAuth();
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
            clubId: body.clubId ?? null,
            nextGameIndex: body.nextGameIndex ?? null,
            clubAvatarUrl: body.clubAvatarUrl ?? null,
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

  const isClubOwnerPublic = React.useMemo(() => {
    if (user?.authType !== 'Клуб' || !data?.clubId || user._id == null) return false;
    return String(user._id) === String(data.clubId);
  }, [user, data?.clubId]);

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
              <Stack spacing={0.75}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={2}
                  flexWrap="wrap"
                  sx={{ rowGap: 1.25, columnGap: 2 }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1.25}
                    sx={{ flex: '1 1 200px', minWidth: 0 }}
                  >
                    <Typography
                      variant="h5"
                      component="h1"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: '1.15rem', sm: '1.35rem' },
                        lineHeight: 1.3,
                        minWidth: 0,
                      }}
                    >
                      {data.name}
                    </Typography>
                    {isClubOwnerPublic &&
                      data.status === 'in_progress' &&
                      data.nextGameIndex != null &&
                      id && (
                        <Button
                          component={Link}
                          to={`/profile/tournament/${id}/game/${data.nextGameIndex}`}
                          variant="outlined"
                          color="secondary"
                          size="small"
                          sx={{
                            py: 0.25,
                            px: 1,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            minWidth: 'auto',
                            flexShrink: 0,
                            lineHeight: 1.5,
                          }}
                        >
                          Діюча гра
                        </Button>
                      )}
                  </Stack>
                  {data.clubName ? (
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={1.25}
                      sx={{
                        flexShrink: 0,
                        ml: { xs: 0, sm: 'auto' },
                        maxWidth: { xs: '100%', sm: 340 },
                      }}
                    >
                      <RemoteAvatar
                        avatarUrl={data.clubAvatarUrl}
                        nickname={data.clubName}
                        sx={{
                          width: 52,
                          height: 52,
                          fontSize: '1.2rem',
                          flexShrink: 0,
                          border: (t) => `2px solid ${alpha(t.palette.primary.main, 0.35)}`,
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          letterSpacing: 0.4,
                          lineHeight: 1.35,
                          textAlign: { xs: 'left', sm: 'right' },
                        }}
                      >
                        Клуб: {data.clubName}
                      </Typography>
                    </Stack>
                  ) : null}
                </Stack>
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
                    <PublicParticipantsTable slots={data.participantSlots} />
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
                    <TournamentSeatingTiles
                      numGames={data.numGames}
                      seatingByGame={data.seatingByGame}
                      formatSeat={(userIds) => formatSeatingCell(userIds, nickLookup)}
                      title="Розсадка"
                    />
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
