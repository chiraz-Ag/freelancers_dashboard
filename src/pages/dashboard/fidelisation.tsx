import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, useTheme, Avatar } from "@mui/material";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Papa from "papaparse";
import LoyaltyIcon from "@mui/icons-material/Loyalty";

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
        marginBottom: 2,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

const FidelisationPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [geoData, setGeoData] = useState<any>(null);
  const theme = useTheme();

  // État pour pays survolé (pour affichage tooltip)
  const [hoveredCountry, setHoveredCountry] = useState<{
    name: string;
    count: number;
  } | null>(null);

  const regionNameMap: Record<string, string> = {
    USA: "United States of America",
    UK: "United Kingdom",
    Russia: "Russian Federation",
    Iran: "Iran, Islamic Republic of",
    "South Korea": "Korea, Republic of",
    "North Korea": "Korea, Democratic People's Republic of",
    Venezuela: "Venezuela, Bolivarian Republic of",
    Syria: "Syrian Arab Republic",
    Czechia: "Czech Republic",
    "Ivory Coast": "Côte d'Ivoire",
    Laos: "Lao People's Democratic Republic",
    Bolivia: "Bolivia, Plurinational State of",
    Tanzania: "Tanzania, United Republic of",
  };

  useEffect(() => {
    Papa.parse("/data/freelancer_earnings_bd.csv", {
      download: true,
      header: true,
      complete: (results) => setData(results.data as any[]),
    });

    fetch("/data/world-countries-sans-antarctica.json")
      .then((res) => res.json())
      .then(setGeoData);
  }, []);

  // Calcul du nombre de clients par région (avec mapping noms)
  const clientCountByRegion: Record<string, number> = {};
  data.forEach(({ Client_Region }) => {
    if (Client_Region) {
      const mappedRegion = regionNameMap[Client_Region] || Client_Region;
      clientCountByRegion[mappedRegion] =
        (clientCountByRegion[mappedRegion] || 0) + 1;
    }
  });

  // Convertir en tableau trié par nombre décroissant
  const regionCounts = Object.entries(clientCountByRegion)
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count);

  const totalClients = data.length;
  const threshold = 0.05 * totalClients; // seuil 5%
  // Garde toutes les régions actives (au-dessus du seuil)
  const significantRegions = regionCounts.filter((r) => r.count >= threshold);

  // Création de l'échelle de couleurs (de clair à foncé)
  const counts = significantRegions.map((r) => r.count);
  const minCount = counts.length > 0 ? Math.min(...counts) : 0;
  const maxCount = counts.length > 0 ? Math.max(...counts) : 0;
  const colorScale = scaleLinear<number>()
    .domain([minCount, maxCount])
    .range(["#A569BD", "#6a1b9a"]);

  // Calcul moyennes Rehire Rate par catégorie
  const rehireByCategory: Record<string, number[]> = {};
  data.forEach(({ Job_Category, Rehire_Rate }) => {
    const r = parseFloat(Rehire_Rate);
    if (!isNaN(r)) {
      if (!rehireByCategory[Job_Category]) rehireByCategory[Job_Category] = [];
      rehireByCategory[Job_Category].push(r);
    }
  });

  const rehireAverages = Object.entries(rehireByCategory).map(
    ([category, values]) => ({
      category,
      average: values.reduce((sum, v) => sum + v, 0) / values.length,
    })
  );

  // Calcul moyenne globale Rehire Rate (sécurisé)
  const avgRehireRate =
    data.length > 0
      ? data.reduce((sum, row) => sum + parseFloat(row.Rehire_Rate || "0"), 0) /
        data.length
      : 0;

  // Sécuriser reduce sur tableau vide avec valeur initiale
  const topCategory =
    rehireAverages.length > 0
      ? rehireAverages.reduce((best, curr) =>
          curr.average > best.average ? curr : best
        ).category
      : "N/A";

  return (
    <Box
      sx={{
        marginLeft: "240px",
        marginTop: "64px",
        p: 2,
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
          gap: 2,
        }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "#f8bbd0", color: "#fff" }}>
            <LoyaltyIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Client Loyalty & Satisfaction
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This dashboard highlights client loyalty trends and regional
              distributions based on rehire rate data.
            </Typography>
          </Box>
        </Box>

        {/* KPI Section */}
        <SectionCard title="Key Loyalty Metrics">
          <Box
            display="flex"
            justifyContent="space-around"
            flexWrap="wrap"
            gap={2}
          >
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                {totalClients}
              </Typography>
              <Typography variant="caption">Total Clients</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                {avgRehireRate.toFixed(2)}%
              </Typography>
              <Typography variant="caption">Avg Rehire Rate</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                {topCategory}
              </Typography>
              <Typography variant="caption">Top Loyalty Category</Typography>
            </Box>
          </Box>
        </SectionCard>

        {/* Map Section */}
        <SectionCard title="Regions with the Most Clients">
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {/* Carte */}
            <Box
              sx={{
                flex: 1,
                minWidth: "300px",
                height: 280,
                position: "relative",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#1a1a1a" : "#f5f5f5",
                borderRadius: 2,
              }}
            >
              {geoData ? (
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{ scale: 120 }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <Geographies geography={geoData}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const name = geo.properties.name;
                        const match = significantRegions.find(
                          (r) => r.region.toLowerCase() === name.toLowerCase()
                        );
                        const value = match?.count ?? 0;
                        const fillColor =
                          value > 0 ? colorScale(value) : "#EEE";

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={fillColor}
                            stroke="#fff"
                            strokeWidth={0.5}
                            onMouseEnter={() =>
                              setHoveredCountry({ name, count: value })
                            }
                            onMouseLeave={() => setHoveredCountry(null)}
                            style={{
                              default: { outline: "none" },
                              hover: { fill: "#5e35b1", outline: "none" }, // violet foncé hover
                              pressed: { outline: "none" },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ComposableMap>
              ) : (
                <Typography>Loading map…</Typography>
              )}

              {hoveredCountry && (
                <Box
                  sx={{
                    position: "absolute",
                    background: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    padding: "4px 8px",
                    borderRadius: 1,
                    fontSize: "0.8rem",
                    top: 90,
                    right: 100,
                    boxShadow: theme.shadows[3],
                    zIndex: 10,
                  }}
                >
                  {hoveredCountry.name}: {hoveredCountry.count} clients
                </Box>
              )}
            </Box>

            {/* Légende latérale */}
            <Box
              sx={{
                width: 250,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                backgroundColor:
                  theme.palette.mode === "dark" ? "#2a2a2a" : "#fafafa",
                borderRadius: 2,
                padding: 1,
                height: 280,
                overflowY: "auto",
                boxShadow: theme.shadows[1],
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Top Regions
              </Typography>
              {significantRegions
                .sort((a, b) => b.count - a.count)
                .map((r) => (
                  <Box
                    key={r.region}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.875rem",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      cursor: "default",
                      backgroundColor:
                        hoveredCountry?.name === r.region
                          ? "#ede7f6"
                          : "transparent", // léger mauve au hover dans légende
                      transition: "background 0.2s",
                    }}
                  >
                    <span>{r.region}</span>
                    <span>{r.count}</span>
                  </Box>
                ))}
            </Box>
          </Box>

          {/* Légende du dégradé */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {minCount}
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                height: 8,
                mx: 1,
                background: `linear-gradient(to right,rgb(211, 176, 216), #6a1b9a)`,
                borderRadius: 1,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {maxCount}
            </Typography>
          </Box>
        </SectionCard>
        {/* Bar Chart Section */}
        <SectionCard title="Average Rehire Rate by Job Category">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rehireAverages}>
              <XAxis
                dataKey="category"
                angle={-30}
                textAnchor="end"
                height={80}
                tick={{ fill: theme.palette.text.primary }}
              />
              <YAxis tick={{ fill: theme.palette.text.primary }} />
              <Tooltip
                contentStyle={{
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#2d2d2d" : "#fff",
                  border: "none",
                  borderRadius: 2,
                  color: theme.palette.text.primary,
                  fontSize: "13px",
                }}
              />
              <Bar dataKey="average" fill="#D8BFD8" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </Box>
    </Box>
  );
};

export default FidelisationPage;
