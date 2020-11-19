import StellarSdk from 'stellar-sdk'
import { OFFICIAL_HORIZON } from './horizon'

let server = undefined
let url = undefined
let networkPassphrase = undefined
let baseFee = 100

export function newServer(url){
  if(url){
    server = undefined
  }else{
    url = OFFICIAL_HORIZON
  }
  console.log(`server api url: ${url}`)
  //StellarSdk.Network.usePublicNetwork();
  if(url.indexOf('test') >= 0){
    // StellarSdk.Network.useTestNetwork();
    networkPassphrase = StellarSdk.Networks.TESTNET
  }else{
    // StellarSdk.Network.usePublicNetwork();
    networkPassphrase = StellarSdk.Networks.PUBLIC
  }
  server = new StellarSdk.Server(url)
  getBaseFee()
  return server
}

export function getServer(){
  if(server)return server
  server = new StellarSdk.Server(url||OFFICIAL_HORIZON)
  return server
}

export function setServerUrl(horizon){
  server = undefined
  url = horizon
  server = getServer()
}

export function getNetworkPassphrase(){
  getServer()
  return networkPassphrase;
}

export async function getBaseFee(){
  baseFee = await getServer().getBaseFee()
  if(typeof baseFee === 'number')return baseFee
  baseFee = 100
  return baseFee
}

export const FEE = baseFee

export default server
