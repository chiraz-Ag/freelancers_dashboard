import React, { useEffect, useState } from "react";
import BarChartIcon from "@mui/icons-material/BarChart";
import Papa from "papaparse";
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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
} from "recharts";

const CSV_FILE_PATH = "/data/freelancer_earnings_bd.csv";

// SectionCard adaptée au thème actuel
const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
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

// KpiCard : fond gris clair ou blanc selon le mode
const KpiCard = ({ title, value }: { title: string; value: string }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        height: 120,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.background.paper,
        boxShadow: 3,
        borderRadius: 3,
        paddingY: 2,
      }}
    >
      <CardContent sx={{ textAlign: "center", padding: "0 !important" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="h4" color="primary">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Performance = () => {
  const theme = useTheme();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState("");
  const [selectedJobCategory, setSelectedJobCategory] = useState("");

  // Palette de couleurs bois de rose
  const chartColors = ["#7b3f61", "#bc8f8f", "#9d587d", "#bc8f8f", "#bc8f8f"];

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
    const matchExperience = selectedExperienceLevel
      ? row.Experience_Level === selectedExperienceLevel
      : true;
    const matchCategory = selectedJobCategory
      ? row.Job_Category === selectedJobCategory
      : true;
    return matchPlatform && matchExperience && matchCategory;
  });

  const calculateKpis = () => {
    if (!filteredData.length) return {};
    const avgSuccessRate =
      filteredData.reduce((sum, row) => sum + (row.Job_Success_Rate || 0), 0) /
      filteredData.length;
    const avgDuration =
      filteredData.reduce((sum, row) => sum + (row.Job_Duration_Days || 0), 0) /
      filteredData.length;
    const performanceScore =
      filteredData.reduce(
        (sum, row) =>
          sum + (row.Client_Rating || 0) * (row.Job_Success_Rate || 0),
        0
      ) / filteredData.length;
    return {
      avgSuccessRate: avgSuccessRate.toFixed(1),
      avgDuration: avgDuration.toFixed(1),
      performanceScore: performanceScore.toFixed(1),
    };
  };

  const getBarDataByType = () => {
    const groups: Record<string, { totalDuration: number; count: number }> = {};
    filteredData.forEach((row) => {
      const type = row.Project_Type;
      if (!groups[type]) groups[type] = { totalDuration: 0, count: 0 };
      groups[type].totalDuration += row.Job_Duration_Days || 0;
      groups[type].count += 1;
    });
    return Object.entries(groups).map(([type, { totalDuration, count }]) => ({
      name: type,
      value: parseFloat((totalDuration / count).toFixed(1)),
    }));
  };

  const getSuccessRateByExperience = () => {
    const groups: Record<string, { totalSuccess: number; count: number }> = {};
    filteredData.forEach((row) => {
      const level = row.Experience_Level;
      if (!groups[level]) groups[level] = { totalSuccess: 0, count: 0 };
      groups[level].totalSuccess += row.Job_Success_Rate || 0;
      groups[level].count += 1;
    });
    return Object.entries(groups).map(([level, { totalSuccess, count }]) => ({
      name: level,
      value: parseFloat((totalSuccess / count).toFixed(1)),
    }));
  };

  const kpis = calculateKpis();
  const barData = getBarDataByType();
  const successByExp = getSuccessRateByExperience();

  if (loading) return <div>Loading...</div>;

  return (
    <Box
      sx={{
        marginLeft: "240px",
        marginTop: "64px",
        p: 4,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        color: theme.palette.text.primary,
      }}
    >
      <Box maxWidth="1200px" margin="auto">
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <Avatar sx={{ bgcolor: "#f8bbd0", color: "#fff" }}>
            <BarChartIcon />
          </Avatar>
          <Typography variant="h4" fontWeight="bold">
            Performance
          </Typography>
        </Box>

        {/* Filtres */}
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
            <InputLabel>Experience Level</InputLabel>
            <Select
              value={selectedExperienceLevel}
              onChange={(e) => setSelectedExperienceLevel(e.target.value)}
              label="Experience Level"
            >
              <MenuItem value="">All Levels</MenuItem>
              {[...new Set(data.map((d) => d.Experience_Level))].map(
                (level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                )
              )}
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
            <KpiCard
              title="Avg. Success Rate"
              value={kpis.avgSuccessRate + " %"}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <KpiCard title="Avg. Duration" value={kpis.avgDuration + " days"} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <KpiCard title="Performance Score" value={kpis.performanceScore} />
          </Grid>
        </Grid>

        {/* Graphiques en pie chart */}
        <Grid container spacing={3}>
          {/* Avg. Duration by Project Type - Pie Chart */}
          <Grid item xs={12} md={6}>
            <SectionCard title="Avg. Duration by Project Type">
              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={barData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      isAnimationActive
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {barData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={chartColors[index % chartColors.length]}
                          stroke="#fff"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <ReTooltip
                      formatter={(value: number) => [`${value} days`]}
                      contentStyle={{
                        backgroundColor:
                          theme.palette.mode === "dark" ? "#2d2d2d" : "#fff",
                        border: "none",
                        borderRadius: 3,
                        color: theme.palette.text.primary,
                        fontSize: "13px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              {/* Légende manuelle */}
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {barData.map(({ name }, index) => (
                  <Box
                    key={name}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mr: 2,
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        bgcolor: chartColors[index % chartColors.length],
                        borderRadius: "50%",
                        mr: 1,
                      }}
                    />
                    <Typography variant="caption">{name}</Typography>
                  </Box>
                ))}
              </Box>
            </SectionCard>
          </Grid>

          {/* Success Rate by Experience - Pie Chart */}
          <Grid item xs={12} md={6}>
            <SectionCard title="Success Rate by Experience">
              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={successByExp}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      isAnimationActive
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {successByExp.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={chartColors[index % chartColors.length]}
                          stroke="#fff"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <ReTooltip
                      formatter={(value: number) => [
                        `${value}%`,
                        "Success Rate",
                      ]}
                      contentStyle={{
                        backgroundColor:
                          theme.palette.mode === "dark" ? "#2d2d2d" : "#fff",
                        border: "none",
                        borderRadius: 3,
                        color: theme.palette.text.primary,
                        fontSize: "13px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              {/* Légende manuelle */}
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {successByExp.map(({ name }, index) => (
                  <Box
                    key={name}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mr: 2,
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        bgcolor: chartColors[index % chartColors.length],
                        borderRadius: "50%",
                        mr: 1,
                      }}
                    />
                    <Typography variant="caption">{name}</Typography>
                  </Box>
                ))}
              </Box>
            </SectionCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Performance;
