import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';
import StarsIcon from '@mui/icons-material/Stars';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Face5Icon from '@mui/icons-material/Face5';

export type StatCardProps = {
  title: string;
  value: string;
  description: string;
  citizenWinsRate: number;
  mafiaWinsRate: number;
  donWinsRate: number;
  sheriffWinsRate: number;
};

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

export default function MvpStatCard({
  title,
  value,
  description,
  citizenWinsRate,
  mafiaWinsRate,
  donWinsRate,
  sheriffWinsRate,
}: StatCardProps) {
  const theme = useTheme();
  const daysInWeek = getDaysInMonth(4, 2024);

  const trendColors = {
    up:
      theme.palette.mode === 'light'
        ? theme.palette.success.main
        : theme.palette.success.dark,
    down:
      theme.palette.mode === 'light'
        ? theme.palette.error.main
        : theme.palette.error.dark,
    neutral:
      theme.palette.mode === 'light'
        ? theme.palette.grey[400]
        : theme.palette.grey[700],
  };

  const labelColors = {
    up: 'success' as const,
    down: 'error' as const,
    neutral: 'default' as const,
  };

  // const color = labelColors[trend];
  // const chartColor = trendColors[trend];
  const trendValues = { up: '+25%', down: '-25%', neutral: '+5%' };

  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: 'space-between', flexGrow: '1', gap: 1 }}
        >
          <Stack sx={{ justifyContent: 'space-between' }}>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography  variant="h4" component="p">
                {value}
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {description}
            </Typography>
            <Box sx={{  flexDirection: 'row' }} display={'flex'}>
              <Box sx={{ m: 1 }}>МИРНІ <Chip sx={{ ml: .5 }} icon={<ThumbUpIcon/>} size="small" color='error' label={`${citizenWinsRate}%`}/> </Box>
              <Box sx={{ m: 1 }}>МАФІЯ <Chip sx={{ ml: .5 }} icon={<ThumbDownIcon/>} size="small" color='default' label={`${mafiaWinsRate}%`}/> </Box>
              <Box sx={{ m: 1 }}>ШЕРИФ <Chip sx={{ ml: .5 }} icon={<StarsIcon/>} size="small" color='error' label={`${sheriffWinsRate}%`}/> </Box>
              <Box sx={{ m: 1 }}>ДОН <Chip sx={{ ml: .5 }} icon={<Face5Icon/>} size="small" color='default' label={`${donWinsRate}%`}/> </Box>
            </Box>
          </Stack>
          {/*<Box sx={{ width: '100%', height: 50 }}>*/}
          {/*  <SparkLineChart*/}
          {/*    colors={[chartColor]}*/}
          {/*    data={data}*/}
          {/*    area*/}
          {/*    showHighlight*/}
          {/*    showTooltip*/}
          {/*    xAxis={{*/}
          {/*      scaleType: 'band',*/}
          {/*      data: daysInWeek, // Use the correct property 'data' for xAxis*/}
          {/*    }}*/}
          {/*    sx={{*/}
          {/*      [`& .${areaElementClasses.root}`]: {*/}
          {/*        fill: `url(#area-gradient-${value})`,*/}
          {/*      },*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <AreaGradient color={chartColor} id={`area-gradient-${value}`} />*/}
          {/*  </SparkLineChart>*/}
          {/*</Box>*/}
        </Stack>
      </CardContent>
    </Card>
  );
}
