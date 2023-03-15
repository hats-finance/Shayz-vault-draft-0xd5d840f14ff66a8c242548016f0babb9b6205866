import { configureChains, createClient } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { appChains, INFURA_API_KEY } from "settings";

const { chains, provider } = configureChains(
  Object.values(appChains).map((chainInfo) => chainInfo.chain),
  [
    infuraProvider({ apiKey: INFURA_API_KEY }),
    publicProvider(),
    // jsonRpcProvider({
    //   rpc: (selectedChain) => {
    //     const supportedChains = Object.keys(appChains);
    //     const isSupportedChain = supportedChains.includes(`${selectedChain.id}`);

    //     if (isSupportedChain) return { http: appChains[selectedChain.id].endpoint };
    //     return { http: defaultChain.endpoint };
    //   },
    // }),
  ]
);

const walletConnectors = [
  // new InjectedConnector({
  //   chains,
  //   options: {
  //     name: (detectedName) => `Injected (${typeof detectedName === "string" ? detectedName : detectedName.join(", ")})`,
  //   },
  // }),
  new MetaMaskConnector({ chains }),
  new CoinbaseWalletConnector({ chains, options: { appName: "Hats.finance" } }),
  new WalletConnectConnector({ chains, options: { qrcode: true } }),
];

const wagmiClient = createClient({
  autoConnect: true,
  persister: null,
  provider,
  connectors: walletConnectors,
});

export { wagmiClient };
