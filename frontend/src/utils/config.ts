import { PinataSDK } from "pinata"

export const pinata = new PinataSDK({
    pinataJwt: `${import.meta.env.VITE_PINATA_JWT}`,
    pinataGateway: `${import.meta.env.VITE_GATEWAY_URL}`
})

export const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS
