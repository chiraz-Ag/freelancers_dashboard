import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { useTheme as useCustomTheme } from "@/contexts/ThemeContext";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const ThemeSelector: React.FC = () => {
  const { isDark, toggleTheme } = useCustomTheme();
  const muiTheme = useMuiTheme();

  return (
    <Tooltip
      title={isDark ? "Passer au thème clair" : "Passer au thème sombre"}
    >
      <IconButton
        onClick={toggleTheme}
        size="medium"
        sx={{
          color: muiTheme.palette.primary.contrastText,
          ml: 1,
        }}
      >
        {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeSelector;
