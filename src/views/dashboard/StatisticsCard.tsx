import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Grid, Typography, Avatar } from '@mui/material';
import AccountOutline from 'mdi-material-ui/AccountOutline';
import CellphoneLink from 'mdi-material-ui/CellphoneLink';
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd';
import TrendingUp from 'mdi-material-ui/TrendingUp';



const StatisticsCard = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      alert('Please select a file.');
      return;
    }
  
    const formData = new FormData();
    formData.append('csv_file', file);

    try {
      console.log('Sending request to:', 'http://13.127.143.196:8501/api/upload');
      const response = await fetch('http://13.127.143.196:8501/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      const data = await response.json();
      console.log('File uploaded successfully:', data);
      alert("File uploaded successfully");
      location.href='/tables';
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Card>
      <CardHeader title="Upload CSV" />
      <CardContent>
        <Grid container spacing={3}>
          <form onSubmit={handleSubmit}>
          <br/>
            <Grid item xs={6} sm={6}>
              <input type="file" name="csv_file" onChange={handleFileChange} />
            </Grid>
            <br/>
            <Grid item xs={6} sm={6}>
              <input type="submit" value="Upload" className="submit_btn" />
            </Grid>
          </form>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
