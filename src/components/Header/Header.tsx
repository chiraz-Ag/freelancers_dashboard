import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { signIn, signOut, useSession } from "next-auth/react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/router";
import ThemeSelector from "@/components/ThemeSelector";

const Header = () => {
  const { data: session } = useSession();
  const { isDark } = useTheme();
  const router = useRouter();
  const userProfileImg = session?.user?.image as string;

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigateHome = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/");
  };

  const tabletCheck = useMediaQuery("(min-width: 768px)");

  return (
    <AppBar
      position="fixed"
      sx={{
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1201,
        marginBottom: "40px",
        transition: "background-color 0.3s ease",
        borderRadius: 0,
        boxShadow: "none",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo desktop */}
          <AdbIcon
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1,
              color: isDark ? "#fff" : "inherit",
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            onClick={navigateHome}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: `"Pacifico", cursive`,
              fontWeight: "bold",
              fontSize: "1.8rem",
              color: isDark ? "#fff" : "#111",
              textDecoration: "none",
            }}
          >
            FreelanceScoop
          </Typography>

          {/* Logo mobile */}
          <AdbIcon
            sx={{
              display: { xs: "flex", md: "none" },
              mr: 1,
              color: isDark ? "#fff" : "inherit",
            }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            onClick={navigateHome}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: `"Pacifico", cursive`,
              fontWeight: "bold",
              fontSize: "1.6rem",
              color: isDark ? "#fff" : "#111",
              textDecoration: "none",
            }}
          >
            FreelanceScoop
          </Typography>

          {/* Zone de droite */}
          <Box
            sx={{ display: "flex", alignItems: "center", ml: "auto", gap: 2 }}
          >
            {tabletCheck && session && (
              <Typography sx={{ color: isDark ? "#fff" : "inherit" }}>
                Signed in as {session?.user?.email}
              </Typography>
            )}

            {/* Avatar utilisateur */}
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={session?.user?.name as string}
                  src={userProfileImg}
                />
              </IconButton>
            </Tooltip>

            <ThemeSelector />

            {/* Menu utilisateur */}
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {session ? (
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    signOut();
                  }}
                >
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    signIn();
                  }}
                >
                  <Typography textAlign="center">Login</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
