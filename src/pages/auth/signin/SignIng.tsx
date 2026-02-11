import React from "react";
import { Box, Typography, Button, Avatar, Paper } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";

const SignIn = () => {
  const { status } = useSession();
  const router = useRouter();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Si l’utilisateur est déjà connecté, on ne rend rien
  if (status === "authenticated") {
    return null;
  }

  if (status === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  // Couleurs
  const primaryColor = isDarkMode ? "#7b3f61" : "#f8bbd0";
  const secondaryColor = isDarkMode ? "#9d587d" : "#ec407a";
  const cardBg = isDarkMode ? "#2d2d2d" : "#fff";
  const textColor = isDarkMode ? "#fff" : "#333";
  const iconColor = isDarkMode ? "#f8bbd0" : "#7b3f61";
  const avatarBg = "#f8bbd0";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "112vh",
        p: 3,
        backgroundColor: theme.palette.background.default,
        color: textColor,
        transition: "background-color 0.5s ease",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 450,
          py: 4,
          px: 12,
          borderRadius: 3,
          backgroundColor: cardBg,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <Avatar
          sx={{
            bgcolor: avatarBg,
            color: "#fff",
            width: 80,
            height: 80,
            margin: "0 auto",
            boxShadow: 4,
            mb: 2,
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        >
          <DashboardIcon sx={{ fontSize: 40 }} />
        </Avatar>

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome to FreelanceScoop
        </Typography>

        <Typography
          variant="body1"
          sx={{
            opacity: 0.85,
            mb: 3,
            fontSize: "1rem",
          }}
        >
          Sign in to access your dashboard and manage performance.
        </Typography>

        <Button
          variant="contained"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          fullWidth
          sx={{
            bgcolor: primaryColor,
            color: "#fff",
            py: 1.5,
            mt: 2,
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderRadius: 2,
            boxShadow: 3,
            textTransform: "none",
            "&:hover": {
              bgcolor: secondaryColor,
              boxShadow: 4,
            },
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
          }}
        >
          <DashboardIcon sx={{ color: iconColor }} />
          Sign In with Google
        </Button>
      </Paper>
    </Box>
  );
};

export default SignIn;
