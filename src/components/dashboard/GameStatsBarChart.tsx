import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import {useEffect, useMemo} from "react";

export default function GameStatsBarChart({
  stats
}: { stats: any[] }) {
  const theme = useTheme();
  const colorPalette = [
    (theme.vars || theme).palette.primary.dark,
    (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.primary.light,
  ];
  const totalGames = useMemo(() => {
    return stats.reduce((acc: number, [,curr]: any) => acc + curr.totalGames, 0)
  }, [stats])
  const prevMonthChange = useMemo(() => {
    const currentMonth = stats.at(-1)[1].totalGames
    const prevMonth = stats.at(-2)[1].totalGames
    return prevMonth ? ((currentMonth - prevMonth) / prevMonth) * 100 : 100
  }, [stats])
  const mnthNames = useMemo(() => {
    return stats.map(([,mnth]: any) => mnth.name)
  }, [stats]);
  const totalGamesPerMonth = useMemo(() => {
    return stats.map(([,curr]: any) => curr.totalGames)
  }, [stats])
  const citizensWinsPerMonth = useMemo(() => {
    return stats.map(([,curr]: any) => curr.citizensWins)
  }, [stats])
  const mafiaWinsPerMonth = useMemo(() => {
    return stats.map(([,curr]: any) => curr.mafiaWins)
  }, [stats])
  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Всього ігор
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {totalGames}
            </Typography>
            <Chip size="small" color={prevMonthChange>0 ? 'success' : 'error'} label={`${prevMonthChange}%`} />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            за останні 12 міс
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={
            [
              {
                scaleType: 'band',
                categoryGapRatio: 0.5,
                data: mnthNames,
              },
            ] as any
          }
          series={[
            // {
            //   id: 'total-games',
            //   label: 'Всього ігор',
            //   data: totalGamesPerMonth,
            //   stack: 'A',
            // },
            {
              id: 'citizens-wins',
              label: 'Перемога мирних',
              data: citizensWinsPerMonth,
              stack: 'A',
            },
            {
              id: 'mafia-wins',
              label: 'Перемога мафії',
              data: mafiaWinsPerMonth,
              stack: 'A',
            },
          ]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
