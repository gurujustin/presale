import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as DiscordIcon } from "../../assets/icons/discord.svg";
import { ReactComponent as TwitterIcon } from "../../assets/icons/twitter.svg";
import { ReactComponent as LogoIcon } from "../../assets/icons/BattleRoyale.svg";
import { trim, shorten } from "../../helpers";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import { Paper, Link, Box, Typography, SvgIcon } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./sidebar.scss";

function NavContent() {
  const [isActive] = useState();
  const address = useAddress();
  const { chainID } = useWeb3Context();

  const checkPage = useCallback((match, location, page) => {
    const currentPath = location.pathname.replace("/", "");
    if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
      return true;
    }
    if (currentPath.indexOf("stake") >= 0 && page === "stake") {
      return true;
    }
    if ((currentPath.indexOf("bonds") >= 0 || currentPath.indexOf("choose_bond") >= 0) && page === "bonds") {
      return true;
    }
    return false;
  }, []);

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box display="flex" justifyContent={"space-around"}>
            <Link
              component={NavLink}
              className="footer-logo"
              to="/"
              style={{width: "294px"}}
            >
              <SvgIcon component={LogoIcon} viewBox="0 0 1080 864" style={{ height: "60px", width: "150px" }} alt="logo"/>
              {/* <Typography className="footer-logo-text">BattleRoyale</Typography> */}
            </Link>
            <div />
          </Box>
          <Box display="flex" justifyContent={"space-around"}>
            <Typography style={{color: "white", fontSize: "14px", width: "180px"}}>2022 Copyright BattleRoyale</Typography>
            <div />
          </Box>
          <Box display="flex" justifyContent={"space-around"} mt="8px">
            <div style={{width: "180px"}}>
              <Link href="https://discord.gg/BattleRoyale" target="_blank" component="a">
                <SvgIcon color="primary" component={DiscordIcon} />
              </Link>
              <Link href="https://twitter.com/@BattleRoyale" target="_blank" component="a" style={{marginLeft: "8px"}}>
                <SvgIcon color="primary" component={TwitterIcon} />
              </Link>
            </div>
            
            <div />
          </Box>

        </div>
      </Box>
    </Paper>
  );
}

export default NavContent;
