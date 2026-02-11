import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import Papa from "papaparse";
import TungstenIcon from "@mui/icons-material/Tungsten";

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
        flex: 1,
        p: 1.5,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#fff"
            : theme.palette.background.paper,
        borderRadius: 2,
        height: "100%", // Garde la hauteur flexible par défaut
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

// KpiCard adaptée au thème actuel
const KpiCard = ({
  title,
  value,
}: {
  title: string;
  value: React.ReactNode;
}) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        height: 120,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:
          theme.palette.mode === "light"
            ? "#fff"
            : theme.palette.background.paper,
        boxShadow: 3,
        borderRadius: 3,
        py: 2,
      }}
    >
      <CardContent sx={{ textAlign: "center", p: 0 }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          mb={0.5}
          color="text.primary"
        >
          {title}
        </Typography>
        <Typography variant="h4" sx={{ color: "#f8bbd0" }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Overview = () => {
  const theme = useTheme();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState("");
  const [selectedJobCategory, setSelectedJobCategory] = useState("");

  // Palette pour le pie chart
  const PIE_COLORS = ["#7b3f61", "#9d587d", "#bc8f8f", "#e8a0bf", "#f4d2d7"];
  const AVATAR_BG = "#f8bbd0"; // Rose toujours visible dans les deux modes

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(CSV_FILE_PATH);
        const text = await res.text();
        const parsed = Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });
        setData(parsed.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const calculateMetrics = () => {
    if (!data.length) return {};
    const filtered = data.filter((row) => {
      return (
        (!selectedPlatform || row.Platform === selectedPlatform) &&
        (!selectedExperienceLevel ||
          row.Experience_Level === selectedExperienceLevel) &&
        (!selectedJobCategory || row.Job_Category === selectedJobCategory)
      );
    });

    const totalFreelancers = new Set(filtered.map((r) => r.Freelancer_ID)).size;
    const platforms = [...new Set(filtered.map((r) => r.Platform))];
    const jobCategories = [...new Set(filtered.map((r) => r.Job_Category))];
    const freelancerByCategory = jobCategories.map((cat) => ({
      category: cat,
      count: filtered.filter((r) => r.Job_Category === cat).length,
    }));
    const freelancerByPlatform = platforms.map((plat) => ({
      platform: plat,
      count: filtered.filter((r) => r.Platform === plat).length,
    }));

    return {
      totalFreelancers,
      platforms,
      jobCategories,
      freelancerByCategory,
      freelancerByPlatform,
    };
  };

  const metrics = calculateMetrics();
  if (loading) return <div>Loading…</div>;

  return (
    <Box
      sx={{
        ml: "240px",
        mt: "64px",
        p: 4,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        color: theme.palette.text.primary,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ bgcolor: AVATAR_BG, color: "#fff" }}>
            <TungstenIcon />
          </Avatar>
          <Typography variant="h4" fontWeight="bold">
            Overview
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
              {metrics.platforms?.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
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
              {metrics.experienceLevels?.map((l) => (
                <MenuItem key={l} value={l}>
                  {l}
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
              {metrics.jobCategories?.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={3} mb={3}>
          {[
            { title: "Total Freelancers", value: metrics.totalFreelancers },
            { title: "Platforms", value: metrics.platforms?.length },
            { title: "Job Categories", value: metrics.jobCategories?.length },
          ].map(({ title, value }) => (
            <Grid item xs={12} sm={6} md={4} key={title}>
              <KpiCard title={title} value={String(value)} />
            </Grid>
          ))}
        </Grid>

        {/* Graphiques côte à côte */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Freelancers by Job Category - Bar Chart */}
          <Box sx={{ flex: 1 }}>
            <SectionCard title="Freelancers by Job Category">
              <Box sx={{ width: "100%", height: 300 }}>
                {" "}
                {/* Fix height */}
                <ResponsiveContainer>
                  <BarChart
                    data={metrics.freelancerByCategory}
                    layout="vertical"
                    margin={{ top: 20, right: 50, left: 1, bottom: 30 }}
                  >
                    <XAxis
                      type="number"
                      tick={{ fill: theme.palette.text.primary }}
                    />
                    <YAxis
                      type="category"
                      dataKey="category"
                      width={150}
                      interval={0}
                      tick={({ x, y, payload }) => (
                        <text
                          x={x - 10}
                          y={y + 5}
                          textAnchor="end"
                          fontSize={12}
                          fill={theme.palette.text.primary}
                        >
                          {payload.value.slice(0, 28) +
                            (payload.value.length > 28 ? "…" : "")}
                        </text>
                      )}
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
                    <Bar dataKey="count" fill={PIE_COLORS[4]} barSize={22} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </SectionCard>
          </Box>

          {/* Freelancers by Platform - Pie Chart */}
          <Box sx={{ flex: 1 }}>
            <SectionCard title="Freelancers by Platform">
              <Box sx={{ width: "100%", height: 300 }}>
                {" "}
                {/* Fix height */}
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={metrics.freelancerByPlatform}
                      dataKey="count"
                      nameKey="platform"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={30}
                      labelLine={false}
                      isAnimationActive
                      label={({ name, percent }) =>
                        `${name.slice(0, 12)} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {metrics.freelancerByPlatform.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                          stroke="#fff"
                          strokeWidth={1.5}
                        />
                      ))}
                    </Pie>
                    <ReTooltip
                      contentStyle={{
                        backgroundColor:
                          theme.palette.mode === "dark" ? "#2d2d2d" : "#fff",
                        border: "none",
                        borderRadius: 3,
                        color: theme.palette.text.primary,
                        fontSize: "13px",
                      }}
                      formatter={(v: number) => [`${v} freelancers`]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </SectionCard>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Overview;
