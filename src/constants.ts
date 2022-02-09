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
    PRESALE_ADDRESS: "0xF00804eB9B6335B1BF8b4C58d6E25cF24aAEae6E",
    REFERRAL_ADDRESS: "0xAef35289ff19dfd57f163f1B55b97ff580E1dbCD"
  },
};
