import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '../components/dashboard/AppNavbar';
import SideMenu from '../components/dashboard/SideMenu';
import AppTheme from '../theme/AppTheme';
import { chartsCustomizations } from '../theme/customizations/charts';
import { dataGridCustomizations } from '../theme/customizations/dataGrid';
import { datePickersCustomizations } from '../theme/customizations/datePickers';
import { treeViewCustomizations } from '../theme/customizations/treeView';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Copyright } from '../components/Footer';
import axios from '../axios';
import { useAuth } from '../AuthProvider';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Autocomplete from '@mui/material/Autocomplete';
import { toPng } from 'html-to-image';
import { dateInputValueFromApi } from '../utils/vancouverDate';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const statusUa: Record<string, string> = {
  draft: 'Чернетка',
  in_progress: 'Йде',
  completed: 'Завершено',
};

type ClubUser = { _id: string; nickname?: string; name?: string; email?: string };

function shuffleInPlace<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** participants: { userIds: string[] }[] length 10, each 1 or 2 ids */
export function generateSeatingByGame(
  participants: { userIds: string[] }[],
  numGames: number
): Record<string, Record<string, { userIds: string[] }>> {
  const slots = participants.map((p) => ({ userIds: [...p.userIds] }));
  const out: Record<string, Record<string, { userIds: string[] }>> = {};
  for (let g = 1; g <= numGames; g++) {
    const shuffled = shuffleInPlace([...slots]);
    const gameSeats: Record<string, { userIds: string[] }> = {};
    for (let s = 1; s <= 10; s++) {
      gameSeats[String(s)] = { userIds: [...shuffled[s - 1].userIds] };
    }
    out[String(g)] = gameSeats;
  }
  return out;
}

