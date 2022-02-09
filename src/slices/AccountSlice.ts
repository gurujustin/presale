import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sBHD } from "../abi/Presale.json";
import { abi as PresaleContract } from "../abi/Presale.json";
import { abi as pBHD } from "../abi/Presale.json";
import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const bhdContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, ierc20Abi, provider);
    const bhdBalance = await bhdContract.balanceOf(address);
    const sbhdContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, sBHD, provider);
    const sbhdBalance = await sbhdContract.balanceOf(address);
    // let poolBalance = 0;
    // const poolTokenContract = new ethers.Contract(addresses[networkID].PT_TOKEN_ADDRESS as string, ierc20Abi, provider);
    // poolBalance = await poolTokenContract.balanceOf(address);

    return {
      balances: {
        bhd: ethers.utils.formatUnits(bhdBalance, "gwei"),
        sbhd: ethers.utils.formatUnits(sbhdBalance, "gwei"),
        // pool: ethers.utils.formatUnits(poolBalance, "gwei"),
      },
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let bhdBalance = 0;
    let busdBalance = 0;
    let presaleAllowance = 0;
    let claimAllowance = 0;
    let claimableAmount = 0;
    let totalPurchasedAmount = 0;
    let claimedAmount = 0;
    let paidReferral = 0;


    const busdContract = new ethers.Contract(addresses[networkID].BUSD_ADDRESS as string, ierc20Abi, provider);
    busdBalance = await busdContract.balanceOf(address);


    const bhdContract = new ethers.Contract(addresses[networkID].TOKEN_ADDRESS as string, ierc20Abi, provider);
    bhdBalance = await bhdContract.balanceOf(address);

    const presaleContract = new ethers.Contract(
      addresses[networkID].PRESALE_ADDRESS as string,
      PresaleContract,
      provider,
    );

    if (addresses[networkID].BUSD_ADDRESS) {
      presaleAllowance = await busdContract.allowance(address, addresses[networkID].PRESALE_ADDRESS);
    }

    if (addresses[networkID].TOKEN_ADDRESS) {
      claimAllowance = await bhdContract.allowance(address, addresses[networkID].PRESALE_ADDRESS);
    }
    const isPresaleOpen = await presaleContract.isPresaleOpen();
    totalPurchasedAmount = (await presaleContract.preBuys(address)).busdAmount;
    paidReferral = await presaleContract.paidRefferal(address);
    if (!isPresaleOpen){
      claimableAmount = await presaleContract.getClaimableAmount(address);
      claimedAmount = (await presaleContract.preBuys(address)).pTokenClaimedAmount;
    }
    return {
      balances: {
        busd: ethers.utils.formatEther(busdBalance),
        bhd: ethers.utils.formatUnits(bhdBalance, "gwei"),
      },
      presale: {
        presaleAllowance: +presaleAllowance,
      },
      claim: {
        claimAllowance: +claimAllowance,
        claimableAmount: ethers.utils.formatEther(claimableAmount),
        totalPurchasedAmount: ethers.utils.formatEther(totalPurchasedAmount),
        claimedAmount: ethers.utils.formatEther(claimedAmount),
      },
      referral: {
        paidReferral: ethers.utils.formatEther(paidReferral)
      }
    };
  },
);


interface IAccountSlice {
  balances: {
    bhd: string;
    busd: string;
  };
  loading: boolean;
}
const initialState: IAccountSlice = {
  loading: false,
  balances: { bhd: "", busd: "" },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
