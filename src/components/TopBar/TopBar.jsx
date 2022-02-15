import { NavLink } from "react-router-dom";
import { AppBar, Toolbar, Box, Button, SvgIcon, Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ReactComponent as MenuIcon } from "../../assets/icons/hamburger.svg";
import { ReactComponent as LogoIcon } from "../../assets/icons/BattleRoyale.svg";
import ConnectMenu from "./ConnectMenu.jsx";
import "./topbar.scss";

const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      padding: "10px",
    },
    justifyContent: "flex-end",
    alignItems: "flex-end",
    background: "transparent",
    backdropFilter: "none",
    zIndex: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("981")]: {
      display: "none",
    },
  },
}));

function TopBar({ theme, toggleTheme, handleDrawerToggle }) {
  const classes = useStyles();
  const isVerySmallScreen = useMediaQuery("(max-width: 355px)");

  return (
    <AppBar position="sticky" className={classes.appBar} elevation={0}>
      <Toolbar disableGutters className="dapp-topbar">
        <Box display="flex">
          <Link
            component={NavLink}
            className="nav-logo"
            to="/"
          >
            <SvgIcon component={LogoIcon} viewBox="0 0 1080 864" style={{ height: "120px", width: "200px" }} alt="logo"/>
            {/* <Typography className="nav-logo-text">BattleRoyale</Typography> */}
          </Link>
        </Box>
        <Box display="flex">
          

          <Link
            component={NavLink}
            className="nav-link"
            to="/presale"
          >
            <Typography variant="h6" className="nav-link-text">
              Presale
            </Typography>
          </Link>

          <Link
            component={NavLink}
            className="nav-link"
            to="/claim"
          >
            <Typography variant="h6" className="nav-link-text">
              Claim
            </Typography>
          </Link>

          <Link
            component={NavLink}
            className="nav-link"
            to="/referral"
          >
            <Typography variant="h6" className="nav-link-text">
              Referral
            </Typography>
          </Link>

          <ConnectMenu theme={theme} />

        </Box>
      </Toolbar>
      <div className="dapp-secbar" style={{display: "none"}}>
      <Box display="flex">          
          <Link
            component={NavLink}
            className="nav-link"
            to="/presale"
          >
            <Typography variant="h6" className="nav-link-text">
              Presale
            </Typography>
          </Link>

          <Link
            component={NavLink}
            className="nav-link"
            to="/claim"
          >
            <Typography variant="h6" className="nav-link-text">
              Claim
            </Typography>
          </Link>

          <Link
            component={NavLink}
            className="nav-link"
            to="/referral"
          >
            <Typography variant="h6" className="nav-link-text">
              Referral
            </Typography>
          </Link>

        </Box>
      </div>
    </AppBar>
  );
}

export default TopBar;
