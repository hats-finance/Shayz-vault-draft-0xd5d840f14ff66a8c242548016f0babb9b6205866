import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { UNISWAP_V3_SUBGRAPH } from "constants/constants";
import { appChains, defaultChain } from "settings";

const subgraphByChain = new ApolloLink((operation) => {
  const { chainId } = operation.getContext();
  const link = new HttpLink({ uri: appChains[chainId || defaultChain.chain.id].subgraph });
  return link.request(operation);
});

const linkByDirectives = {
  default: subgraphByChain,
  uniswapv3: new HttpLink({ uri: UNISWAP_V3_SUBGRAPH }),
};

const uriByDirective = new ApolloLink((operation) => {
  const { query } = operation;
  const foundDirectives = getMainDefinition(query).directives;
  const directive = foundDirectives?.find((d) => Object.keys(linkByDirectives).includes(d.name.value));
  if (directive) {
    return linkByDirectives[directive.name.value].request(operation);
  }
  return linkByDirectives.default.request(operation);
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: uriByDirective,
});
