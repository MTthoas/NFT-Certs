import { useEffect, useState } from 'react'

export interface Metadata {
  // Adaptez cette interface en fonction des données présentes dans vos JSON
  name?: string
  description?: string
  image?: string
  [key: string]: any
}

export async function uploadJson(content: any) {
  try {
    const data = JSON.stringify({
      pinataContent: {
        name: content.name,
        description: content.description,
        image: `ipfs://${content.image}`,
        external_url: content.external_url,
        attributes: [
          {
            trait_type: 'address',
            value: content.data.address,
          },
          {
            trait_type: 'studentId',
            value: content.data.studentId,
          },
          {
            trait_type: 'program',
            value: content.data.program,
          },
          {
            trait_type: 'programStatus',
            value: content.data.programStatus,
          },
        ],
      },
      pinataOptions: {
        cidVersion: 1,
      },
    })

    const uploadRes = await fetch(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
        body: data,
      }
    )
    const uploadResJson = await uploadRes.json()
    const cid = uploadResJson.IpfsHash
    return cid
  } catch (error) {
    console.log('Error uploading file:', error)
  }
}

export async function uploadJson2(
  academicProgress: any,
  address: any,
  studentId: any,
  tokenId: any,
  program: any,
  programStatus: any,
  parentId: any,
  comments: any,
  pinata: any
) {
  try {
    console.log('📡 Uploading JSON to Pinata...', pinata, academicProgress)

    academicProgress.sort((a, b) => parseInt(a.year) - parseInt(b.year))

    // Construction de l'objet à uploader
    const metadata = {
      pinataContent: {
        name: pinata.name,
        description: 'Performance',
        image: pinata.image,
        attributes: [
          { trait_type: 'address', value: address },
          { trait_type: 'studentId', value: studentId },
          { trait_type: 'program', value: program },
          { trait_type: 'programStatus', value: programStatus },
          { trait_type: 'parentId', value: parentId },
          { trait_type: 'comments', value: comments },
          { trait_type: 'academicProgress', value: academicProgress },
        ],
      },
      pinataOptions: { cidVersion: 1 },
    }

    console.log('🚀 Uploading JSON:', metadata)

    // console.log(metadata)
    const uploadRes = await fetch(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
        body: JSON.stringify(metadata),
      }
    )

    if (!uploadRes.ok) {
      console.warn(`⚠️ Pinata API error: ${uploadRes.status}`)
      return null // 🔹 Retourne `null` en cas d'erreur d'upload
    }

    const uploadResJson = await uploadRes.json()
    console.log('✅ Upload success:', uploadResJson)

    return uploadResJson.IpfsHash
  } catch (error) {
    console.error('❌ Error uploading file:', error)
    return null
  }
}

export function getPinataMetadata(tokenURI: any) {
  // Récupère les métadonnées depuis Pinata, dont url pour le call api
  return fetch(tokenURI)
    .then((res) => res.json())
    .then((data) => {
      return data
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

export function usePinataMetadata(tokenURIs: string[]) {
  const [metadataList, setMetadataList] = useState<Metadata[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!tokenURIs || tokenURIs.length === 0) {
      setMetadataList([])
      return
    }

    setIsLoading(true)

    Promise.all(
      tokenURIs.map(async (uri) => {
        try {
          console.log(`Fetching metadata from: ${uri}`)
          const response = await fetch(uri)

          if (!response.ok) {
            console.warn(`HTTP error ${response.status} for URI: ${uri}`)
            return null // 🔹 Retourne `null` en cas d'erreur HTTP
          }

          const contentType = response.headers.get('content-type')
          if (!contentType || !contentType.includes('application/json')) {
            console.warn(`Invalid JSON response for URI: ${uri}`)
            return null // 🔹 Retourne `null` si ce n'est pas du JSON
          }

          return await response.json()
        } catch (err: any) {
          console.error(`Erreur lors du fetch pour ${uri}:`, err)
          return null // 🔹 Retourne `null` en cas d'erreur réseau
        }
      })
    )
      .then((results) => {
        const validResults = results.filter((res) => res !== null) // 🔹 Enlève les erreurs
        setMetadataList(validResults)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Erreur globale lors du fetch des métadonnées:', err)
        setError(err)
        setIsLoading(false)
        setMetadataList([]) // 🔹 Retourne un tableau vide en cas d'erreur globale
      })
  }, [tokenURIs])

  return { metadataList, isLoading, error }
}
