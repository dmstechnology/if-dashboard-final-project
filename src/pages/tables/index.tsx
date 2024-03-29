// ** MUI Imports
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import GetAppIcon from '@mui/icons-material/GetApp';
import FilterListIcon from '@mui/icons-material/FilterList';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';


// ** Demo Components Imports
// import TableStickyHeader from 'src/views/tables/TableStickyHeader'
import { IconButton, Button, TextField, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Dialog from '@mui/material/Dialog';

const MUITable = () => {
  const [openModal, setOpenModal] = useState(false); // State for modal open/close
  const [inputType, setInputType] = useState('text');

  const handleTextFieldClick = () => {
    setInputType('date');
  };

  const handleTextFieldBlur = ()=>{
    setInputType('text');
  }

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };


  // function handleApplyFilter(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
  //   throw new Error('Function not implemented.')
  // }


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<any[]>([]);



  const filterData = () => {
    const leadName = (document.getElementById('leadName') as HTMLInputElement)?.value;
    const intentScore = (document.getElementById('intentScore') as HTMLInputElement)?.value;
    const agentCalledLast = (document.getElementById('agentCalledLast') as HTMLInputElement)?.value;
    const dateOfLastCall = (document.getElementById('dateOfLastCall') as HTMLInputElement)?.value;

    // Fetch data with applied filters
    // Example:
    fetch(`http://13.127.143.196:8501/api/filter?leadName=${leadName}&intentScore=${intentScore}&agentCalledLast=${agentCalledLast}&dateOfLastCall=${dateOfLastCall}`)
      .then(response => response.json())
      .then(data => {
        setData(data);
        // setPage(0);
        console.log(data);
      })
      .catch(error => console.error('Error applying filter:', error));

    handleCloseModal(); 
  };



function getCurrentTimestamp() {
    const now = new Date();
    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + '_' + now.getHours() + '-' + now.getMinutes() + '-' + now.getSeconds();
}


  function downloadCSV() {
    const rows = [];

    // Add header row
    const headerRow = ['Lead', 'Lead Name', 'Intent Score', 'Agent who called last', 'Date of Last Call', 'Summary of calls'];
    rows.push(headerRow.join(','));

    // Add data rows
    data.forEach(row => {
        const rowData = [
            row['Lead'] || '', // Add conditions to handle empty or undefined values
            row['Lead Name'] || '',
            row['Intent Score (out of 4)'] || '',
            row['Agent who called last'] || '',
            row['Date of Last Call'] || '',
            row['Summary of calls'] || ''
        ];
        rows.push(rowData.join(','));
    });

    // Convert rows to CSV string
    const csvString = rows.join('\n');

    // Create a blob with the CSV data
    const blob = new Blob([csvString], { type: 'text/csv' });

    // Create a link element to download the CSV file
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'csv_data' + getCurrentTimestamp() + '.csv';

    // Append the link to the document body and trigger the click event
    document.body.appendChild(link);
    link.click();

    // Clean up by removing the link element
    document.body.removeChild(link);
}


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
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
         
        </Typography>
        <Typography variant='body2'>CSV Data</Typography>
      </Grid>
     
    
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title='Data' 
            titleTypographyProps={{ variant: 'h6' }} 
            action={
              <React.Fragment>
                {/* Filter button */}
                <IconButton aria-label='filter' onClick={handleOpenModal}>
                  <FilterListIcon />
                </IconButton>
                {/* Download button */}
                <IconButton aria-label='download' onClick={downloadCSV}>
                  <GetAppIcon />
                </IconButton>
              </React.Fragment>
            }
          />
          {/* Your table component */}
          {/* <TableStickyHeader /> */}


          
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
                <TableCell>{row["Lead"] == '' ? row["Lead"] : row["Lead "]}</TableCell>
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


        </Card>
      </Grid>

      <Dialog open={openModal} onClose={handleCloseModal}>
  {/* Modal Title */}
  <DialogTitle>Filter Data</DialogTitle>
  {/* Modal Content */}
  <DialogContent>
    {/* Lead Name filter */}
    <TextField label="Lead Name" id="leadName" variant="outlined" fullWidth margin="normal" />
    {/* Intent Score filter */}
    <TextField label="Intent Score" id="intentScore" variant="outlined" fullWidth margin="normal" />
    {/* Agent who called last filter */}
    <TextField label="Agent who called last" id="agentCalledLast" variant="outlined" fullWidth margin="normal" />
    {/* Date of Last Call filter */}
    <TextField
      label="Date of Last Call"
      variant="outlined"
      id='dateOfLastCall'
      type={inputType}
      fullWidth
      margin="normal"
      onClick={handleTextFieldClick}
      onBlur={handleTextFieldBlur}
    />

  </DialogContent>
  {/* Modal Actions */}
  <DialogActions>
    {/* Close Button */}
    <Button onClick={handleCloseModal} color="primary">
      Close
    </Button>
    {/* Apply Filter Button (Optional) */}
    <Button color="primary" onClick={filterData}>
      Apply Filter
    </Button>
  </DialogActions>
</Dialog>

     
    </Grid>
  )
}

export default MUITable
