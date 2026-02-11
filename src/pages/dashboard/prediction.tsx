import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  useTheme,
  Alert,
  Slider,
  Stack,
} from "@mui/material";
import Papa from "papaparse";

const Prediction = () => {
  const [data, setData] = useState<any[]>([]);
  const [jobCategory, setJobCategory] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [marketingSpend, setMarketingSpend] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [target, setTarget] = useState("Rehire_Rate");
  const [prediction, setPrediction] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const theme = useTheme();

  useEffect(() => {
    Papa.parse("/data/freelancer_earnings_bd.csv", {
      download: true,
      header: true,
      complete: (results) => setData(results.data as any[]),
    });
  }, []);

  const handlePredict = () => {
    setError("");
    setPrediction(null);

    if (!jobCategory || !experienceLevel) {
      setError("Please fill in all fields before predicting.");
      return;
    }

    // On autorise marketingSpend et hourlyRate à être 0 (mais tu peux changer)
    if (marketingSpend <= 0 || hourlyRate <= 0) {
      setError("Marketing Spend and Hourly Rate must be greater than 0.");
      return;
    }

    const filtered = data.filter(
      (d) =>
        d.Job_Category === jobCategory &&
        d.Experience_Level === experienceLevel &&
        d.Marketing_Spend &&
        d.Hourly_Rate &&
        d[target]
    );

    if (filtered.length < 2) {
      setError(
        "Not enough data to make a prediction with the selected criteria."
      );
      return;
    }

    const x1_raw = filtered.map((d) => parseFloat(d.Marketing_Spend));
    const x2_raw = filtered.map((d) => parseFloat(d.Hourly_Rate));
    const y = filtered.map((d) => parseFloat(d[target]));

    const maxX1 = Math.max(...x1_raw);
    const maxX2 = Math.max(...x2_raw);

    const x1 = x1_raw.map((v) => v / maxX1);
    const x2 = x2_raw.map((v) => v / maxX2);

    const n = filtered.length;

    const x1Mean = x1.reduce((a, b) => a + b, 0) / n;
    const x2Mean = x2.reduce((a, b) => a + b, 0) / n;
    const yMean = y.reduce((a, b) => a + b, 0) / n;

    const covX1Y = x1.reduce(
      (sum, xi, i) => sum + (xi - x1Mean) * (y[i] - yMean),
      0
    );
    const varX1 = x1.reduce((sum, xi) => sum + Math.pow(xi - x1Mean, 2), 0);

    const covX2Y = x2.reduce(
      (sum, xi, i) => sum + (xi - x2Mean) * (y[i] - yMean),
      0
    );
    const varX2 = x2.reduce((sum, xi) => sum + Math.pow(xi - x2Mean, 2), 0);

    const b1 = covX1Y / varX1;
    const b2 = covX2Y / varX2;
    const a = yMean - b1 * x1Mean - b2 * x2Mean;

    const marketingNorm = marketingSpend / maxX1;
    const hourlyNorm = hourlyRate / maxX2;

    const yPred = a + b1 * marketingNorm + b2 * hourlyNorm;
    setPrediction(parseFloat(yPred.toFixed(2)));
  };

  const uniqueCategories = [...new Set(data.map((d) => d.Job_Category))].filter(
    Boolean
  );
  const uniqueExperiences = [
    ...new Set(data.map((d) => d.Experience_Level)),
  ].filter(Boolean);

  // Définir des max arbitraires pour les sliders (à adapter selon ton dataset)
  const maxMarketing = 10000; // max marketing spend
  const maxHourlyRate = 200; // max hourly rate

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
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Predict Freelancer Outcome
        </Typography>

        <TextField
          select
          label="Job Category"
          value={jobCategory}
          onChange={(e) => setJobCategory(e.target.value)}
          fullWidth
          margin="normal"
        >
          {uniqueCategories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Experience Level"
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          fullWidth
          margin="normal"
        >
          {uniqueExperiences.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {lvl}
            </MenuItem>
          ))}
        </TextField>

        {/* Slider Marketing Spend */}
        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom>
            Marketing Spend ($): {marketingSpend}
          </Typography>
          <Slider
            value={marketingSpend}
            onChange={(e, val) => setMarketingSpend(val as number)}
            min={0}
            max={maxMarketing}
            step={10}
            valueLabelDisplay="auto"
          />
        </Box>

        {/* Slider Hourly Rate */}
        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom>Hourly Rate ($): {hourlyRate}</Typography>
          <Slider
            value={hourlyRate}
            onChange={(e, val) => setHourlyRate(val as number)}
            min={0}
            max={maxHourlyRate}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>

        <TextField
          select
          label="Target to Predict"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="Rehire_Rate">Rehire Rate (%)</MenuItem>
          <MenuItem value="Earnings_USD">Estimated Earnings ($)</MenuItem>
        </TextField>

        <Button
          variant="contained"
          color="primary"
          onClick={handlePredict}
          sx={{ mt: 2 }}
        >
          Predict
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {prediction !== null && (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Prediction Result
          </Typography>

          <Typography variant="body1" mt={2} fontWeight="bold">
            Predicted {target === "Rehire_Rate" ? "Rehire Rate" : "Earnings"}:{" "}
            <span>
              {prediction} {target === "Rehire_Rate" ? "%" : "$"}
            </span>
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Prediction;
