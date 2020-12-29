import Arweave from 'arweave'

export const getArweaveInstance = () => {
    return Arweave.init({
      host: 'arweave.net',
      port: 443,
    })
  }
  
export const addWallet = async (wallet: any): Promise<{ address: string, balance: string }> => {
    let arweave = getArweaveInstance()
    let address = ''
    if (typeof wallet === "string") address = wallet;
    else address = await arweave.wallets.jwkToAddress(wallet)
  
    let balance = arweave.ar.winstonToAr(await arweave.wallets.getBalance(address))
    return { address, balance }
  }