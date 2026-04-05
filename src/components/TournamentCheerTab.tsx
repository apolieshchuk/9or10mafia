import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import { alpha } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import axios from '../axios';
import { resolveMediaUrl } from '../utils/mediaUrl';

type PublicPlayer = { id: string; nickname: string; avatarUrl: string | null };
type PublicSlot = { seatIndex: number; players: PublicPlayer[] };

export type CheerItem = {
  id: string;
  message: string;
  createdAt: string;
  anonymous: boolean;
  fromUser: { id: string; nickname: string; avatarUrl: string | null } | null;
  toUser: { id: string; nickname: string; avatarUrl: string | null };
};

const SUGGESTIONS = [
  'Тримаємо кулаки! 💪',
  'Удачі за столом!',
  'Ти кращий!',
  'Грай як бог!',
  'Ми в тебе віримо!',
  'Покажи клас!',
  'Успіху та натхнення!',
  'Нехай мирні переможуть… завядяки тобі! 😉',
];

/** Усі зайняті місця: кожен учасник окремо (пара за одним столом — два елементи). */
function slotFieldEntries(slots: PublicSlot[]): { seatIndex: number; player: PublicPlayer; scatterIndex: number }[] {
  const sorted = [...slots].sort((a, b) => a.seatIndex - b.seatIndex);
  const out: { seatIndex: number; player: PublicPlayer; scatterIndex: number }[] = [];
  let scatterIndex = 0;
  for (const s of sorted) {
    for (const p of s.players || []) {
      if (!p?.id) continue;
      out.push({ seatIndex: s.seatIndex, player: p, scatterIndex: scatterIndex++ });
    }
  }
  return out;
}

function hashString(s: string): number {
  let h = 0;
  for (let j = 0; j < s.length; j++) h = (h * 31 + s.charCodeAt(j)) >>> 0;
  return h;
}

/**
 * Сітка як опора + джитер (хаотичніше розкидання). Центр clamp-иться до меж контейнера.
 */
function cheerCardLayout(
  layoutKey: string,
  index: number,
  cols: number,
  rows: number
): { left: string; top: string } {
  const row = Math.floor(index / cols);
  const col = index % cols;
  const hPos = hashString(`${layoutKey}:${index}:pos`);
  const jx = ((hPos % 31) / 15 - 1) * 0.38;
  const jy = (((hPos >> 8) % 31) / 15 - 1) * 0.38;

  const marginL = 8;
  const marginR = 8;
  const marginT = 14;
  const marginB = 11;
  const usableW = 100 - marginL - marginR;
  const usableH = 100 - marginT - marginB;

  const cellW = usableW / cols;
  const cellH = usableH / rows;

  let cx = marginL + (col + 0.5 + jx * 0.62) * cellW;
  let cy = marginT + (row + 0.5 + jy * 0.62) * cellH;

  cx = Math.min(84, Math.max(16, cx));
  cy = Math.min(85, Math.max(19, cy));

  return {
    left: `${cx}%`,
    top: `${cy}%`,
  };
}

function cheerFieldGrid(n: number): { cols: number; rows: number; minHeightPx: number } {
  if (n < 1) return { cols: 1, rows: 0, minHeightPx: 140 };
  const cols = n === 1 ? 1 : Math.min(5, Math.max(2, Math.ceil(Math.sqrt(n))));
  const rows = Math.ceil(n / cols);
  const minHeightPx = Math.max(300, 72 + rows * 148);
  return { cols, rows, minHeightPx };
}

function FeedAvatar({
  avatarUrl,
  nickname,
  size = 28,
}: {
  avatarUrl: string | null;
  nickname: string;
  size?: number;
}) {
  const [failed, setFailed] = React.useState(false);
  const src = !failed ? resolveMediaUrl(avatarUrl ?? null) : undefined;
  const initial = nickname.trim().charAt(0).toUpperCase() || '?';
  const dim = size;
  const fontSize = size >= 64 ? '1.35rem' : size >= 40 ? '1.1rem' : '0.75rem';
  if (src) {
    return (
      <Box
        component="img"
        src={src}
        alt=""
        onError={() => setFailed(true)}
        sx={{
          width: dim,
          height: dim,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          border: (t) => `2px solid ${alpha(t.palette.primary.main, 0.35)}`,
        }}
      />
    );
  }
  return (
    <Box
      sx={{
        width: dim,
        height: dim,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: 700,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
      }}
    >
      {initial}
    </Box>
  );
}

