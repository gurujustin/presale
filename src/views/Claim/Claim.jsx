import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TabPanel from "../../components/TabPanel";
import { changeApproval, changeClaim } from "../../slices/ClaimThunk";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import {
  Paper,
  Grid,
  Typography,
  Box,
  Zoom,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import { trim } from "../../helpers";
import "./claim.scss";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers, BigNumber } from "ethers";

function Claim() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const [quantity, setQuantity] = useState("");
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });
  const pbhdBalance = useSelector(state => {
    return state.account.balances && state.account.balances.pbhd;
  });
  const setMax = () => {
    setQuantity(pbhdBalance);
  };
  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };
  const claimAllowance = useSelector(state => {
    return state.account.claim && state.account.claim.claimAllowance;
  });
  const claimableAmount = useSelector(state => {
    return state.account.claim && state.account.claim.claimableAmount;
  });
  const totalPurchasedAmount = useSelector(state => {
    return state.account.claim && state.account.claim.totalPurchasedAmount;
  });
  const claimedAmount = useSelector(state => {
    return state.account.claim && state.account.claim.claimedAmount;
  });
  const onChangeClaim = async action => {
    // eslint-disable-next-line no-restricted-globals
    // quantity = 10;
    // if (isNaN(quantity) || quantity === 0 || quantity === "") {
    //   // eslint-disable-next-line no-alert
    //   return dispatch(error("Please enter a value!"));
    // }

    // // 1st catch if quantity > balance
    // let gweiValue = ethers.utils.parseUnits(quantity, "gwei");

    // if (action === "claim" && gweiValue.gt(ethers.utils.parseUnits(pbhdBalance, "gwei"))) {
    //   return dispatch(error("You cannot claim more than your pBHD balance."));
    // }
    await dispatch(changeClaim({ address, action, value: "", provider, networkID: chainID }));
  };
  const hasAllowance = useCallback(
    token => {
      if (token === "pbhd") return claimAllowance > 0;
      return 0;
    },
    [claimAllowance],
  );
  const isAllowanceDataLoading = claimAllowance == null;
  return (
    <div id="dashboard-view">
      <div className="presale-header">
        <h1>Claim</h1>
        <p>The vesting period will last for 4 weeks.</p>
      </div>
      <Paper className={`ohm-card`}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <div className="card-header">
              <Typography variant="h5">Claim</Typography>
            </div>
          </Grid>
        </Grid>
        {/* <Grid item>
          <div className="stake-top-metrics" style={{marginBottom: "18px"}}>
            <Typography className="presale-items">20% each week at the public launch.</Typography>
            <Typography className="presale-items">So after the Presale <span style={{color: "#FE4C4F"}}>20%</span>.</Typography>
          </div>
        </Grid> */}
        {totalPurchasedAmount && 
          <Grid item>
            <div className="stake-top-metrics data-row-centered" style={{marginBottom: "18px"}}>
              <Typography className="presale-items">Total Purchased Amount:</Typography>
              <Typography className="presale-items" style={{marginLeft: "16px"}}><span style={{color: "#FE4C4F"}}>{totalPurchasedAmount / 5} $OCTA</span></Typography>
            </div>
          </Grid>
        }
        {claimedAmount && 
          <Grid item>
            <div className="stake-top-metrics data-row-centered" style={{marginBottom: "18px"}}>
              <Typography className="presale-items">Claimed Amount:</Typography>
              <Typography className="presale-items" style={{marginLeft: "16px"}}><span style={{color: "#FE4C4F"}}>{claimedAmount} $OCTA</span></Typography>
            </div>
          </Grid>
        }
        {claimableAmount && 
          <Grid item>
            <div className="stake-top-metrics data-row-centered" style={{marginBottom: "18px"}}>
              <Typography className="presale-items">Claimable Amount:</Typography>
              <Typography className="presale-items" style={{marginLeft: "16px"}}><span style={{color: "#FE4C4F"}}>{claimableAmount} $OCTA</span></Typography>
            </div>
          </Grid>
        }
        <Grid item>
          <div className="stake-top-metrics" style={{ whiteSpace: "normal" }}>
            <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex">
              {address && !isAllowanceDataLoading ? (
                !hasAllowance("pbhd") ? (
                  <Box className="help-text">
                    <Typography variant="body1" className="stake-note" color="textSecondary">
                      <>
                        First time use <b>$OCTA</b>?
                        <br />
                        Please approve OctaNode to use your <b>$OCTA</b> for claim $OCTA.
                      </>
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {/* <FormControl className="ohm-input" variant="outlined" color="primary">
                      <InputLabel htmlFor="amount-input"></InputLabel>
                      <OutlinedInput
                        id="amount-input"
                        type="number"
                        placeholder="Enter an amount"
                        className="stake-input"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        labelWidth={0}
                        endAdornment={
                          <InputAdornment position="end">
                            <Button variant="text" onClick={setMax} color="inherit">
                              Max
                            </Button>
                          </InputAdornment>
                        }
                      />
                    </FormControl> */}
                  </Box>
                )
              ) : (
                <Skeleton width="45%" />
              )}

              {isAllowanceDataLoading ? (
                <Skeleton width="45%" />
              ) : address && hasAllowance("pbhd") ? (
                <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                  <Typography style={{marginTop: "16px"}}>20% each week at the public launch.</Typography>
                  <Button
                    className="stake-button"
                    variant="contained"
                    color="primary"
                    style={{marginTop: "16px"}}
                    disabled={isPendingTxn(pendingTransactions, "claim")}
                    onClick={() => {
                      onChangeClaim("claim");
                    }}
                  >
                    {txnButtonText(pendingTransactions, "claim", "Claim")}
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Button
                    className="stake-button"
                    variant="contained"
                    color="primary"
                    disabled={isPendingTxn(pendingTransactions, "approve_claim")}
                    onClick={() => {
                      onSeekApproval("pbhd");
                    }}
                  >
                    {txnButtonText(pendingTransactions, "approve_claim", "Approve")}
                  </Button>
                </Box>
              )}
            </Box>
          </div>
        </Grid>
      </Paper>
    </div>
  );
}

export default Claim;
