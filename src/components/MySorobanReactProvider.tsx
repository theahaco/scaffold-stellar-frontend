import React from 'react'
import {SorobanReactProvider} from '@soroban-react/core';
import {futurenet, sandbox, standalone, testnet} from '@soroban-react/chains';
import {freighter} from '@soroban-react/freighter';
import type {ChainMetadata, Connector} from "@soroban-react/types";

const chains: ChainMetadata[] = [sandbox, standalone, futurenet,testnet];

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const connectors: Connector[] = [freighter()];

export default function MySorobanReactProvider({children}:{children: React.ReactNode}) {
  
  return (
      <SorobanReactProvider
        chains={chains}
        appName={"Stellar Scaffold"}
        // eslint-disable-next-line 
        activeChain={standalone}
        connectors={connectors}>
          {children}
      </SorobanReactProvider>
    )
  }