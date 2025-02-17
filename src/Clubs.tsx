import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AppTheme from "./theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import ColorModeSelect from "./theme/ColorModeSelect";
import SitemarkIcon from "./components/SitemarkIcon";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import ForgotPassword from "./components/ForgotPassword";
import Link from "@mui/material/Link";
import {styled} from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import CustomizedDataGrid from "./components/dashboard/CustomizedDataGrid";
import CustomizedTreeView from "./components/dashboard/CustomizedTreeView";
import ChartUserByCountry from "./components/dashboard/ChartUserByCountry";
import {DataGrid} from "@mui/x-data-grid";
import {columns, rows} from "./internals/data/gridData";

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  // [theme.breakpoints.up('sm')]: {
  //   maxWidth: '450px',
  // },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const ClubsContainer = styled(Stack)(({ theme }) => ({
  // height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  // minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
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

export default function ClubsList(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ClubsContainer direction="column" justifyContent="space-between">
        <Box sx={{ width: '100%', gap: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            href={'/'}
            variant="outlined"
            color="primary"
            size="small"
            fullWidth={true}
            // sx={{minWidth: 'fit-content'}}
            // sx={{ position: 'fixed', top: '1rem', left: '1rem' }}
          >
            Головна
          </Button>
          <Button
            href={'/members'}
            variant="outlined"
            color="primary"
            size="small"
            fullWidth={true}
            // sx={{minWidth: 'fit-content'}}
            // sx={{ position: 'fixed', top: '1rem', left: '1rem' }}
          >
            Учасники
          </Button>
        </Box>
        {/*<ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />*/}
        {/*<Typography component="h2" variant="h6" sx={{ mb: 2 }}>*/}
        {/*  Details*/}
        {/*</Typography>*/}
        <Box sx={{ mt: '2rem' }}>
          <Grid container spacing={2} columns={12}>
            <Grid size={{ xs: 12, lg: 9 }}>
              <DataGrid
                checkboxSelection
                rows={rows}
                columns={columns}
                getRowClassName={(params) =>
                  params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                initialState={{
                  pagination: { paginationModel: { pageSize: 15 } },
                }}
                pageSizeOptions={[15]}
                disableColumnResize
                density="compact"
                slotProps={{
                  filterPanel: {
                    filterFormProps: {
                      logicOperatorInputProps: {
                        variant: 'outlined',
                        size: 'small',
                      },
                      columnInputProps: {
                        variant: 'outlined',
                        size: 'small',
                        sx: { mt: 'auto' },
                      },
                      operatorInputProps: {
                        variant: 'outlined',
                        size: 'small',
                        sx: { mt: 'auto' },
                      },
                      valueInputProps: {
                        InputComponentProps: {
                          variant: 'outlined',
                          size: 'small',
                        },
                      },
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 3 }}>
              <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
                {/*<CustomizedTreeView />*/}
                <ChartUserByCountry />
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </ClubsContainer>
    </AppTheme>
  );
}