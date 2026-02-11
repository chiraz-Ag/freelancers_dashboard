import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";
import Papa from "papaparse";
import { Paper, Typography, Box, Button } from "@mui/material";

const CSV_FILE_PATH = "/data/freelancer_earnings_bd.csv";

const Data = () => {
  const [data, setData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCSVData = async () => {
      try {
        const response = await fetch(CSV_FILE_PATH);
        const csvText = await response.text();

        const parsedData = Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });

        if (parsedData.data.length > 0) {
          setData(parsedData.data);
          setDisplayData(parsedData.data.slice(0, 500));
        }
      } catch (error) {
        console.error("Erreur lors du chargement du fichier CSV :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCSVData();
  }, []);

  const loadMoreData = () => {
    setDisplayData(data.slice(0, displayData.length + 500));
  };

  const columns = [
    { field: "Freelancer_ID", headerName: "ID", width: 100 },
    { field: "Job_Category", headerName: "Job Category", width: 150 },
    { field: "Platform", headerName: "Platform", width: 130 },
    { field: "Experience_Level", headerName: "Experience Level", width: 160 },
    { field: "Client_Region", headerName: "Client Region", width: 130 },
    { field: "Payment_Method", headerName: "Payment Method", width: 150 },
    { field: "Job_Completed", headerName: "Jobs Completed", width: 140 },
    { field: "Earnings_USD", headerName: "Earnings (USD)", width: 140 },
    { field: "Hourly_Rate", headerName: "Hourly Rate", width: 130 },
    { field: "Job_Success_Rate", headerName: "Success Rate", width: 140 },
    { field: "Client_Rating", headerName: "Client Rating", width: 130 },
    {
      field: "Job_Duration_Days",
      headerName: "Job Duration (Days)",
      width: 180,
    },
    { field: "Project_Type", headerName: "Project Type", width: 130 },
    { field: "Rehire_Rate", headerName: "Rehire Rate", width: 130 },
    { field: "Marketing_Spend", headerName: "Marketing Spend", width: 150 },
  ];

  return (
    // ✅ Remplacé <div> par <Box> avec thème
    <Box
      sx={{
        width: "100%",
        pt: "80px", // paddingTop: 80px
        bgcolor: "background.default", // ← Fond qui suit le thème !
        minHeight: "100vh",
        px: 2, // un peu de padding horizontal si besoin
      }}
    >
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h5" gutterBottom>
          Freelancer Data Table
        </Typography>

        {loading ? (
          <LinearProgress />
        ) : (
          <DataGrid
            getRowId={(row) => row.Freelancer_ID}
            rows={displayData}
            columns={columns}
            pageSizeOptions={[10, 25, 50, 100]}
            pagination
            sx={{
              // Optionnel : s'assurer que le DataGrid suit le thème
              backgroundColor: "background.paper",
              color: "text.primary",
              border: "none",
            }}
          />
        )}
      </Paper>

      {!loading && displayData.length < data.length && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={loadMoreData}
            sx={{ textTransform: "none" }}
          >
            Load more data
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Data;