export default function DashboardTournamentDetail(props: { disableCustomTheme?: boolean }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const seatingRef = React.useRef<HTMLDivElement>(null);

  const [tournament, setTournament] = React.useState<any>(null);
  const [games, setGames] = React.useState<any[]>([]);
  const [standings, setStandings] = React.useState<any[]>([]);
  const [clubUsers, setClubUsers] = React.useState<ClubUser[]>([]);

  const [name, setName] = React.useState('');
  const [numGames, setNumGames] = React.useState(1);
  const [scheduledDate, setScheduledDate] = React.useState('');
  const [publicDescription, setPublicDescription] = React.useState('');
  const [hideHalf, setHideHalf] = React.useState(false);
  const [participantRows, setParticipantRows] = React.useState<{ u1: ClubUser | null; u2: ClubUser | null }[]>([]);

  const isClub = user?.authType === 'Клуб';
  const clubIdStr = user?._id != null ? String((user as any)._id) : '';

  const refresh = React.useCallback(async () => {
    if (!id) return;
    const [{ data: t }, { data: g }, { data: s }] = await Promise.all([
      axios.get(`/tournament/${id}`),
      axios.get(`/tournament/${id}/games`),
      axios.get(`/tournament/${id}/standings`),
    ]);
    setTournament(t);
    setGames(g.items || []);
    setStandings((s.items || []).map((row: any, i: number) => ({ ...row, id: row.userId || i })));
    setName(t.name || '');
    setNumGames(t.numGames || 1);
    setScheduledDate(dateInputValueFromApi(t.scheduledDate));
    setPublicDescription(t.publicDescription != null ? String(t.publicDescription) : '');
    setHideHalf(Boolean(t.hideResultsAfterHalf));
  }, [id]);

  React.useEffect(() => {
    if (!isClub) return;
    (async () => {
      try {
        const { data } = await axios.get('/club/users');
        setClubUsers(data.items || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [isClub]);

  React.useEffect(() => {
    if (!id) return;
    refresh().catch((e) => {
      console.error(e);
      navigate('/profile/tournaments');
    });
  }, [id, refresh, navigate]);

  React.useEffect(() => {
    if (!tournament) return;
    const parts = tournament.participants || [];
    setParticipantRows(
      parts.map((p: any) => {
        const ids = (p.userIds || []).map(String);
        const u1 = ids[0]
          ? clubUsers.find((u) => String(u._id) === ids[0]) || { _id: ids[0], nickname: ids[0] }
          : null;
        const u2 = ids[1]
          ? clubUsers.find((u) => String(u._id) === ids[1]) || { _id: ids[1], nickname: ids[1] }
          : null;
        return { u1, u2 };
      })
    );
  }, [tournament, clubUsers]);

  const nick = (u: ClubUser | null) => u?.nickname || u?.name || u?.email || '';

  const seatingLabel = (cell: { userIds: string[] } | undefined) => {
    if (!cell?.userIds?.length) return '—';
    return cell.userIds
      .map((uid) => nick(clubUsers.find((u) => u._id === uid) || { _id: uid, nickname: uid }))
      .join(' / ');
  };

  const saveSettings = async () => {
    if (!id || !isClub) return;
    const participants = participantRows
      .filter((r) => r.u1)
      .map((r) => ({
        userIds: [r.u1!._id, ...(r.u2 ? [r.u2._id] : [])],
      }));
    try {
      await axios.put(`/club/tournament/${id}`, {
        name,
        numGames: Number(numGames),
        scheduledDate: scheduledDate || null,
        publicDescription: publicDescription.trim(),
        hideResultsAfterHalf: hideHalf,
        participants,
      });
      await refresh();
      alert('Збережено');
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Помилка');
    }
  };

  const startTournament = async () => {
    if (!id || !isClub) return;
    try {
      await axios.post(`/club/tournament/${id}/start`);
      await refresh();
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Помилка');
    }
  };

  const completeTournament = async () => {
    if (!id || !isClub) return;
    if (!confirm('Завершити турнір?')) return;
    try {
      await axios.post(`/club/tournament/${id}/complete`);
      await refresh();
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Помилка');
    }
  };

  const onGenerateSeating = async () => {
    if (!id || !isClub || !tournament) return;
    if (participantRows.filter((r) => r.u1).length !== 10) {
      alert('Для розсадки потрібно рівно 10 команд/учасників (заповніть усі рядки).');
      return;
    }
    const participants = participantRows
      .filter((r) => r.u1)
      .map((r) => ({
        userIds: [r.u1!._id, ...(r.u2 ? [r.u2._id] : [])],
      }));
    const seatingByGame = generateSeatingByGame(participants, tournament.numGames);
    try {
      await axios.put(`/club/tournament/${id}/seating`, { seatingByGame });
      await refresh();
      alert('Розсадку згенеровано та збережено');
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Помилка');
    }
  };

  const downloadSeatingPng = async () => {
    const el = seatingRef.current;
    if (!el) return;
    try {
      const dataUrl = await toPng(el, { pixelRatio: 2, backgroundColor: '#ffffff' });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `seating-${id}.png`;
      a.click();
    } catch (e) {
      console.error(e);
      alert('Не вдалося зробити скріншот');
    }
  };

  const addParticipantRow = () => {
    if (participantRows.length >= 10) return;
    setParticipantRows([...participantRows, { u1: null, u2: null }]);
  };

  const removeParticipantRow = (i: number) => {
    setParticipantRows(participantRows.filter((_, j) => j !== i));
  };

  const setRowUser = (i: number, slot: 1 | 2, u: ClubUser | null) => {
    const next = [...participantRows];
    if (!next[i]) next[i] = { u1: null, u2: null };
    if (slot === 1) next[i] = { ...next[i], u1: u };
    else next[i] = { ...next[i], u2: u };
    setParticipantRows(next);
  };

  const standingsColumns: GridColDef[] = [
    { field: 'rank', headerName: '№', width: 50 },
    { field: 'nickname', headerName: 'Нік', flex: 1, minWidth: 120 },
    { field: 'pointsSum', headerName: 'Бали гри', width: 90 },
    { field: 'supportFiveSum', headerName: 'ОП5', width: 80 },
    { field: 'bonusSum', headerName: 'ДБ', width: 70 },
    { field: 'total', headerName: 'Всього', width: 80 },
    { field: 'gamesPlayed', headerName: 'Ігор', width: 70 },
  ];

  const isClubOwner = isClub && tournament?.clubId === clubIdStr;
  const canEdit = isClubOwner && tournament?.status !== 'completed';
  const allGamesSaved = tournament && tournament.gamesSaved >= tournament.numGames;

  if (!tournament && id) {
    return (
      <AppTheme {...props} themeComponents={xThemeComponents}>
        <CssBaseline />
        <Typography sx={{ p: 3 }}>Завантаження…</Typography>
      </AppTheme>
    );
  }

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack spacing={2} sx={{ alignItems: 'center', mx: 3, pb: 5, mt: { xs: 8, md: 0 } }}>
            <Box sx={{ width: '100%', maxWidth: 1000, mt: '2rem' }}>
              <Button size="small" onClick={() => navigate('/profile/tournaments')} sx={{ mb: 1 }}>
                ← До списку
              </Button>
              <Typography component="h1" variant="h5">
                {tournament?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Статус: {statusUa[tournament?.status] || tournament?.status} · Ігор: {tournament?.numGames} ·
                Зіграно: {tournament?.gamesSaved ?? 0}
                {tournament?.winnerNickname ? ` · Переможець: ${tournament.winnerNickname}` : ''}
              </Typography>

              {canEdit && (
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Налаштування
                  </Typography>
                  <Stack spacing={2}>
                    <TextField label="Назва" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                    <TextField
                      label="Кількість ігор"
                      type="number"
                      inputProps={{ min: 1 }}
                      value={numGames}
                      onChange={(e) => setNumGames(Number(e.target.value))}
                      fullWidth
                    />
                    <TextField
                      label="Дата"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Публічний опис"
                      value={publicDescription}
                      onChange={(e) => setPublicDescription(e.target.value)}
                      fullWidth
                      multiline
                      minRows={3}
                      helperText={id ? `Публічна сторінка: /tournaments/${id}` : 'Публічна сторінка турніру'}
                      InputLabelProps={{ shrink: Boolean(publicDescription) }}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={hideHalf} onChange={(e) => setHideHalf(e.target.checked)} />}
                      label="Приховувати результати після 50% до завершення турніру"
                    />
                    <Typography variant="subtitle2">Учасники (до 10; для розсадки потрібно 10)</Typography>
                    {participantRows.map((row, i) => (
                      <Stack key={i} direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Autocomplete
                          sx={{ minWidth: 200, flex: 1 }}
                          options={clubUsers}
                          getOptionLabel={(o) => nick(o)}
                          value={row.u1}
                          onChange={(_, v) => setRowUser(i, 1, v)}
                          renderInput={(params) => <TextField {...params} label={`Гравець 1 (${i + 1})`} />}
                        />
                        <Autocomplete
                          sx={{ minWidth: 200, flex: 1 }}
                          options={clubUsers}
                          getOptionLabel={(o) => nick(o)}
                          value={row.u2}
                          onChange={(_, v) => setRowUser(i, 2, v)}
                          renderInput={(params) => <TextField {...params} label="Партнер (опц.)" />}
                        />
                        <IconButton aria-label="delete" onClick={() => removeParticipantRow(i)}>
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    ))}
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Button startIcon={<AddIcon />} onClick={addParticipantRow} disabled={participantRows.length >= 10}>
                        Додати учасника
                      </Button>
                      <Button variant="contained" onClick={saveSettings}>
                        Зберегти налаштування
                      </Button>
                      {tournament?.status === 'draft' && (
                        <Button variant="outlined" color="success" onClick={startTournament}>
                          Почати турнір
                        </Button>
                      )}
                      {tournament?.status === 'in_progress' && allGamesSaved && (
                        <Button variant="contained" color="secondary" onClick={completeTournament}>
                          Завершити турнір
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </Paper>
              )}

              {isClubOwner && tournament?.status === 'in_progress' && (
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                    <Button variant="outlined" onClick={onGenerateSeating}>
                      Згенерувати розсадку
                    </Button>
                    <Button variant="outlined" onClick={downloadSeatingPng} disabled={!tournament?.seatingByGame}>
                      Завантажити скріншот розсадки
                    </Button>
                    {tournament?.nextGameIndex != null && (
                      <Button
                        component={Link}
                        to={`/profile/tournament/${id}/game/${tournament.nextGameIndex}`}
                        variant="contained"
                      >
                        Відкрити поточну гру ({tournament.nextGameIndex})
                      </Button>
                    )}
                  </Stack>
                </Paper>
              )}

              {tournament?.seatingByGame && (
                <Paper sx={{ p: 2, mb: 2 }} ref={seatingRef}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Розсадка
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Гра</TableCell>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                          <TableCell key={s} align="center">
                            {s}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.from({ length: tournament.numGames }, (_, gi) => gi + 1).map((g) => (
                        <TableRow key={g}>
                          <TableCell>{g}</TableCell>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                            <TableCell key={s} align="center" sx={{ fontSize: '0.75rem', maxWidth: 100 }}>
                              {seatingLabel(tournament.seatingByGame[String(g)]?.[String(s)])}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              )}

              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Ігри
              </Typography>
              <Stack spacing={1} sx={{ mb: 2 }}>
                {Array.from({ length: tournament?.numGames || 0 }, (_, i) => i + 1).map((k) => {
                  const g = games.find((x) => x.gameIndex === k);
                  const saved = Boolean(g && !g.hidden);
                  const hidden = g?.hidden;
                  const canPlay =
                    tournament?.status === 'in_progress' &&
                    isClubOwner &&
                    tournament?.nextGameIndex === k;
                  return (
                    <Stack key={k} direction="row" alignItems="center" spacing={1}>
                      <Typography sx={{ width: 80 }}>Гра {k}</Typography>
                      {hidden ? (
                        <Typography color="text.secondary" sx={{ filter: 'blur(4px)', userSelect: 'none' }}>
                          Приховано
                        </Typography>
                      ) : saved ? (
                        <Button component={Link} size="small" to={`/profile/tournament/${id}/game/${k}`}>
                          Переглянути
                        </Button>
                      ) : canPlay ? (
                        <Button component={Link} size="small" variant="contained" to={`/profile/tournament/${id}/game/${k}`}>
                          Грати
                        </Button>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {isClubOwner
                            ? 'Заблоковано (спочатку збережіть попередню гру)'
                            : 'Ще не зіграно'}
                        </Typography>
                      )}
                    </Stack>
                  );
                })}
              </Stack>

              <Typography variant="h6" sx={{ mb: 1 }}>
                Рейтинг турніру
              </Typography>
              <Box sx={{ height: 360, width: '100%', mb: 2 }}>
                <DataGrid rows={standings} columns={standingsColumns} density="compact" disableRowSelectionOnClick />
              </Box>

              <Copyright />
            </Box>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
