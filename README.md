# Cuppa

Cuppa is a framework for finding and executing best routes for swapping ERC20 tokens. It is a fork of @terminal-fi/swappa. Framework consists of two parts:

- cuppa: TypeScript library that can be used to find best swap routes.
- SwappaRouterV1 smart contract: That can be used to execute those swap routes atomically.

## SwappaRouterV1

SwappaRouter is designed for Celo network, thus gas optimizations aren't always highest priority since TX costs are
assumed to be reasonable on Celo network. SwappaRouter instead optimizes for simplicity, readability and extensibility.

## cuppa

Routing library consits of 3 steps:

1. Finding and initializing swap pairs: In this step, swap pairs are discovered across all DEXes and DeFI systems that Swappa supports. This step is assumed to be expensive, however it only needs to be run once at initialization and potentially re-run very infrequently to discover new trading pairs that might get created. (Can be re-run once an hour or even less frequently).
2. Refreshing swap pair data: In this step, necessary information is fetched for every single swap pair to perform all other calculations later on offline. This step is fairly fast but requires connection to blockchain client. Low latency connection to blockchain client will provide better performance for this step. This step can be re-run every block (i.e. 5 seconds) if necessary, but in practice it probably only needs to be re-run every 30-60 seconds.
3. Finding best swap routes: This step is fully offline and expected to be very fast (i.e. <100ms).

## Testing

Swappa comes with a simple command line tool to test its routing and execution.

```sh
yarn ts-node src/cli/cli.ts --input CELO --output cUSD --amount 1
yarn ts-node src/cli/cli.ts --help
```

Example invokation to test single pair of a specific registry:

```sh
yarn ts-node src/cli/cli.ts --registries=mobius --max-swaps=1 --input USDC --output cUSD --amount 1337
```
