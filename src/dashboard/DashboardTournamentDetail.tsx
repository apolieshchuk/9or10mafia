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
import TournamentSeatingTiles from '../components/TournamentSeatingTiles';
import DeleteIcon from '@mui/icons-material/Delete';
import { OutlinedActionIconButton } from '../components/OutlinedActionIconButton';
import AddIcon from '@mui/icons-material/Add';
import Autocomplete from '@mui/material/Autocomplete';
import { dateInputValueFromApi } from '../utils/vancouverDate';
import { downloadSeatingAsPng } from '../utils/seatingPngExport';
import { DEFAULT_TOURNAMENT_YOUTUBE_URL } from '../constants/youtube';

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

function tournamentToSettingsSnapshot(t: any) {
  return JSON.stringify({
    name: t.name || '',
    numGames: Number(t.numGames) || 1,
    scheduledDate: dateInputValueFromApi(t.scheduledDate) || null,
    publicDescription: (t.publicDescription != null ? String(t.publicDescription) : '').trim(),
    youtubeUrl: (t.youtubeUrl != null ? String(t.youtubeUrl) : '').trim(),
    hideResultsAfterHalf: Boolean(t.hideResultsAfterHalf),
    participants: (t.participants || []).map((p: any) => ({
      userIds: (p.userIds || []).map(String),
    })),
  });
}

function shuffleInPlace<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type Slot = { userIds: string[] };

function normalizeSlots(participants: { userIds: string[] }[]): Slot[] {
  return participants.map((p) => ({
    userIds: p.userIds.map((id) => String(id)),
  }));
}

