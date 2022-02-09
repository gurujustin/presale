import Web3 from 'web3'

const isAddress = (address: string) => {
  return Web3.utils.isAddress(address)
}

export { isAddress }