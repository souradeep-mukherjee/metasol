import { Connection, PublicKey } from '@solana/web3.js';
import { NETWORK, CONNECTION_CONFIG } from './constants';

export const getConnection = () => {
  return new Connection(
    NETWORK === 'mainnet-beta'
      ? 'https://api.mainnet-beta.solana.com'
      : 'https://api.devnet.solana.com',
    CONNECTION_CONFIG
  );
};
export const validateSolanaAddress = (address) => {
    try {
      new PublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  export const shortenAddress = (address, chars = 4) => {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  };