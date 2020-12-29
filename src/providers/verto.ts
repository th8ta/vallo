import Verto from '@verto/lib'
import { JWKInterface } from "arweave/node/lib/wallet";
import Arweave from 'arweave'
import { token } from '../context/walletContext';

const getVerto = async (key?: JWKInterface) => {
    return new Verto(key)
}

const getArweaveInstance = () => {
    return Arweave.init({
      host: 'arweave.net',
      port: 443,
    })
  }
  
export const getTokenBalances = async (address:string): Promise<token[]> => {
    let verto = await getVerto()
    let tokens = await verto.getAssets(address)
    console.log(tokens)    
    let tokenStates = tokens.map( (token) => {
        let url = ''
        //@ts-ignore
        if(token.state.settings) {
        //@ts-ignore
            let logo = token.state.settings.filter((setting: any) => setting[0] === 'communityLogo');
            if (logo)
                url = logo[0][1];
        }
        //@ts-ignore
        return {...token, logo: url, state: token.state}
    })
    return tokenStates;
}
