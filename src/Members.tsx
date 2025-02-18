import * as React from 'react';
import AppTheme from "./theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid2";
import {DataGrid} from "@mui/x-data-grid";
import {columns, rows} from "./internals/data/gridDataMembers";
import {useEffect} from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import AppAppBar from "./components/AppAppBar";


const MembersContainer = styled(Stack)(({ theme }) => ({
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

export default function MembersList(props: { disableCustomTheme?: boolean }) {
  const [members, setMembers] = React.useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get('http://localhost:3000/users');
        const array = (data.items || []).map((item: any, i: number) => {
          return { ...item, id: i + 1 };
        })
        setMembers(array || []);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, [])
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <MembersContainer direction="column" justifyContent="space-between">
        <AppAppBar />
        {/*<Box sx={{ width: '100%', gap: 3, display: 'flex', justifyContent: 'space-between' }}>*/}
        {/*  <Button*/}
        {/*    href={'/'}*/}
        {/*    variant="outlined"*/}
        {/*    color="primary"*/}
        {/*    size="small"*/}
        {/*    fullWidth={true}*/}
        {/*    // sx={{minWidth: 'fit-content'}}*/}
        {/*    // sx={{ position: 'fixed', top: '1rem', left: '1rem' }}*/}
        {/*  >*/}
        {/*    Головна*/}
        {/*  </Button>*/}
        {/*  <Button*/}
        {/*    href={'/clubs'}*/}
        {/*    variant="outlined"*/}
        {/*    color="primary"*/}
        {/*    size="small"*/}
        {/*    fullWidth={true}*/}
        {/*    // sx={{minWidth: 'fit-content'}}*/}
        {/*    // sx={{ position: 'fixed', top: '1rem', left: '1rem' }}*/}
        {/*  >*/}
        {/*    Клуби*/}
        {/*  </Button>*/}
        {/*</Box>*/}
        {/*<ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />*/}
        {/*<Typography component="h2" variant="h6" sx={{ mb: 2 }}>*/}
        {/*  Details*/}
        {/*</Typography>*/}
        <Box sx={{ mt: '5rem' }}>
          <Grid container spacing={2} columns={12}>
            <Grid size={{ xs: 12, lg: 9 }}>
              <DataGrid
                checkboxSelection
                rows={members}
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
                {/*<ChartUserByCountry />*/}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </MembersContainer>
    </AppTheme>
  );
}