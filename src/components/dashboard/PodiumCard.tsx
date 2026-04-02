import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

type Winner = {
  nickname: string;
  stat: string;
};

type PodiumProps = {
  champion: Winner | null;
  mvp: Winner | null;
  bestMafia: Winner | null;
};

const colors = {
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
};

function PodiumItem({ icon, color, title, nickname, stat }: {
  icon: React.ReactNode;
  color: string;
  title: string;
  nickname: string;
  stat: string;
}) {
  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 1, flex: 1, py: 2, px: 1,
    }}>
      <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>
        {icon}
      </Avatar>
      <Typography variant="caption" sx={{ color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>
        {title}
      </Typography>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>
        {nickname || '—'}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        {stat}
      </Typography>
    </Box>
  );
}

export default function PodiumCard({ champion, mvp, bestMafia }: PodiumProps) {
  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
          П'єдестал переможців
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-around' }} divider={
          <Box sx={{ width: { xs: '80%', sm: '1px' }, height: { xs: '1px', sm: 'auto' }, bgcolor: 'divider', mx: 'auto' }} />
        }>
          <PodiumItem
            icon={<StarIcon />}
            color={colors.silver}
            title="MVP"
            nickname={mvp?.nickname || ''}
            stat={mvp?.stat || ''}
          />
          <PodiumItem
            icon={<EmojiEventsIcon />}
            color={colors.gold}
            title="Чемпіон"
            nickname={champion?.nickname || ''}
            stat={champion?.stat || ''}
          />
          <PodiumItem
            icon={<GpsFixedIcon />}
            color={colors.bronze}
            title="Найкраща мафія"
            nickname={bestMafia?.nickname || ''}
            stat={bestMafia?.stat || ''}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
