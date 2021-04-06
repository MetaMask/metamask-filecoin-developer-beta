# MetaMask Filecoin Developer Preview

## Hey, we're hiring JavaScript Engineers! [Apply Here](https://boards.greenhouse.io/consensys/jobs/2572388).

Welcome to the MetaMask Filecoin Developer Preview.
This is a special distribution of the MetaMask extension intended for developers only.
It uses a prototype of the [MetaMask Snaps plugin system](https://medium.com/metamask/introducing-the-next-evolution-of-the-web3-wallet-4abdf801a4ee) to include a preinstalled version of a Filecoin plugin, called a _snap_.
For the latest version, please see [Releases](https://github.com/MetaMask/metamask-extension/releases).

The Filecoin Developer Preview only supports the preinstalled Filecoin snap, and can only be used on Chromium browsers.
You can try it out with [this dapp](https://metamask.github.io/filsnap).
Builds can be installed using [these instructions](./docs/add-to-chrome.md).

For related repositories and documentation, please see:

- [The Filecoin snap](https://github.com/MetaMask/filsnap/tree/master/packages/snap)
- [The prototype Snaps system](https://github.com/MetaMask/snaps-skunkworks)

> Kudos to our friends at [NodeFactory](https://github.com/NodeFactoryIo) for the original implementation of the Filecoin snap and dapp.

## How Does This Work?

The Filecoin snap (a.k.a. `filsnap`) runs within a [Secure EcmaScript](https://github.com/endojs/endo/tree/master/packages/ses) Compartment inside a Web Worker.
The snap can be toggled on and off and reinstalled via the Filecoin dropdown in the main MetaMask menu bar.

The snap _manages its own Filecoin keys_ generated according the BIP-32 and SLIP-44 standards.
It extends its own RPC API to sites that connect to it, allowing websites to check the balance of the user's Filecoin address, and send transactions.
There is no UI representation of FIL in MetaMask at this prototype stage (although you can bet that there will be in the future).

To understand how to connect to and talk to the snap, see the [source code](https://github.com/MetaMask/filsnap/blob/00db7483afb686545aefe00d244d5eedca78918d/packages/adapter/src/index.ts/#L46-L53) of the [example dapp](https://metamask.github.io/filsnap).

## About MetaMask

You can find the latest version of MetaMask on [our official website](https://metamask.io/).
We do not offer customer support for the Filecoin Developer Preview, but please open an issue if anything is amiss.

For the regular MetaMask extension repository, go [here](https://github.com/MetaMask/metamask-extension).
