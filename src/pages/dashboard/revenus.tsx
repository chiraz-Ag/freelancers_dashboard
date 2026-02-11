import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Avatar,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  useTheme,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";
import Papa from "papaparse";
import PaidIcon from "@mui/icons-material/Paid";

const CSV_FILE_PATH = "/data/freelancer_earnings_bd.csv";
const chartColors = ["#f4d2d7", "#f4d2d7", "#bc8f8f", "#e8a0bf", "#f4d2d7"];

const Revenus = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedJobCategory, setSelectedJobCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(CSV_FILE_PATH);
        const text = await response.text();
        const parsed = Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });
        setData(parsed.data);
      } catch (err) {
        console.error("Error loading CSV:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter((row) => {
    const matchPlatform = selectedPlatform
      ? row.Platform === selectedPlatform
      : true;
    const matchCategory = selectedJobCategory
      ? row.Job_Category === selectedJobCategory
      : true;
    return matchPlatform && matchCategory;
  });

  const kpis = () => {
    if (!filteredData.length) return {};

    const totalEarnings = filteredData.reduce(
      (sum, row) => sum + (row.Earnings_USD || 0),
      0
    );
    const avgRate =
      filteredData.reduce((sum, row) => sum + (row.Hourly_Rate || 0), 0) /
      filteredData.length;

    const paymentCount = {};
    filteredData.forEach((row) => {
      const method = row.Payment_Method;
      paymentCount[method] = (paymentCount[method] || 0) + 1;
    });

    const mostUsedMethod = Object.entries(paymentCount).reduce((a, b) =>
      b[1] > a[1] ? b : a
    )[0];

    return {
      totalEarnings: totalEarnings.toFixed(2) + " $",
      avgHourlyRate: avgRate.toFixed(2) + " $/hr",
      mostUsedPayment: mostUsedMethod,
    };
  };

  const earningsByCategory = () => {
    const map = {};
    filteredData.forEach((row) => {
      const cat = row.Job_Category;
      if (!map[cat]) map[cat] = { total: 0, count: 0 };
      map[cat].total += row.Earnings_USD || 0;
      map[cat].count += 1;
    });
    return Object.entries(map).map(([category, { total, count }]) => ({
      category,
      earnings: parseFloat((total / count).toFixed(2)),
    }));
  };

  const hourlyRateByPlatform = () => {
    const map = {};
    filteredData.forEach((row) => {
      const platform = row.Platform;
      if (!map[platform]) map[platform] = { total: 0, count: 0 };
      map[platform].total += row.Hourly_Rate || 0;
      map[platform].count += 1;
    });
    return Object.entries(map).map(([platform, { total, count }]) => ({
      platform,
      avgRate: parseFloat((total / count).toFixed(2)),
    }));
  };

  const kpiValues = kpis();
  const barDataCategory = earningsByCategory();
  const barDataRate = hourlyRateByPlatform();

  if (loading) return <div>Loading...</div>;

  return (
    <Box
      sx={{
        marginLeft: "240px",
        marginTop: "64px",
        padding: 4,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        color: theme.palette.text.primary,
      }}
    >
      <Box maxWidth="1200px" margin="auto">
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <Avatar sx={{ bgcolor: "#f8bbd0", color: "#fff" }}>
            <PaidIcon />
          </Avatar>
          <Typography variant="h4" fontWeight="bold">
            Payments & Revenue
          </Typography>
        </Box>

        {/* Filters */}
        <Box display="flex" gap={3} mb={4}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Platform</InputLabel>
            <Select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              label="Platform"
            >
              <MenuItem value="">All Platforms</MenuItem>
              {[...new Set(data.map((d) => d.Platform))].map((platform) => (
                <MenuItem key={platform} value={platform}>
                  {platform}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Job Category</InputLabel>
            <Select
              value={selectedJobCategory}
              onChange={(e) => setSelectedJobCategory(e.target.value)}
              label="Job Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {[...new Set(data.map((d) => d.Job_Category))].map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={4}>
            <KpiCard title="Total Earnings" value={kpiValues.totalEarnings} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <KpiCard title="Avg. Hourly Rate" value={kpiValues.avgHourlyRate} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <KpiCard
              title="Most Used Payment Method"
              value={kpiValues.mostUsedPayment}
            />
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          {/* Earnings by Job Category */}
          <Grid item xs={12} md={6}>
            <SectionCard title="Earnings by Job Category">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barDataCategory} layout="vertical">
                  <XAxis
                    type="number"
                    tick={{ fill: theme.palette.text.primary }}
                  />
                  <YAxis
                    type="category"
                    dataKey="category"
                    tick={{ fill: theme.palette.text.primary }}
                    width={150}
                  />
                  <ReTooltip
                    contentStyle={{
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#2d2d2d" : "#fff",
                      border: "none",
                      borderRadius: 3,
                      color: theme.palette.text.primary,
                      fontSize: "13px",
                    }}
                  />
                  <Bar
                    dataKey="earnings"
                    name="Earnings"
                    fill={chartColors[0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>
          </Grid>

          {/* Hourly Rate by Platform */}
          <Grid item xs={12} md={6}>
            <SectionCard title="Hourly Rate by Platform">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barDataRate} layout="vertical">
                  <XAxis
                    type="number"
                    tick={{ fill: theme.palette.text.primary }}
                  />
                  <YAxis
                    type="category"
                    dataKey="platform"
                    tick={{ fill: theme.palette.text.primary }}
                    width={150}
                  />
                  <ReTooltip
                    contentStyle={{
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#2d2d2d" : "#fff",
                      border: "none",
                      borderRadius: 3,
                      color: theme.palette.text.primary,
                      fontSize: "13px",
                    }}
                  />
                  <Bar
                    dataKey="avgRate"
                    name="Hourly Rate"
                    fill={chartColors[1]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const KpiCard = ({ title, value }) => {
  return (
    <Card
      sx={{
        height: 120,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: useTheme().palette.background.paper,
        boxShadow: 3,
        borderRadius: 3,
        py: 2,
      }}
    >
      <CardContent sx={{ textAlign: "center", p: 0 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
          {title}
        </Typography>
        <Typography variant="h4" color="primary">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

const SectionCard = ({ title, children }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        marginBottom: 3,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

export default Revenus;
