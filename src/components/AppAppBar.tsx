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
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';
import Sitemark from './SitemarkIcon';
import {useAuth} from "../AuthProvider";
import {useNavigate} from "react-router-dom";

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

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const {user, logout} = useAuth();
  const navigate = useNavigate();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

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
            <Box sx={{display: {xs: 'none', md: 'flex'}}}>
              <Button sx={{mr: '.5rem'}} href={'members'}
                      variant={window.location.pathname.includes('members') ? 'outlined' : 'text'} color="info"
                      size="small">
                Учасники
              </Button>
              <Button sx={{mr: '.5rem'}} href={'clubs'}
                      variant={window.location.pathname.includes('clubs') ? 'outlined' : 'text'} color="info"
                      size="small">
                Клуби
              </Button>
              <Button sx={{mr: '.5rem'}} variant={window.location.pathname.endsWith('new-game') ? 'outlined' : 'text'}
                      href={'/new-game'} size="small">
                Фан гра
              </Button>
              {
                user?.authType === 'Клуб' && <Button href={'/new-game-rating'}
                                                     variant={window.location.pathname.endsWith('new-game-rating') ? 'outlined' : 'text'}
                                                     color="secondary" size="small">
                      Рейтингова гра
                  </Button>
              }
            </Box>
          </Box>
          <Box
            sx={{
              display: {xs: 'none', md: 'flex'},
              gap: 1,
              alignItems: 'center',
            }}
          >
            {
              user && <Button onClick={() => navigate('/profile')} color="primary" variant="text" size="small">
                    Мій Профіль ({user?.name})
                </Button>
            }
            {
              user && <Button onClick={() => {
                logout()
                navigate('/')
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
            <ColorModeIconDropdown/>
          </Box>
          <Box sx={{display: {xs: 'flex', md: 'none'}, gap: 1}}>
            <ColorModeIconDropdown size="medium"/>
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

                <MenuItem selected={window.location.pathname.includes('members')}
                          onClick={() => navigate('/members')}>Учасники</MenuItem>
                <MenuItem selected={window.location.pathname.includes('clubs')}
                          onClick={() => navigate('/clubs')}>Клуби</MenuItem>
                <MenuItem selected={window.location.pathname.endsWith('new-game')}
                          onClick={() => navigate('/new-game')}>Фан гра</MenuItem>
                {user?.authType === 'Клуб' && <MenuItem selected={window.location.pathname.endsWith('new-game-rating')}
                                                        onClick={() => navigate('/new-game-rating')}>Рейтингова
                    гра</MenuItem>}
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
                            <Button href={'profile'} color="primary" variant="outlined" fullWidth>
                                Мій Профіль ({user?.name})
                            </Button>
                        </MenuItem>
                        <MenuItem>
                            <Button onClick={() => {
                                logout()
                                navigate('/')
                            }} color="primary" variant="outlined" fullWidth>
                                Вийти
                            </Button>
                        </MenuItem>
                    </>
                }

                {/*{*/}
                {/*  user && <Button onClick={() => navigate('/profile')} color="primary" variant="text" size="small">*/}
                {/*        Мій Профіль ({user?.name})*/}
                {/*    </Button>*/}
                {/*}*/}
                {/*{*/}
                {/*  user && <Button onClick={() => {*/}
                {/*    logout()*/}
                {/*    navigate('/')*/}
                {/*  }} color="primary" variant="text" size="small">*/}
                {/*        Вийти*/}
                {/*    </Button>*/}
                {/*}*/}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
