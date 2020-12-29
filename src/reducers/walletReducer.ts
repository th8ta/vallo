import { walletState, wallet } from '../context/walletContext';

const walletReducer = (state: walletState, action: { type: string, payload: any }): walletState => {
    console.log('Current state is:')
    console.log(state)
    console.log('Action requested is:')
    console.log(action)
    switch (action.type) {
        case 'LOAD_STATE': {
            return { ...action.payload.state }
        }
        case 'ADD_WALLET': {
            let existingWallets = state.wallets?.filter((wallet: wallet)=> wallet.address === action.payload.address)
            let wallets = state.wallets ? state.wallets : []
            if (existingWallets && existingWallets.length === 0)
                wallets?.push({address:action.payload.address, key:action.payload.key, mnemonic: action.payload.mnemonic})
            return {
            ...state,
            key: action.payload.key,
            balance: action.payload.balance,
            address: action.payload.address,
            mnemonic: action.payload.mnemonic,
            wallets: wallets
        }}
        case 'UPDATE_TOKENS': {
            return {
                ...state,
                tokens: action.payload.tokens
            }
        }
        case 'SET_PICTURE': {
            return {
                ...state,
                picture: action.payload.picture
            }
        }
        case 'SET_BLOCK_HEIGHT': {
            return {
                ...state,
                blockHeight: action.payload.blockHeight
            }
        }
        case 'SET_TOKEN_ADDRESSES': {
            return {
                ...state,
                tokenAddresses: action.payload.tokenAddresses
            }
        }
        case 'CHANGE_ACTIVE_WALLET': {
            let newWallet = state.wallets.find((wallet) => wallet.address === action.payload.address)
            return {
                ...state,
                address: action.payload.address,
                key: newWallet?.key,
                balance: action.payload.balance,
                mnemonic: newWallet?.mnemonic
            }
        }
        case 'REMOVE_WALLET': {
            let wallets = state.wallets.filter((wallet) => wallet.address !== action.payload.address)
            if (wallets.length > 0)
            return {
                ...state,
                wallets: wallets,
                address: wallets[0]?.address,
                key: wallets[0]?.key
            }
            else return {
                ...state,
                wallets: [],
                address: '',
                key: '',
                balance: ''
            }
        }
        default: return state
    }
}

export default walletReducer