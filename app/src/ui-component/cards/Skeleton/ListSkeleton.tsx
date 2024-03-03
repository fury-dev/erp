import { Box, Paper, Skeleton, TableContainer, TableCell, TableHead, TableRow, Table, TableBody, Grid } from '@mui/material';

export const ListSkeleton = () => (
  <div style={{ height: '100%', width: '100', backgroundColor: 'white' }}>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '5px',
        height: 'fit-content'
      }}
    >
      <Skeleton variant="rectangular" width={400} height={35} />
    </Box>
    <Box sx={{ width: '100%', height: 'fit-content' }}>
      <Paper sx={{ width: '100%', mb: 2, height: 'fit-content' }}>
        <Grid container xs={12}>
          <Grid
            item
            xs={4}
            sx={{
              placeItems: 'center'
            }}
          ></Grid>
          <Grid item xs={3} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Skeleton variant="rectangular" width={50} height={20} />
          </Grid>
          <Grid item xs={5} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Skeleton variant="rectangular" width={50} height={35} />
          </Grid>
        </Grid>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
            <TableHead>
              <TableRow>
                {new Array(8).map((_value, index) => (
                  <TableCell key={index.toString()}>
                    <Skeleton variant="rectangular" width={50} height={20} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {new Array(10).fill(0).map((_row, index) => {
                return (
                  <TableRow tabIndex={-1} key={index}>
                    {new Array(9).fill(0).map((_value, s) => (
                      <TableCell id={s.toString()} key={`${index}-${s}`}>
                        <Skeleton variant="rectangular" width={50} height={20} />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  </div>
);