/** Бієкція слот → місце (1..10), щоб ніхто з учасників слота не сидів на вже використаному для нього номері місця. */
function findPermutationAvoidingRepeatedSeats(
  slots: Slot[],
  usedSeatsByUser: Map<string, Set<number>>
): number[] | null {
  const n = slots.length;
  if (n !== 10) return null;

  const seatAllowedForSlot = (slotIdx: number, seat: number) => {
    for (const uid of slots[slotIdx].userIds) {
      if (usedSeatsByUser.get(uid)?.has(seat)) return false;
    }
    return true;
  };

  const dfsSolve = (randomizeCandidates: boolean): number[] | null => {
    const result: number[] = new Array(n);
    const taken = new Set<number>();

    const dfs = (i: number): boolean => {
      if (i === n) return true;
      const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((s) => !taken.has(s));
      if (randomizeCandidates) shuffleInPlace(candidates);
      for (const seat of candidates) {
        if (!seatAllowedForSlot(i, seat)) continue;
        taken.add(seat);
        result[i] = seat;
        if (dfs(i + 1)) return true;
        taken.delete(seat);
      }
      return false;
    };

    return dfs(0) ? result : null;
  };

  for (let attempt = 0; attempt < 400; attempt++) {
    const r = dfsSolve(true);
    if (r) return r;
  }

  const det = dfsSolve(false);
  if (det) return det;

  for (let t = 0; t < 25_000; t++) {
    const order = shuffleInPlace([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    let ok = true;
    for (let i = 0; i < n; i++) {
      if (!seatAllowedForSlot(i, order[i])) {
        ok = false;
        break;
      }
    }
    if (ok) return [...order];
  }

  return null;
}

function recordSeatsForGame(slots: Slot[], seatBySlot: number[], usedSeatsByUser: Map<string, Set<number>>) {
  for (let i = 0; i < slots.length; i++) {
    const seat = seatBySlot[i];
    for (const uid of slots[i].userIds) {
      let set = usedSeatsByUser.get(uid);
      if (!set) {
        set = new Set<number>();
        usedSeatsByUser.set(uid, set);
      }
      set.add(seat);
    }
  }
}

/**
 * participants: { userIds: string[] }[] length 10, each 1 or 2 ids.
 * Для кожної гри намагається не ставити ту саму людину на той самий номер місця (1–10), що вже був у неї в попередніх іграх.
 */
export function generateSeatingByGame(
  participants: { userIds: string[] }[],
  numGames: number
): {
  seatingByGame: Record<string, Record<string, { userIds: string[] }>>;
  relaxedConstraints: boolean;
} {
  const slots: Slot[] = normalizeSlots(participants);
  const out: Record<string, Record<string, { userIds: string[] }>> = {};
  const usedSeatsByUser = new Map<string, Set<number>>();
  let relaxedConstraints = false;

  for (let g = 1; g <= numGames; g++) {
    const perm = findPermutationAvoidingRepeatedSeats(slots, usedSeatsByUser);
    if (perm) {
      const gameSeats: Record<string, { userIds: string[] }> = {};
      for (let i = 0; i < 10; i++) {
        gameSeats[String(perm[i])] = { userIds: [...slots[i].userIds] };
      }
      out[String(g)] = gameSeats;
      recordSeatsForGame(slots, perm, usedSeatsByUser);
    } else {
      relaxedConstraints = true;
      const shuffled = shuffleInPlace([...slots]);
      const gameSeats: Record<string, { userIds: string[] }> = {};
      for (let s = 1; s <= 10; s++) {
        gameSeats[String(s)] = { userIds: [...shuffled[s - 1].userIds] };
      }
      out[String(g)] = gameSeats;
      for (let s = 1; s <= 10; s++) {
        for (const uid of shuffled[s - 1].userIds) {
          let set = usedSeatsByUser.get(uid);
          if (!set) {
            set = new Set<number>();
            usedSeatsByUser.set(uid, set);
          }
          set.add(s);
        }
      }
    }
  }

  return { seatingByGame: out, relaxedConstraints };
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
  const [youtubeUrl, setYoutubeUrl] = React.useState('');
  const [hideHalf, setHideHalf] = React.useState(false);
  const [participantRows, setParticipantRows] = React.useState<{ u1: ClubUser | null; u2: ClubUser | null }[]>([]);
  const [autosaveState, setAutosaveState] = React.useState<'idle' | 'saving' | 'error'>('idle');

  const lastSentJsonRef = React.useRef('');
  const loadGenRef = React.useRef(0);

  const isClub = user?.authType === 'Клуб';
  const isParticipantViewer = user?.authType === 'Учасник';
  const clubIdStr = user?._id != null ? String((user as any)._id) : '';
  const myUserIdStr = user?._id != null ? String((user as any)._id) : '';

  const refresh = React.useCallback(async () => {
    if (!id) return;
    const [{ data: t }, { data: g }, { data: s }] = await Promise.all([
      axios.get(`/tournament/${id}`),
      axios.get(`/tournament/${id}/games`),
      axios.get(`/tournament/${id}/standings`),
    ]);
    loadGenRef.current += 1;
    lastSentJsonRef.current = tournamentToSettingsSnapshot(t);
    setTournament(t);
    setGames(g.items || []);
    setStandings((s.items || []).map((row: any, i: number) => ({ ...row, id: row.userId || i })));
    setName(t.name || '');
    setNumGames(t.numGames || 1);
    setScheduledDate(dateInputValueFromApi(t.scheduledDate));
    setPublicDescription(t.publicDescription != null ? String(t.publicDescription) : '');
    setYoutubeUrl(t.youtubeUrl != null ? String(t.youtubeUrl) : '');
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

  const canEdit = isClub && tournament?.clubId === clubIdStr && tournament?.status !== 'completed';

  const buildSettingsPayload = React.useCallback(() => {
    const participants = participantRows
      .filter((r) => r.u1)
      .map((r) => ({
        userIds: [String(r.u1!._id), ...(r.u2 ? [String(r.u2._id)] : [])],
      }));
    return {
      name,
      numGames: Number(numGames) || 1,
      scheduledDate: scheduledDate || null,
      publicDescription: publicDescription.trim(),
      youtubeUrl: youtubeUrl.trim(),
      hideResultsAfterHalf: hideHalf,
      participants,
    };
  }, [name, numGames, scheduledDate, publicDescription, youtubeUrl, hideHalf, participantRows]);

  const settingsPayloadJson = React.useMemo(
    () => JSON.stringify(buildSettingsPayload()),
    [buildSettingsPayload]
  );

  React.useEffect(() => {
    if (!id || !canEdit) return;
    if (settingsPayloadJson === lastSentJsonRef.current) {
      setAutosaveState('idle');
      return;
    }
    const gen = loadGenRef.current;
    const t = window.setTimeout(async () => {
      if (gen !== loadGenRef.current) return;
      const body = buildSettingsPayload();
      const json = JSON.stringify(body);
      if (json === lastSentJsonRef.current) return;
      try {
        setAutosaveState('saving');
        await axios.put(`/club/tournament/${id}`, body);
        lastSentJsonRef.current = json;
        setAutosaveState('idle');
        await refresh();
      } catch (e: any) {
        console.error(e);
        setAutosaveState('error');
        alert(e?.response?.data?.error || 'Не вдалося зберегти зміни');
      }
    }, 750);
    return () => window.clearTimeout(t);
  }, [settingsPayloadJson, id, canEdit, buildSettingsPayload, refresh]);

  const nick = (u: ClubUser | null) => u?.nickname || u?.name || u?.email || '';

  const seatingLabel = (cell: { userIds: string[] } | undefined) => {
    if (!cell?.userIds?.length) return '—';
    return cell.userIds
      .map((uid) => nick(clubUsers.find((u) => u._id === uid) || { _id: uid, nickname: uid }))
      .join(' / ');
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
    const { seatingByGame, relaxedConstraints } = generateSeatingByGame(
      participants,
      tournament.numGames
    );
    try {
      await axios.put(`/club/tournament/${id}/seating`, { seatingByGame });
      await refresh();
      alert(
        relaxedConstraints
          ? 'Розсадку збережено. Для однієї або кількох ігор не вдалося уникнути повтору того ж місця (занадто багато ігор або обмеження пар) — там використано випадкову перестановку.'
          : 'Розсадку згенеровано та збережено'
      );
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Помилка');
    }
  };

  const downloadSeatingPng = async () => {
    const el = seatingRef.current;
    if (!el || !id) return;
    try {
      await downloadSeatingAsPng(el, `seating-${id}.png`);
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
  const allGamesSaved = tournament && tournament.gamesSaved >= tournament.numGames;

  /** Найближча гра без збереженого результату (те саме, що nextGameIndex з API, але з актуального списку games після refresh). */
  const nextUnsavedGameIndex = React.useMemo(() => {
    if (!tournament || tournament.status !== 'in_progress') return null;
    const numGames = Number(tournament.numGames) || 0;
    if (numGames < 1) return null;
    const saved = new Set(
      (games || [])
        .map((g: { gameIndex?: number }) => Number(g.gameIndex))
        .filter((i: number) => Number.isFinite(i) && i >= 1)
    );
    if (saved.size >= numGames) return null;
    for (let i = 1; i <= numGames; i++) {
      if (!saved.has(i)) return i;
    }
    return null;
  }, [tournament, games]);

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
              <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1.25} sx={{ mb: 1 }}>
                <Typography component="h1" variant="h5" sx={{ minWidth: 0 }}>
                  {tournament?.name}
                </Typography>
                {isClubOwner && tournament?.status === 'in_progress' && nextUnsavedGameIndex != null && (
                  <Button
                    component={Link}
                    to={`/profile/tournament/${id}/game/${nextUnsavedGameIndex}`}
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
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Статус: {statusUa[tournament?.status] || tournament?.status} · Ігор: {tournament?.numGames} ·
                Зіграно: {tournament?.gamesSaved ?? 0}
                {tournament?.winnerNickname ? ` · Переможець: ${tournament.winnerNickname}` : ''}
              </Typography>

              {isParticipantViewer ? (
                <>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Рейтинг турніру
                  </Typography>
                  <Box
                    sx={{
                      height: Math.max(320, 56 + standings.length * 52),
                      width: '100%',
                      maxWidth: '100%',
                      mb: 3,
                      '& .MuiDataGrid-row.tournament-standings--me': {
                        backgroundColor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.22 : 0.14),
                        fontWeight: 700,
                      },
                    }}
                  >
                    <DataGrid
                      rows={standings}
                      columns={standingsColumns}
                      density="compact"
                      disableRowSelectionOnClick
                      hideFooter={standings.length <= 25}
                      getRowClassName={(params) =>
                        String(params.row.userId) === myUserIdStr ? 'tournament-standings--me' : ''
                      }
                      initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
                      pageSizeOptions={[10, 25, 50]}
                    />
                  </Box>
                </>
              ) : null}

              {canEdit && (
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Stack direction="row" flexWrap="wrap" alignItems="baseline" justifyContent="space-between" gap={1} sx={{ mb: 1 }}>
                    <Typography variant="subtitle1">Налаштування</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {autosaveState === 'saving' ? 'Збереження…' : autosaveState === 'error' ? 'Помилка збереження' : 'Зміни зберігаються автоматично'}
                    </Typography>
                  </Stack>
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
                    <TextField
                      label="Посилання на YouTube (необовʼязково)"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      fullWidth
                      placeholder="https://www.youtube.com/@..."
                      helperText={`Порожнє — кнопка на публічній сторінці веде на ${DEFAULT_TOURNAMENT_YOUTUBE_URL}`}
                      InputLabelProps={{ shrink: Boolean(youtubeUrl) }}
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
                        <OutlinedActionIconButton aria-label="Видалити рядок учасника" onClick={() => removeParticipantRow(i)}>
                          <DeleteIcon />
                        </OutlinedActionIconButton>
                      </Stack>
                    ))}
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Button startIcon={<AddIcon />} onClick={addParticipantRow} disabled={participantRows.length >= 10}>
                        Додати учасника
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

              {!isParticipantViewer && isClubOwner && (tournament?.status === 'draft' || tournament?.status === 'in_progress') && (
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                    <Button variant="outlined" onClick={onGenerateSeating}>
                      Згенерувати розсадку
                    </Button>
                  </Stack>
                </Paper>
              )}

              {!isParticipantViewer && tournament?.seatingByGame && (
                <Paper sx={{ p: 2, mb: 2 }} ref={seatingRef} className="mafia-seating-png-export">
                  <TournamentSeatingTiles
                    numGames={tournament.numGames}
                    seatingByGame={tournament.seatingByGame}
                    formatSeat={(userIds) =>
                      seatingLabel(userIds?.length ? { userIds } : undefined)
                    }
                    title="Розсадка"
                    titleAction={
                      isClubOwner ? (
                        <Button variant="outlined" size="small" onClick={downloadSeatingPng}>
                          Завантажити скріншот розсадки
                        </Button>
                      ) : null
                    }
                  />
                </Paper>
              )}

              {!isParticipantViewer ? (
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  Ігри
                </Typography>
              ) : null}
              {!isParticipantViewer ? (
              <Stack spacing={1} sx={{ mb: 2 }}>
                {Array.from({ length: tournament?.numGames || 0 }, (_, i) => i + 1).map((k) => {
                  const g = games.find((x) => Number(x.gameIndex) === k);
                  const saved = Boolean(g && !g.hidden);
                  const hidden = g?.hidden;
                  const canPlay =
                    tournament?.status === 'in_progress' &&
                    isClubOwner &&
                    nextUnsavedGameIndex === k;
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
              ) : null}

              {!isParticipantViewer ? (
                <>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Рейтинг турніру
                  </Typography>
                  <Box sx={{ height: 360, width: '100%', mb: 2 }}>
                    <DataGrid rows={standings} columns={standingsColumns} density="compact" disableRowSelectionOnClick />
                  </Box>
                </>
              ) : null}

              <Copyright />
            </Box>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
