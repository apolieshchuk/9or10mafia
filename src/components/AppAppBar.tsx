import * as React from 'react';
import {styled, alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import StarIcon from '@mui/icons-material/Star';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Avatar from '@mui/material/Avatar';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';
import Sitemark from './SitemarkIcon';
import UpcomingTournamentBanner from './UpcomingTournamentBanner';
import {useAuth} from "../AuthProvider";
import {useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {useEffect, useMemo} from "react";

const StyledToolbar = styled(Toolbar)(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

let stopWatchInterval: NodeJS.Timeout;
let stopWatchStart = false;

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const [gameMenuAnchor, setGameMenuAnchor] = React.useState<null | HTMLElement>(null);
  const {user, logout} = useAuth();
  const navigate = useNavigate();
  const [stopWatch, setStopWatch] = React.useState(60);
  // const [stopWatchStart, setStopWatchStart] = React.useState(false);
  // const [stopWatchInterval, setStopWatchInterval] = React.useState(null as NodeJS.Timeout | null);

  const stopWatchFmt= useMemo(() => {
    const minutes = Math.floor((stopWatch % 3600) / 61);
    const seconds = Math.floor(stopWatch % 61);
    return seconds.toString().padStart(2, '0');
  }, [stopWatch]);

  useEffect(() => {
    stopWatchInterval = setInterval(() => {
      if (!stopWatchStart) return;
      setStopWatch((prev) => Math.max(prev - 1, 0))
    }, 1000);
    return () => clearInterval(stopWatchInterval);
  }, []);

  const startStopWatch = () => {
    setStopWatch(60);
    stopWatchStart = true;
  }

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const navigateWithConfirm = (path: string)=>  {
    if (path === '/new-game-rating' && window.location.pathname.endsWith('new-game-rating')) {
      if (!confirm("Ви починаєте нову гру. Дані діючої рейтингової гри не будуть збережені.")) return;
      localStorage.removeItem('ratingGameState');
      window.location.reload();
      return;
    }
    navigate(path);
  }

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{flexGrow: 1, display: 'flex', alignItems: 'center', px: 0, gap: 3}}>
            <Sitemark/>
            <Box sx={{display: 'none', '@media (min-width: 940px)': {display: 'flex'}, gap: 0.5, overflow: 'hidden', '& .MuiButton-root': {whiteSpace: 'nowrap', minWidth: 'auto', flexShrink: 1, overflow: 'hidden', textOverflow: 'ellipsis'}}}>
              <Button startIcon={<StarIcon/>} variant="text"
                      onClick={() => navigateWithConfirm('/clubs-rating')}
                      size="small" color="secondary">
                Рейтинг клубу
              </Button>
              {user?.authType === 'Клуб' ? <>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <Button
                    variant={window.location.pathname.includes('new-game') ? 'outlined' : 'text'}
                    onClick={() => navigateWithConfirm('/new-game-rating')}
                    size="small"
                    sx={{borderTopRightRadius: 0, borderBottomRightRadius: 0, pr: 1}}>
                    {window.location.pathname.endsWith('new-game-rating') ? 'Рейтингова гра' : window.location.pathname.endsWith('new-game') ? 'Фан гра' : 'Рейтингова гра'}
                  </Button>
                  <Button
                    variant={window.location.pathname.includes('new-game') ? 'outlined' : 'text'}
                    onClick={(e) => setGameMenuAnchor(e.currentTarget)}
                    size="small"
                    sx={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0, minWidth: 'auto', px: 0.3}}>
                    <ArrowDropDownIcon sx={{fontSize: 20}}/>
                  </Button>
                </Box>
                <Menu anchorEl={gameMenuAnchor} open={Boolean(gameMenuAnchor)} onClose={() => setGameMenuAnchor(null)}>
                  <MenuItem onClick={() => { setGameMenuAnchor(null); navigateWithConfirm('/new-game-rating'); }}>Рейтингова</MenuItem>
                  <MenuItem onClick={() => { setGameMenuAnchor(null); navigateWithConfirm('/new-game'); }}>Фанова</MenuItem>
                </Menu>
              </> : <Button variant={window.location.pathname.endsWith('new-game') ? 'outlined' : 'text'}
                      onClick={() => navigateWithConfirm('/new-game')}
                      size="small">
                Фан гра
              </Button>}
              <Button onClick={() => navigateWithConfirm('/members')} variant="text" color="info" size="small">
                Учасники
              </Button>
              <Button variant="text" onClick={() => navigateWithConfirm('/$')} size="small">
                $$$
              </Button>
              <Button variant="text" onClick={() => navigateWithConfirm('/calendar')} size="small">
                Події
              </Button>
              <Button variant="text" onClick={() => navigateWithConfirm('/scoring')} size="small">
                Правила
              </Button>
            </Box>
          </Box>
          {
            window.location.pathname.includes('new-game') &&
              <Typography color={stopWatch <= 0 ? 'error' :  stopWatch <= 10 ? 'warning': 'default' } onClick={startStopWatch} sx={{ mr: 3, cursor: 'pointer' }} variant='h2'>
                {stopWatchFmt}
              </Typography>
          }
          <Box
            sx={{
              display: 'none',
              '@media (min-width: 940px)': {display: 'flex'},
              gap: 1,
              alignItems: 'center',
            }}
          >
            {
              user && <Button onClick={() => navigateWithConfirm('/profile')} color="primary" variant="text" size="small" sx={{gap: 1, lineHeight: 1.2, py: 0.5, maxWidth: 180, overflow: 'hidden'}}>
                    {user.avatarUrl && <Avatar src={user.avatarUrl} sx={{width: 28, height: 28}}/>}
                    <Box sx={{display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
                      Мій Профіль
                      <span style={{fontSize: '0.7em', opacity: 0.7, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>({user?.name})</span>
                    </Box>
                </Button>
            }
            {
              user && <Button onClick={() => {
                logout()
                navigateWithConfirm('/')
              }} color="primary" variant="text" size="small">
                    Вийти
                </Button>
            }
            {
              !user && <Button href={'login'} color="primary" variant="text" size="small">
                    Увійти
                </Button>
            }
            {
              !user && <Button href={'register'} color="primary" variant="text" size="small">
                    Зареєструватися
                </Button>
            }
            {/*<ColorModeIconDropdown/>*/}
          </Box>
          <Box sx={{display: 'flex', '@media (min-width: 940px)': {display: 'none'}, gap: 1}}>
            {/*<ColorModeIconDropdown size="medium"/>*/}
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon/>
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{p: 2, backgroundColor: 'background.default'}}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon/>
                  </IconButton>
                </Box>
                <MenuItem selected={window.location.pathname.endsWith('clubs-rating')}
                          onClick={() => navigateWithConfirm('/clubs-rating')}><StarIcon sx={{ mr: .5 }}/>Рейтинг клубу</MenuItem>
                {user?.authType === 'Клуб' ? <>
                  <MenuItem selected={window.location.pathname.endsWith('new-game-rating')}
                            onClick={() => { setOpen(false); navigateWithConfirm('/new-game-rating'); }}>Рейтингова гра</MenuItem>
                  <MenuItem selected={window.location.pathname.endsWith('new-game')}
                            onClick={() => { setOpen(false); navigateWithConfirm('/new-game'); }}>Фан гра</MenuItem>
                </> : <MenuItem selected={window.location.pathname.endsWith('new-game')}
                          onClick={() => { setOpen(false); navigateWithConfirm('/new-game'); }}>Фан гра</MenuItem>}
                <MenuItem selected={window.location.pathname.includes('members')}
                          onClick={() => navigateWithConfirm('/members')}>Учасники</MenuItem>
                <MenuItem selected={window.location.pathname.includes('$')}
                          onClick={() => navigateWithConfirm('/$')}>$$$</MenuItem>
                <MenuItem selected={window.location.pathname.includes('calendar')}
                          onClick={() => navigateWithConfirm('/calendar')}>Події</MenuItem>
                <MenuItem selected={window.location.pathname.includes('scoring')}
                          onClick={() => { setOpen(false); navigateWithConfirm('/scoring'); }}>Правила</MenuItem>
                <Divider sx={{my: 3}}/>
                {
                  !user && <>
                        <MenuItem>
                            <Button href={'register'} color="primary" variant="outlined" fullWidth>
                                Зареєструватися
                            </Button>
                        </MenuItem>
                        <MenuItem>
                            <Button href={'login'} color="primary" variant="outlined" fullWidth>
                                Увійти
                            </Button>
                        </MenuItem>
                    </>
                }
                {
                  user && <>
                        <MenuItem>
                            <Button href={'profile'} color="primary" variant="outlined" fullWidth sx={{gap: 1, lineHeight: 1.2, py: 0.5}}>
                                {user.avatarUrl && <Avatar src={user.avatarUrl} sx={{width: 28, height: 28}}/>}
                                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                                  Мій Профіль
                                  <span style={{fontSize: '0.7em', opacity: 0.7}}>({user?.name})</span>
                                </Box>
                            </Button>
                        </MenuItem>
                        <MenuItem>
                            <Button onClick={() => {
                                logout()
                              navigateWithConfirm('/')
                            }} color="primary" variant="outlined" fullWidth>
                                Вийти
                            </Button>
                        </MenuItem>
                    </>
                }
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', px: 0.5 }}>
          <UpcomingTournamentBanner />
        </Box>
      </Container>
    </AppBar>
  );
}
