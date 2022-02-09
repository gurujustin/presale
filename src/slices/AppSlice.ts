import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as PresaleContract } from "../abi/Presale.json";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { setAll, getTokenPrice, getMarketPrice } from "../helpers";
import { NodeHelper } from "../helpers/NodeHelper";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";

const initialState = {
  loading: false,
  loadingMarketPrice: false,
};

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    const presaleContract = new ethers.Contract(
      addresses[networkID].PRESALE_ADDRESS as string,
      PresaleContract,
      provider,
    );
    const bhdContract = new ethers.Contract(addresses[networkID].TOKEN_ADDRESS as string, ierc20Abi, provider);
    const tokenBalance = await bhdContract.balanceOf(addresses[networkID].PRESALE_ADDRESS);
    const totalTokenAmount = ethers.utils.formatEther(tokenBalance);
    console.log("debug tokenbalance", tokenBalance, typeof(tokenBalance));
    const isPresaleOpen = await presaleContract.isPresaleOpen();
    const maxBusdLimit = await presaleContract.maxBusdLimit();
    let minBusdLimit = await presaleContract.minBusdLimit();
    minBusdLimit = ethers.utils.formatEther(minBusdLimit);
    const rate = await presaleContract.rate();
    const price = 1000000000000000000 / rate;
    const totalTokenAmountToDistribute = await presaleContract.totalpTokenAmountToDistribute();

    return {
      isPresaleOpen,
      maxBusdLimit,
      minBusdLimit,
      price,
      totalTokenAmountToDistribute,
      totalTokenAmount,
    } as IPresaleData;
  },
);

interface IPresaleData {
  readonly isPresaleOpen: boolean;
  readonly maxBusdLimit: number;
  readonly minBusdLimit: number;
  readonly price: number;
  readonly totalTokenAmountToDistribute: number;
  readonly totalTokenAmount: string;
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
