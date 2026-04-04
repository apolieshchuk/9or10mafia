import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export type SeatingByGameMap = Record<
  string,
  Record<string, { userIds: string[] } | undefined> | undefined
>;

const SEATS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

type TournamentSeatingTilesProps = {
  numGames: number;
  seatingByGame: SeatingByGameMap | null | undefined;
  /** Resolved label for one seat (e.g. nicknames). Empty seat → pass undefined or []. */
  formatSeat: (userIds: string[] | undefined) => string;
  /** Section heading above the grid */
  title?: string;
};

/**
 * One card per game: seats 1–10 with participant list for that game.
 */
export default function TournamentSeatingTiles({
  numGames,
  seatingByGame,
  formatSeat,
  title = 'Розсадка',
}: TournamentSeatingTilesProps) {
  const games = Array.from({ length: Math.max(0, numGames) }, (_, i) => i + 1);

  return (
    <Box>
      {title ? (
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
          {title}
        </Typography>
      ) : null}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 2,
          alignItems: 'stretch',
        }}
      >
        {games.map((g) => {
          const gameMap = seatingByGame?.[String(g)];
          return (
            <Paper
              key={g}
              variant="outlined"
              sx={{
                p: 1.75,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  mb: 1.25,
                  color: 'primary.main',
                  letterSpacing: 0.02,
                }}
              >
                Гра {g}
              </Typography>
              <Stack spacing={0.65} divider={<Divider flexItem sx={{ opacity: 0.4 }} />}>
                {SEATS.map((s) => {
                  const userIds = gameMap?.[String(s)]?.userIds;
                  const label = formatSeat(userIds);
                  return (
                    <Stack
                      key={s}
                      direction="row"
                      spacing={1}
                      alignItems="flex-start"
                      sx={{ flexWrap: 'nowrap', gap: 1 }}
                    >
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          minWidth: 72,
                          flexShrink: 0,
                          fontWeight: 700,
                          lineHeight: 1.45,
                          pt: 0.15,
                        }}
                      >
                        Місце {s}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          fontWeight: 600,
                          lineHeight: 1.4,
                          wordBreak: 'break-word',
                        }}
                      >
                        {label}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
