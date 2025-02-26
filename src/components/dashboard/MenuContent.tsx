import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../AuthProvider";
import {useEffect} from "react";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Diversity3Icon from "@mui/icons-material/Diversity3";


const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, path: '/profile' },
  // { text: 'Analytics', icon: <AnalyticsRoundedIcon /> },
  // { text: 'Учасники', icon: <PeopleRoundedIcon />, path: '/profile/users' },
  // { text: 'Клуби', icon: <PeopleRoundedIcon />, path: '/profile/clubs' },
  // { text: 'Tasks', icon: <AssignmentRoundedIcon /> },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon /> },
  { text: 'About', icon: <InfoRoundedIcon /> },
  { text: 'Feedback', icon: <HelpRoundedIcon /> },
];

export default function MenuContent() {
  const navigate = useNavigate();
  const [path, setPath] = React.useState(window.location.pathname);
  const [listItems, setListItems] = React.useState(mainListItems);
  const { user } = useAuth();
  // const [isClub, setIsClub] = React.useState(false);
  useEffect(() => {
    let items = [...mainListItems];
    if (user?.authType === 'Клуб') {
      items = [...items, { text: 'Учасники', icon: <PeopleRoundedIcon />, path: '/profile/users' }];
    } else {
      items = [...items, { text: 'Ігри', icon: <EmojiEventsIcon />, path: '/profile/games' }];
      items = [...items, { text: 'Клуби', icon: <Diversity3Icon />, path: '/profile/clubs' }];
    }
    items = [...items, { text: 'Рейтинг', icon: <EmojiEventsIcon />, path: '/profile/rating-periods' }];
    setListItems(() => items);

  }, [user]);

  // setPath(window.location.pathname)
  // console.log(`--->`, window.location.pathname, 'MenuContent.tsx:32')
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {listItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={path === item.path} onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/*<List dense>*/}
      {/*  {secondaryListItems.map((item, index) => (*/}
      {/*    <ListItem key={index} disablePadding sx={{ display: 'block' }}>*/}
      {/*      <ListItemButton>*/}
      {/*        <ListItemIcon>{item.icon}</ListItemIcon>*/}
      {/*        <ListItemText primary={item.text} />*/}
      {/*      </ListItemButton>*/}
      {/*    </ListItem>*/}
      {/*  ))}*/}
      {/*</List>*/}
    </Stack>
  );
}
