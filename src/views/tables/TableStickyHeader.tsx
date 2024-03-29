import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';

const TableStickyHeader = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://13.127.143.196:8501/api/fetch');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      let allData: any[] = [];

      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i]['data'].length; j++) {
          allData.push(data[i]['data'][j]);
        }
      }


      setData(allData);

      console.log(allData);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string | number; }; }) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper style={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer style={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label=''>
          <TableHead>
            <TableRow>
              <TableCell style={{width:'10%'}}>Lead</TableCell>
              <TableCell>Lead Name</TableCell>
              <TableCell>Intent Score</TableCell>
              <TableCell>Agent who called last</TableCell>
              <TableCell>Date of Last Call</TableCell>
              <TableCell>Summary of calls</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row["Lead "] }</TableCell>
                <TableCell>{row["Lead Name"]}</TableCell>
                <TableCell>{row["Intent Score (out of 4)"]}</TableCell>
                <TableCell>{row["Agent who called last"]}</TableCell>
                <TableCell>{row["Date of Last Call"]}</TableCell>
                <TableCell>{row["Summary of calls"]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableStickyHeader;
