
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

        // Récupérer les métadonnées de chaque URL en parallèle
        Promise.all(
            tokenURIs.map(async (uri) => {
                try {
                    const response = await fetch(uri)
                    if (!response.ok) {
                        throw new Error(`Erreur lors de la récupération de ${uri}: ${response.statusText}`)
                    }
                    return await response.json()
                } catch (err: any) {
                    console.error('Erreur lors du fetch pour', uri, err)
                    throw err
                }
            })
        )
            .then((results) => {
                setMetadataList(results)
                setIsLoading(false)
            })
            .catch((err) => {
                setError(err)
                setIsLoading(false)
            })
    }, [tokenURIs])

    return { metadataList, isLoading, error }
}
