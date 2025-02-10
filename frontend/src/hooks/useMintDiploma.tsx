// // adaptez le chemin vers votre ABI
// import { abi } from '@/abi/abi'
// import { writeContract } from 'viem/actions'

// /**
//  * Fonction qui :
//  *  1. Upload les données du diplôme sur Pinata
//  *  2. Construit le tokenURI à partir du hash IPFS
//  *  3. Appelle la fonction `mintDiploma` du smart contract
//  *
//  * @param recipient L’adresse du destinataire.
//  * @param diplomaData Un objet JSON contenant les informations du diplôme.
//  */
// const mintDiploma = async (recipient: string, diplomaData: any) => {
//   // Récupération des clés depuis les variables d'environnement
//   // Ces variables doivent commencer par NEXT_PUBLIC_ pour être accessibles côté client
//   const PINATA_API_KEY = '32cf3c0039b7f027b580'
//   const PINATA_SECRET_API_KEY =
//     'ab7c14f90fe1616d7cd19a5978470390e3732d7c51d32cc80205bc7e72fb2318'

//   if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
//     throw new Error('Clés Pinata manquantes dans les variables d’environnement')
//   }

//   try {
//     // Appel direct à l’API de Pinata pour uploader le JSON
//     const response = await fetch(
//       'https://api.pinata.cloud/pinning/pinJSONToIPFS',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           pinata_api_key: PINATA_API_KEY,
//           pinata_secret_api_key: PINATA_SECRET_API_KEY,
//         },
//         body: JSON.stringify({
//           pinataMetadata: {
//             name: 'Diploma Data',
//           },
//           pinataContent: diplomaData,
//         }),
//       }
//     )

//     if (!response.ok) {
//       const errorText = await response.text()
//       throw new Error(`Échec de l’upload vers Pinata : ${errorText}`)
//     }

//     const json = await response.json()
//     const tokenURI = `https://gateway.pinata.cloud/ipfs/${json.IpfsHash}`
//     console.log('TokenURI obtenu : ', tokenURI)

//     // Appel de la fonction smart contract avec les arguments [recipient, tokenURI]
//     writeContract({
//       address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
//       abi,
//       functionName: 'mint',
//       args: [BigInt(tokenId)],
//     })
//   } catch (err) {
//     console.error('Erreur lors de l’upload vers Pinata ou du mint', err)
//     throw err
//   }
// }