function MuscleBadge({ count }: { count: number }) {
  if (count < 1) return null;
  const n = Math.min(count, 10);
  return (
    <Box
      sx={{
        position: 'absolute',
        top: -6,
        right: -6,
        zIndex: 2,
        fontSize: '0.7rem',
        lineHeight: 1.1,
        bgcolor: 'background.paper',
        borderRadius: 1,
        px: 0.4,
        py: 0.2,
        boxShadow: 1,
        border: (t) => `1px solid ${t.palette.divider}`,
        maxWidth: 96,
        overflow: 'hidden',
        textAlign: 'right',
      }}
      title={`${count} підтримок`}
    >
      {'💪'.repeat(n)}
      {count > 10 ? ` +${count - 10}` : ''}
    </Box>
  );
}

type Props = {
  tournamentId: string;
  slots: PublicSlot[];
  currentUserId: string | null | undefined;
  isLoggedIn: boolean;
};

const FIELD_AVATAR_SIZE = 80;
const FEED_AVATAR_TO = 40;
const FEED_AVATAR_FROM = 34;

export default function TournamentCheerTab({ tournamentId, slots, currentUserId, isLoggedIn }: Props) {
  const fieldEntries = React.useMemo(() => slotFieldEntries(slots), [slots]);
  const cheerGrid = React.useMemo(() => cheerFieldGrid(fieldEntries.length), [fieldEntries.length]);
  const [items, setItems] = React.useState<CheerItem[]>([]);
  const [countsByUserId, setCountsByUserId] = React.useState<Record<string, number>>({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<PublicPlayer | null>(null);
  const [message, setMessage] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [viewerHasCheered, setViewerHasCheered] = React.useState(false);
  /** За замовчуванням — анонімно (не показувати автора в стрічці). */
  const [cheerAnonymous, setCheerAnonymous] = React.useState(true);

  const alreadyCheered = Boolean(isLoggedIn && viewerHasCheered);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<{
        items: CheerItem[];
        countsByUserId: Record<string, number>;
        viewerHasCheered?: boolean;
      }>(`/public/tournament/${tournamentId}/cheers`);
      const list = data.items || [];
      setItems(list);
      setCountsByUserId(data.countsByUserId || {});
      const uid = currentUserId != null ? String(currentUserId) : '';
      setViewerHasCheered(
        Boolean(
          data.viewerHasCheered ??
            (uid && list.some((c) => c.fromUser && c.fromUser.id === uid))
        )
      );
    } catch {
      setError('Не вдалося завантажити підтримку.');
    } finally {
      setLoading(false);
    }
  }, [tournamentId, currentUserId]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const openFor = (p: PublicPlayer) => {
    if (!isLoggedIn) return;
    if (alreadyCheered) return;
    if (currentUserId && p.id === String(currentUserId)) return;
    setSelected(p);
    setMessage('');
    setCheerAnonymous(true);
    setDialogOpen(true);
  };

  const appendSuggestion = (s: string) => {
    setMessage((prev) => (prev ? `${prev.trim()} ${s}` : s));
  };

  const send = async () => {
    const msg = message.trim();
    if (!selected || msg.length < 1) return;
    setSending(true);
    try {
      await axios.post(`/tournament/${tournamentId}/cheer`, {
        toUserId: selected.id,
        message: msg,
        anonymous: cheerAnonymous,
      });
      setDialogOpen(false);
      setSelected(null);
      setMessage('');
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error || e?.message || 'Помилка відправки');
    } finally {
      setSending(false);
    }
  };

  const fieldPaper = (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        minHeight: cheerGrid.minHeightPx + 52,
        borderRadius: 3,
        overflow: 'hidden',
        border: (t) => `1px solid ${t.palette.divider}`,
        background: (t) =>
          t.palette.mode === 'dark'
            ? `linear-gradient(160deg, ${alpha(t.palette.primary.dark, 0.35)} 0%, ${alpha(t.palette.grey[900], 0.9)} 45%, ${alpha(t.palette.secondary.dark, 0.25)} 100%)`
            : `linear-gradient(165deg, ${alpha(t.palette.primary.light, 0.35)} 0%, #fff8fb 40%, ${alpha(t.palette.secondary.light, 0.28)} 100%)`,
      }}
    >
      <Box sx={{ position: 'absolute', inset: 0, opacity: 0.07, backgroundImage: 'radial-gradient(circle at 20% 30%, #000 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
      <Typography variant="subtitle2" sx={{ position: 'relative', zIndex: 1, pt: 1.5, px: 2, fontWeight: 800 }}>
        Обери учасника
      </Typography>
      {fieldEntries.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2, position: 'relative', zIndex: 1 }}>
          Список учасників порожній.
        </Typography>
      ) : (
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            minHeight: cheerGrid.minHeightPx,
            height: cheerGrid.minHeightPx,
            px: { xs: 0.5, sm: 1 },
            pb: 1,
            boxSizing: 'border-box',
          }}
        >
          {fieldEntries.map(({ seatIndex, player: p, scatterIndex }) => {
            const count = countsByUserId[p.id] || 0;
            const isSelf = currentUserId && p.id === String(currentUserId);
            const canClick = isLoggedIn && !alreadyCheered && !isSelf;
            const scatterKey = `${p.id}-${seatIndex}-${scatterIndex}`;
            const { left, top } = cheerCardLayout(scatterKey, scatterIndex, cheerGrid.cols, cheerGrid.rows);
            return (
              <Box
                key={scatterKey}
                onClick={() => canClick && openFor(p)}
                sx={{
                  position: 'absolute',
                  left,
                  top,
                  transform: 'translate(-50%, -50%)',
                  cursor: canClick ? 'pointer' : 'default',
                  opacity: isSelf ? 0.55 : 1,
                  zIndex: 1,
                  '&:hover': canClick
                    ? {
                        zIndex: 4,
                        '& .cheer-card-inner': { transform: 'scale(1.05)' },
                      }
                    : undefined,
                }}
              >
                <Box
                  className="cheer-card-inner"
                  sx={{
                    position: 'relative',
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <MuscleBadge count={count} />
                  <FeedAvatar avatarUrl={p.avatarUrl} nickname={p.nickname} size={FIELD_AVATAR_SIZE} />
                  <Box
                    sx={{
                      mt: 0.5,
                      maxWidth: 140,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      display="block"
                      fontWeight={800}
                      sx={{
                        lineHeight: 1.2,
                        fontSize: '0.9rem',
                        textShadow: (t) => `0 0 10px ${t.palette.background.paper}`,
                      }}
                    >
                      {p.nickname}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );

  const feed = (
    <Paper
      elevation={0}
      sx={{
        border: (t) => `1px solid ${t.palette.divider}`,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: { xs: 360, md: 520 },
        minHeight: 240,
        overflow: 'hidden',
      }}
    >
      <Typography variant="subtitle2" fontWeight={800} sx={{ px: 1.5, py: 1, borderBottom: 1, borderColor: 'divider' }}>
        Стрічка підтримки
      </Typography>
      <Box sx={{ overflow: 'auto', flex: 1, p: 1 }}>
        {loading ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
            Завантаження…
          </Typography>
        ) : items.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
            Ще ніхто не надіслав побажання. Будь першим!
          </Typography>
        ) : (
          <Stack spacing={1.25}>
            {items.map((c) => (
              <Paper key={c.id} variant="outlined" sx={{ p: 1, borderRadius: 1.5, bgcolor: 'action.hover' }}>
                <Stack spacing={0.75}>
                  <Stack direction="row" alignItems="center" gap={0.75} flexWrap="wrap" sx={{ rowGap: 0.5 }}>
                    <Typography variant="body2" fontWeight={800} component="span">
                      Підтримали
                    </Typography>
                    <FeedAvatar avatarUrl={c.toUser.avatarUrl} nickname={c.toUser.nickname} size={FEED_AVATAR_TO} />
                    <Typography variant="body2" fontWeight={700} component="span">
                      {c.toUser.nickname}:
                    </Typography>
                    <Typography variant="body2" component="span" sx={{ fontStyle: 'italic' }}>
                      «{c.message}»
                    </Typography>
                  </Stack>
                  {c.fromUser ? (
                    <Stack direction="row" alignItems="center" gap={0.5} sx={{ opacity: 0.8 }}>
                      <Typography variant="caption" color="text.secondary">
                        від
                      </Typography>
                      <FeedAvatar avatarUrl={c.fromUser.avatarUrl} nickname={c.fromUser.nickname} size={FEED_AVATAR_FROM} />
                      <Typography variant="caption" color="text.secondary">
                        {c.fromUser.nickname}
                      </Typography>
                    </Stack>
                  ) : null}
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ pt: 1, width: '100%' }}>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}
      {!isLoggedIn ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Увійдіть, щоб надіслати побажання учаснику.{' '}
          <Button component={Link} to="/login" size="small" sx={{ ml: 0.5 }}>
            Увійти
          </Button>
        </Alert>
      ) : null}
      {isLoggedIn && alreadyCheered ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          Дякуємо! Ви вже підтримали учасника в цьому турнірі.
        </Alert>
      ) : null}

      {!alreadyCheered ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, maxWidth: 640, lineHeight: 1.45, fontStyle: 'italic' }}
        >
          Маленьке правило: обери ОДНОГО за кого тримаєш кулаки ✊
        </Typography>
      ) : null}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
        <Box sx={{ flex: 1, minWidth: 0 }}>{fieldPaper}</Box>
        <Box sx={{ width: { xs: '100%', md: 320 }, flexShrink: 0 }}>{feed}</Box>
      </Stack>

      <Dialog open={dialogOpen} onClose={() => !sending && setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Підтримати: {selected?.nickname}</DialogTitle>
        <DialogContent>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            Коротке побажання (від руки або обери фразу):
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mb: 1.5 }}>
            {SUGGESTIONS.map((s) => (
              <Chip key={s} size="small" label={s} onClick={() => appendSuggestion(s)} variant="outlined" />
            ))}
          </Stack>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            placeholder="Твоє побажання…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            inputProps={{ maxLength: 220 }}
            sx={(t) => ({
              mt: 0.5,
              '& textarea.MuiOutlinedInput-input': {
                lineHeight: 1.5,
                fontFamily: t.typography.body1.fontFamily,
                resize: 'vertical',
              },
            })}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {message.length}/220
          </Typography>
          <FormControlLabel
            sx={{ mt: 1.5, alignItems: 'flex-start', ml: 0 }}
            control={
              <Checkbox
                checked={cheerAnonymous}
                onChange={(_, v) => setCheerAnonymous(v)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body2" component="span" display="block">
                  Надіслати анонімно
                </Typography>
              </Box>
            }
          />
        </DialogContent>
        <DialogActions sx={{ gap: 1, px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => setDialogOpen(false)} disabled={sending}>
            Скасувати
          </Button>
          <Button
            variant="contained"
            onClick={() => void send()}
            disabled={sending || message.trim().length < 1}
            sx={(th) => ({
              boxShadow: 'none',
              backgroundImage: 'none',
              border: 'none',
              bgcolor: th.palette.primary.main,
              color: th.palette.primary.contrastText,
              '&:hover': {
                bgcolor: th.palette.primary.dark,
                boxShadow: 'none',
                backgroundImage: 'none',
              },
              '&.Mui-disabled': {
                bgcolor: th.palette.action.disabledBackground,
                color: th.palette.action.disabled,
                backgroundImage: 'none',
              },
            })}
          >
            Надіслати
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
