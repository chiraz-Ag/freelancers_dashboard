import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, useTheme, Avatar } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Papa from "papaparse";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// SectionCard compact
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
        padding: 1.5,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        flex: 1, // pour prendre 50% chacun
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

const MarketingPage = () => {
  const [data, setData] = useState<any[]>([]);
  const theme = useTheme();

  useEffect(() => {
    Papa.parse("/data/freelancer_earnings_bd.csv", {
      download: true,
      header: true,
      complete: (results) => setData(results.data as any[]),
    });
  }, []);

  // Section 1 : avg Marketing_Spend by platform
  const spendByPlatform: Record<string, { total: number; count: number }> = {};
  data.forEach(({ Platform, Marketing_Spend }) => {
    const spend = parseFloat(Marketing_Spend);
    if (Platform && !isNaN(spend)) {
      if (!spendByPlatform[Platform])
        spendByPlatform[Platform] = { total: 0, count: 0 };
      spendByPlatform[Platform].total += spend;
      spendByPlatform[Platform].count += 1;
    }
  });
  const avgSpendPlatform = Object.entries(spendByPlatform).map(
    ([platform, { total, count }]) => ({
      name: platform,
      value: total / count,
    })
  );

  // Palette bois de rose
  const PIE_COLORS = ["#7b3f61", "#9d587d", "#bc8f8f", "#e8a0bf", "#f4d2d7"];

  // Section 2 : avg Earnings_USD by platform
  const earningsByPlatform: Record<string, { total: number; count: number }> =
    {};
  data.forEach(({ Platform, Earnings_USD }) => {
    const earn = parseFloat(Earnings_USD);
    if (Platform && !isNaN(earn)) {
      if (!earningsByPlatform[Platform])
        earningsByPlatform[Platform] = { total: 0, count: 0 };
      earningsByPlatform[Platform].total += earn;
      earningsByPlatform[Platform].count += 1;
    }
  });
  const avgEarningsPlatform = Object.entries(earningsByPlatform).map(
    ([platform, { total, count }]) => ({
      platform,
      average: total / count,
    })
  );

  return (
    <Box
      sx={{
        marginLeft: "240px",
        marginTop: "64px",
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
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ bgcolor: "#f8bbd0", color: "#fff" }}>
            <TrendingUpIcon />
          </Avatar>
          <Typography variant="h4" fontWeight="bold">
            Marketing Analysis
          </Typography>
        </Box>

        {/* Conteneur side-by-side */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Section 1 : PieChart */}
          <SectionCard title="Marketing Spend Distribution by Platform">
            <Box sx={{ width: "100%", height: 250 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={avgSpendPlatform}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    innerRadius={40}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {avgSpendPlatform.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={PIE_COLORS[idx % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ReTooltip
                    formatter={(value: number) => value.toFixed(2) + " USD"}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </SectionCard>

          {/* Section 2 : BarChart */}
          <SectionCard title="Average Earnings by Platform">
            <Box sx={{ width: "100%", height: 250 }}>
              <ResponsiveContainer>
                <BarChart
                  data={avgEarningsPlatform}
                  margin={{ top: 10, right: 10, bottom: 30, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="platform"
                    angle={-30}
                    textAnchor="end"
                    height={60}
                    tick={{ fill: theme.palette.text.primary }}
                  />
                  <YAxis tick={{ fill: theme.palette.text.primary }} />
                  <ReTooltip
                    formatter={(value: number) => value.toFixed(2) + " USD"}
                    contentStyle={{
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#2d2d2d" : "#fff",
                      border: "none",
                      borderRadius: 2,
                      color: theme.palette.text.primary,
                      fontSize: "13px",
                    }}
                  />
                  <Bar dataKey="average" fill="#aec6cf" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </SectionCard>
        </Box>
      </Box>
    </Box>
  );
};

export default MarketingPage;
