import {
  MnemonicWallet,
  WalletHandler,
  StorageHandler,
} from "@jackallabs/jackal.nodejs";

const appConfig = {
  signerChain: "lupulella-2",
  queryAddr: "https://testnet-grpc.jackalprotocol.com",
  txAddr: "https://testnet-rpc.jackalprotocol.com",
};

const mnemonic = "";

const m = await MnemonicWallet.create(mnemonic);
const wallet = await WalletHandler.trackWallet(appConfig, m);
const walletAddress = "";
const storage = await StorageHandler.trackStorage(wallet);

await storage.buyStorage(walletAddress, 1, 0.1);
