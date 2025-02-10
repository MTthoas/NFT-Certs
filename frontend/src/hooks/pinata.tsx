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
