import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import TableChartIcon from "@mui/icons-material/TableChart";
import TungstenIcon from "@mui/icons-material/Tungsten";
import BarChartIcon from "@mui/icons-material/BarChart";
import PaidIcon from "@mui/icons-material/Paid";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import NextLink from "next/link";
import Avatar from "@mui/material/Avatar";
import { signOut } from "next-auth/react";

// Liste des routes du menu
const menuRouteList = [
  "/dashboard/data",
  "/dashboard/overview",
  "/dashboard/performance",
  "/dashboard/revenus",
  "/dashboard/fidelisation",
  "/dashboard/marketing",
  "/dashboard/prediction",
];

// Titres des éléments du menu
const menuListTranslations = [
  "Data",
  "Overview",
  "Performance",
  "Payments & Revenue",
  "Loyalty",
  "Marketing & Impact",
  "Prediction",
];

// Icônes correspondantes
const menuListIcons = [
  <TableChartIcon />,
  <TungstenIcon />,
  <BarChartIcon />,
  <PaidIcon />,
  <LoyaltyIcon />,
  <TrendingUpIcon />,
  <AutoGraphIcon />,
];

const SideMenu = () => {
  const { data: session } = useSession();
  const theme = useTheme();
  const router = useRouter();

  if (!session) return null;
  if (router.pathname === "/dashboard/data") return null;

  const isDarkMode = theme.palette.mode === "dark";
  const activeBgColor = isDarkMode
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)";
  const iconColor = isDarkMode ? "#fff" : "#000";

  const handleListItemButtonClick = (text: string) => {
    if (text === "Sign Out") {
      signOut();
    }
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: theme.palette.background.paper,
          borderRight: "none",
          borderRadius: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
          overflow: "hidden", // <-- empêche scroll vertical
          paddingTop: 1,
          paddingBottom: 1,
        },
      }}
    >
      {/* En-tête */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: 2.5,
          mb: 1,
          userSelect: "none",
        }}
      >
        <Avatar sx={{ bgcolor: "#f8bbd0", color: "#fff" }}>
          <TungstenIcon />
        </Avatar>
        <Typography variant="h6" fontWeight="bold" noWrap>
          FreelanceScoop
        </Typography>
      </Box>

      {/* Liste des liens */}
      <List
        sx={{
          flexGrow: 1,
          overflow: "hidden", // pas de scroll dans la liste principale
          display: "flex",
          flexDirection: "column",
          gap: 0.3,
          px: 0.5,
        }}
      >
        {menuListTranslations.map((text, index) => {
          const isActive = router.pathname === menuRouteList[index];
          return (
            <React.Fragment key={text}>
              <ListItem disablePadding sx={{ display: "block" }}>
                <NextLink href={menuRouteList[index]} passHref legacyBehavior>
                  <a style={{ textDecoration: "none" }}>
                    <ListItemButton
                      selected={isActive}
                      onClick={() => handleListItemButtonClick(text)}
                      sx={{
                        minHeight: 44,
                        justifyContent: "initial",
                        px: 2.5,
                        backgroundColor: isActive
                          ? activeBgColor
                          : "transparent",
                        transition: "background-color 0.3s ease",
                        borderRadius: "8px",
                        mb: 0,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 3,
                          justifyContent: "center",
                          color: iconColor,
                        }}
                      >
                        {menuListIcons[index]}
                      </ListItemIcon>
                      <ListItemText
                        primary={text}
                        sx={{
                          color: iconColor,
                          opacity: 1,
                          whiteSpace: "nowrap", // texte sur une ligne
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      />
                    </ListItemButton>
                  </a>
                </NextLink>
              </ListItem>
              <Divider sx={{ my: 0.3 }} />
            </React.Fragment>
          );
        })}
      </List>

      {/* Bouton déconnexion */}
      <List sx={{ px: 0.5 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleListItemButtonClick("Sign Out")}
            sx={{
              minHeight: 44,
              justifyContent: "initial",
              px: 2.5,
              mb: 1,
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: activeBgColor,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 3,
                justifyContent: "center",
                color: iconColor,
              }}
            >
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              sx={{
                color: iconColor,
                opacity: 1,
                whiteSpace: "nowrap",
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SideMenu;
