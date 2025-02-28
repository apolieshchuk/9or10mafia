import * as React from 'react';
import DarkModeIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightModeRounded';
import Box from '@mui/material/Box';
import IconButton, { IconButtonOwnProps } from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useColorScheme } from '@mui/material/styles';

export default function ColorModeIconDropdown(props: IconButtonOwnProps) {
  const { mode, setMode } = useColorScheme();

  const changeMode = () => {
    return mode === 'light' ? setMode('dark') : setMode('dark');
  }
  if (!mode) {
    return (
      <Box
        data-screenshot="toggle-mode"
        sx={(theme) => ({
          verticalAlign: 'bottom',
          display: 'inline-flex',
          width: '2.25rem',
          height: '2.25rem',
          borderRadius: (theme.vars || theme).shape.borderRadius,
          border: '1px solid',
          borderColor: (theme.vars || theme).palette.divider,
        })}
      />
    );
  }
  return (
    <React.Fragment>
      <IconButton
        data-screenshot="toggle-mode"
        onClick={changeMode}
        disableRipple
        size="small"
        aria-haspopup="true"
        {...props}
      >
        {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
      {/*<Menu*/}
      {/*  anchorEl={anchorEl}*/}
      {/*  id="account-menu"*/}
      {/*  open={open}*/}
      {/*  onClose={handleClose}*/}
      {/*  onClick={handleClose}*/}
      {/*  slotProps={{*/}
      {/*    paper: {*/}
      {/*      variant: 'outlined',*/}
      {/*      elevation: 0,*/}
      {/*      sx: {*/}
      {/*        my: '4px',*/}
      {/*      },*/}
      {/*    },*/}
      {/*  }}*/}
      {/*  transformOrigin={{ horizontal: 'right', vertical: 'top' }}*/}
      {/*  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}*/}
      {/*>*/}
      {/*  /!*<MenuItem selected={mode === 'system'} onClick={handleMode('system')}>*!/*/}
      {/*  /!*  System*!/*/}
      {/*  /!*</MenuItem>*!/*/}
      {/*  /!*<MenuItem selected={mode === 'light'} onClick={handleMode('light')}>*!/*/}
      {/*  /!*  Light*!/*/}
      {/*  /!*</MenuItem>*!/*/}
      {/*  /!*<MenuItem selected={mode === 'dark'} onClick={handleMode('dark')}>*!/*/}
      {/*  /!*  Dark*!/*/}
      {/*  /!*</MenuItem>*!/*/}
      {/*</Menu>*/}
    </React.Fragment>
  );
}
