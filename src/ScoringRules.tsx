import * as React from 'react';
import AppTheme from './theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import {styled} from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppAppBar from './components/AppAppBar';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import GroupsIcon from '@mui/icons-material/Groups';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PersonOffIcon from '@mui/icons-material/PersonOff';

const PageContainer = styled(Stack)(({theme}) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    [theme.breakpoints.up('md')]: {
      height: '300vh',
    },
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const SectionCard = ({icon, title, children}: {icon: React.ReactNode; title: string; children: React.ReactNode}) => (
  <Card variant="outlined" sx={{mb: 2}}>
    <CardContent>
      <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
        {icon}
        <Typography variant="h6" fontWeight={700}>{title}</Typography>
      </Box>
      {children}
    </CardContent>
  </Card>
);

const pointsCell = (val: string, positive?: boolean) => (
  <TableCell align="center">
    <Chip
      label={val}
      size="small"
      color={positive === undefined ? 'default' : positive ? 'success' : 'error'}
      variant="outlined"
      sx={{fontWeight: 700, minWidth: 56}}
    />
  </TableCell>
);

function GameRulesTab() {
  return (
    <>
      <SectionCard icon={<GroupsIcon color="action"/>} title="Що таке Мафія?">
        <Typography variant="body2" sx={{mb: 1}}>
          <b>Мафія</b> — це командна психологічна гра, де учасники розділені на дві команди: <b>мирні жителі</b> та <b>мафія</b>. Гравці не знають ролей один одного (окрім мафії, яка знає своїх). Гра ведеться ведучим (суддею).
        </Typography>
        <Typography variant="body2">
          У класичній грі беруть участь <b>10 гравців</b>: 6 мирних (включно з Шерифом) та 3 мафії (включно з Доном).
        </Typography>
      </SectionCard>

      <SectionCard icon={<GpsFixedIcon color="action"/>} title="Ролі">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Роль</b></TableCell>
                <TableCell><b>Команда</b></TableCell>
                <TableCell><b>Здібність</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Мирний житель (×6)</TableCell>
                <TableCell><Chip label="Мирні" size="small" color="success" variant="outlined"/></TableCell>
                <TableCell>Голосує вдень за вилучення підозрюваних</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Шериф (×1)</TableCell>
                <TableCell><Chip label="Мирні" size="small" color="success" variant="outlined"/></TableCell>
                <TableCell>Вночі перевіряє одного гравця — мафія чи ні</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Мафія (×2)</TableCell>
                <TableCell><Chip label="Мафія" size="small" color="error" variant="outlined"/></TableCell>
                <TableCell>Щоночі «вбиває» одного мирного</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Дон (×1)</TableCell>
                <TableCell><Chip label="Мафія" size="small" color="error" variant="outlined"/></TableCell>
                <TableCell>Вночі шукає Шерифа серед гравців</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </SectionCard>

      <SectionCard icon={<WbSunnyIcon color="action"/>} title="Фази гри">
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
          <Box>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
              <WbSunnyIcon fontSize="small" sx={{color: '#FFA726'}}/>
              <Typography variant="subtitle2" fontWeight={700}>День</Typography>
            </Box>
            <Typography variant="body2">
              Кожен гравець по черзі висловлюється за 1 хвилину — хто, на його думку, є мафією. Під час своєї промови гравець може висунути кандидата на вилучення. Після обговорення — голосування.
            </Typography>
          </Box>
          <Divider/>
          <Box>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
              <HowToVoteIcon fontSize="small" color="primary"/>
              <Typography variant="subtitle2" fontWeight={700}>Голосування</Typography>
            </Box>
            <Typography variant="body2">
              Кожен голосує за одного з кандидатів. Якщо не проголосувати, то вважається, що він голосує в останню виставлену кандидатуру. Хто набрав більше голосів — вилучається з гри. При рівності — додатковий раунд промов серед кандидатів.
            </Typography>
          </Box>
          <Divider/>
          <Box>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
              <NightsStayIcon fontSize="small" sx={{color: '#5C6BC0'}}/>
              <Typography variant="subtitle2" fontWeight={700}>Ніч</Typography>
            </Box>
            <Typography variant="body2">
              Місто засинає. Мафія із закритими очима має одночасно зробити постріл в одного з гравців — якщо всі гравці мафії влучили в одного гравця, він вважається «вбитим». Потім прокидається Дон і шукає Шерифа. Далі Шериф перевіряє одного гравця. Вранці ведучий оголошує хто був убитий.
            </Typography>
          </Box>
        </Box>
      </SectionCard>

      <SectionCard icon={<RemoveRedEyeIcon color="action"/>} title="Перша ніч">
        <Typography variant="body2">
          У першу ніч мафія знайомиться між собою та жестами обирає стратегію на гру.
        </Typography>
      </SectionCard>

      <SectionCard icon={<FavoriteIcon color="action"/>} title="Опорна п'ятірка">
        <Typography variant="body2">
          Перший вбитий гравець у грі має право на <b>«Опорну п'ятірку»</b> — назвати до 5 гравців, вказавши чорний (мафія) або червоний (мирний) колір.
        </Typography>
      </SectionCard>

      <SectionCard icon={<PersonOffIcon color="action"/>} title="Попередження (фоли)">
        <Typography variant="body2" sx={{mb: 1}}>
          Ведучий може видати попередження за порушення правил: розмови поза своєю хвилиною, надмірна жестикуляція, грубість тощо.
        </Typography>
        <Box component="ul" sx={{pl: 2.5, m: 0, '& li': {mb: 0.5}}}>
          <li><Typography variant="body2"><b>3 попередження</b> — гравець пропускає своє висловлювання на наступному дні.</Typography></li>
          <li><Typography variant="body2"><b>4 попередження</b> — гравець вилучається з гри з штрафом <b>-0.3</b> бали.</Typography></li>
        </Box>
      </SectionCard>

      <SectionCard icon={<EmojiEventsIcon color="action"/>} title="Перемога">
        <Box component="ul" sx={{pl: 2.5, m: 0, '& li': {mb: 0.5}}}>
          <li><Typography variant="body2"><Chip label="Мирні" size="small" color="success" variant="outlined" sx={{mr: 1}}/> перемагають, коли вся мафія вилучена.</Typography></li>
          <li><Typography variant="body2"><Chip label="Мафія" size="small" color="error" variant="outlined" sx={{mr: 1}}/> перемагає, коли кількість мафії зрівнюється з кількістю мирних.</Typography></li>
        </Box>
      </SectionCard>
    </>
  );
}

function ScoringTab() {
  return (
    <>
      <SectionCard icon={<GpsFixedIcon color="action"/>} title="Ролі">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Команда</b></TableCell>
                <TableCell><b>Ролі</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell><Chip label="Мирні" size="small" color="success" variant="outlined"/></TableCell>
                <TableCell>Мирний житель, Шериф</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Chip label="Мафія" size="small" color="error" variant="outlined"/></TableCell>
                <TableCell>Мафія (×2), Дон</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </SectionCard>

      <SectionCard icon={<EmojiEventsIcon color="action"/>} title="Бали за гру">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Результат</b></TableCell>
                <TableCell align="center"><b>Бали</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Перемога вашої команди</TableCell>
                {pointsCell('+1.0', true)}
              </TableRow>
              <TableRow>
                <TableCell>Поразка</TableCell>
                {pointsCell('0')}
              </TableRow>
              <TableRow>
                <TableCell>Вилучення (4 попередження)</TableCell>
                {pointsCell('-0.3', false)}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </SectionCard>

      <SectionCard icon={<FavoriteIcon color="action"/>} title="Опорна п'ятірка (ОП5)">
        <Typography variant="body2" sx={{mb: 2}}>
          Якщо вас вбили першим в ніч, ви називаєте від 1 до 5 гравців та вказуєте їхній колір — <b>чорний</b> (мафія) або <b>червоний</b> (мирний).
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Ваш вибір</b></TableCell>
                <TableCell><b>Хто насправді</b></TableCell>
                <TableCell align="center"><b>Бали</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell><Chip label="Чорний" size="small" sx={{bgcolor: '#333', color: '#fff'}}/></TableCell>
                <TableCell>Мафія / Дон</TableCell>
                {pointsCell('+0.2', true)}
              </TableRow>
              <TableRow>
                <TableCell><Chip label="Чорний" size="small" sx={{bgcolor: '#333', color: '#fff'}}/></TableCell>
                <TableCell>Мирний / Шериф</TableCell>
                {pointsCell('-0.2', false)}
              </TableRow>
              <TableRow>
                <TableCell><Chip label="Червоний" size="small" color="error"/></TableCell>
                <TableCell>Мирний / Шериф</TableCell>
                {pointsCell('+0.1', true)}
              </TableRow>
              <TableRow>
                <TableCell><Chip label="Червоний" size="small" color="error"/></TableCell>
                <TableCell>Мафія / Дон</TableCell>
                {pointsCell('-0.1', false)}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </SectionCard>

      <SectionCard icon={<AddCircleOutlineIcon color="action"/>} title="Додаткові бали від судді">
        <Typography variant="body2" sx={{mb: 2}}>
          Після гри суддя може нарахувати бонусні бали окремим гравцям.
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Команда гравця</b></TableCell>
                <TableCell align="center"><b>Можливі бонуси</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Переможці</TableCell>
                <TableCell align="center">+0.3 &nbsp; +0.4 &nbsp; +0.5</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Програвші</TableCell>
                <TableCell align="center">+0.1 &nbsp; +0.2 &nbsp; +0.3</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </SectionCard>

      <SectionCard icon={<LeaderboardIcon color="action"/>} title="Рейтинг">
        <Box sx={{bgcolor: 'action.hover', borderRadius: 1, p: 2, mb: 2, textAlign: 'center'}}>
          <Typography variant="h6" fontWeight={700}>
            Рейтинг = (сума балів ÷ кількість ігор) × 100
          </Typography>
        </Box>
        <Typography variant="body2" sx={{mb: 1}}>
          Гравець, який перемагає в кожній грі без бонусів, матиме рейтинг <b>100</b>.
        </Typography>
        <Divider sx={{my: 2}}/>
        <Typography variant="subtitle2" fontWeight={700} sx={{mb: 1}}>Місце в рейтингу:</Typography>
        <Box component="ol" sx={{pl: 2.5, m: 0, '& li': {mb: 0.5}}}>
          <li><Typography variant="body2">Гравці з <b>≥ середньої кількості ігор</b> за сезон завжди вище за тих, хто зіграв менше.</Typography></li>
          <li><Typography variant="body2">В межах кожної групи — сортування за рейтингом.</Typography></li>
          <li><Typography variant="body2">При однаковому рейтингу вище стоїть гравець з більшою кількістю ігор.</Typography></li>
        </Box>
      </SectionCard>

      <SectionCard icon={<StarIcon color="action"/>} title="Приклади">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Ситуація</b></TableCell>
                <TableCell align="center"><b>Бали</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Перемогли, без бонусів</TableCell>
                <TableCell align="center"><b>1.0</b></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Перемогли + ОП5: 3× чорних вірно, 2× червоних вірно</TableCell>
                <TableCell align="center"><b>1.8</b></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Програли + ОП5: 2× чорних вірно, 1× червоний невірно</TableCell>
                <TableCell align="center"><b>0.3</b></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Перемогли, але 4 фоли</TableCell>
                <TableCell align="center"><b>0.7</b></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Програли + 4 фоли</TableCell>
                <TableCell align="center"><b>-0.3</b></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </SectionCard>

      <SectionCard icon={<CalendarMonthIcon color="action"/>} title="Сезон">
        <Typography variant="body2">
          Рейтинг рахується окремо для кожного сезону. Попередні сезони не впливають на поточний рейтинг.
        </Typography>
      </SectionCard>
    </>
  );
}

export default function ScoringRules(props: {disableCustomTheme?: boolean}) {
  const [tab, setTab] = React.useState(0);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme/>
      <AppAppBar/>
      <PageContainer direction="column" sx={{justifyContent: 'center', pt: {xs: 12, sm: 14}, maxWidth: 720, mx: 'auto'}}>
        <Typography variant="h4" fontWeight={800} textAlign="center" gutterBottom>
          Правила гри
        </Typography>

        <Box sx={{borderBottom: 1, borderColor: 'divider', mb: 3}}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
            <Tab label="Класична мафія"/>
            <Tab label="Як рахуються бали"/>
          </Tabs>
        </Box>

        {tab === 0 && <GameRulesTab/>}
        {tab === 1 && <ScoringTab/>}

        <Box sx={{pb: 4}}/>
      </PageContainer>
    </AppTheme>
  );
}
