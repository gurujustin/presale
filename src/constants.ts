export const EPOCH_INTERVAL = 9600;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 3;

interface IAddresses {
  [key: number]: { [key: string]: string };
}
export const addresses: IAddresses = {
  56: {
    BUSD_ADDRESS: "0x55d398326f99059ff775485246999027b3197955",
    TOKEN_ADDRESS: "0x0e20b7aD6EF1C8AF489Ef435C91D8e2B4A2b1d39",
    PRESALE_ADDRESS: "0x6Ea9a57e66a76320F277E027b47F0eE9DeEb1257",
  },
};
