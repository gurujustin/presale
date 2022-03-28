import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSelector } from "react-redux";
import { useWeb3Context } from "src/hooks/web3Context";
import {
  Paper,
  Grid,
  Typography,
  Box,
  Button,
} from "@material-ui/core";
import "./referral.scss";
import rot13 from "src/encode";

function Referral() {
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  
  const paidReferral = useSelector(state => {
    return state.account.referral && state.account.referral.paidReferral;
  });
  // console.log('paidReferral', paidReferral)
  
  const [isCopied, setIsCopied] = useState(false);

  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <div id="dashboard-view">
      <div className="presale-header">
        <h1>Referral</h1>
        <p>Share the referral link below to invite your friends and earn <b>5%</b> of your friends' claiming.</p>
      </div>
      <Paper className={`ohm-card`}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <div className="card-header">
              <Typography variant="h5">Your Referral Link</Typography>
            </div>
          </Grid>
        </Grid>
        <Grid item>
          <div className="stake-top-metrics" style={{ whiteSpace: "normal" }}>
            <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex">
              {address ? (
                    <>
                        <Box mb="24px">
                            <Typography variant="body1" className="referral-link" color="textSecondary">
                            <>
                              https://presale.battleroyale.game/#/presale?ref={rot13(address)}
                            </>
                            </Typography>
                        </Box>
                        <Box>
                            <CopyToClipboard text={`https://presale.battleroyale.game/#/presale?ref=${rot13(address)}`} onCopy={onCopyText}>
                                <div className="copy-area">
                                    <Button
                                        className="copy-button"
                                        variant="contained"
                                        color="primary"
                                    >
                                        {isCopied ? "Copid" : "Copy"}
                                    </Button>
                                </div>
                            </CopyToClipboard>
                        </Box>
                        <Box mt="24px">
                          <Typography variant="body1" className="referral-link" color="textSecondary">
                            Total Paid for Referral
                          </Typography>
                        </Box>
                        <Box mt="12px">
                          <Typography variant="body1" className="referral-link" color="textSecondary">
                              {paidReferral ? paidReferral : 0} $USDT
                          </Typography>
                        </Box>
                  </>
                ) : (
                    <Box className="help-text">
                      <Typography variant="body1" className="stake-note" color="textSecondary">
                        <>
                          Connect Wallet to get your unique referral link.
                        </>
                      </Typography>
                    </Box>
                )}
            </Box>
          </div>
        </Grid>
      </Paper>
    </div>
  );
}

export default Referral;
