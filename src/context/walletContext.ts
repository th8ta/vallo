import { createContext } from 'react'

export type token = {
    balance: number,
    id: string,
    ticker: string,
    state: any,
    name: string,
    logo: string
}

export type wallet = {
    address: string,
    key?: any,
    mnemonic?: string
}
export type walletState = {
    key : any,
    mnemonic?: string
    balance: string,
    address: string,
    tokens: token[],
    wallets: wallet[],
    picture?: string,
    blockHeight?: number,
    tokenAddresses?: string[],
}

export const initWalletState: walletState = {
        key: null as any,
        balance: '',
        address: '',
        tokens: [],
        tokenAddresses: [],
        wallets: [],
}

const WalletContext = createContext<{state:walletState, dispatch: React.Dispatch<any>}>({state: initWalletState, dispatch: () => null} )

export { WalletContext as default }