import axios from "axios"
import FormData from "form-data"

const PINATA_API_URL = "https://api.pinata.cloud"

// Function to upload file to IPFS via Pinata
export async function uploadToPinata(file, metadata = {}) {
  try {
    const formData = new FormData()

    // Convert the File object to a Buffer for Node.js
    const buffer = Buffer.from(await file.arrayBuffer())

    // Add the file to form data with proper filename
    formData.append("file", buffer, {
      filename: file.name || "image.jpg",
      contentType: file.type || "image/jpeg",
    })

    // Add metadata
    const pinataMetadata = {
      name: metadata.title || "SproutCircle Image",
      keyvalues: {
        description: metadata.description || "",
        userId: metadata.userId || "",
        date: metadata.date || new Date().toISOString(),
      },
    }

    formData.append("pinataMetadata", JSON.stringify(pinataMetadata))

    // Options for pinning
    const pinataOptions = {
      cidVersion: 1,
    }

    formData.append("pinataOptions", JSON.stringify(pinataOptions))

    // Make the API request
    const response = await axios.post(`${PINATA_API_URL}/pinning/pinFileToIPFS`, formData, {
      maxBodyLength: "Infinity",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
    })

    // Return the IPFS hash and URL
    return {
      ipfsHash: response.data.IpfsHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      pinataMetadata,
      pinataContent: {
        size: response.data.PinSize,
        timestamp: response.data.Timestamp,
      },
    }
  } catch (error) {
    console.error("Error uploading to Pinata:", error.response?.data || error.message)
    throw new Error(error.response?.data?.error || "Failed to upload to IPFS")
  }
}

// Function to remove file from Pinata
export async function removeFromPinata(ipfsHash) {
  try {
    const response = await axios.delete(`${PINATA_API_URL}/pinning/unpin/${ipfsHash}`, {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error removing from Pinata:", error.response?.data || error.message)
    throw new Error(error.response?.data?.error || "Failed to remove from IPFS")
  }
}

// Function to get list of pinned files for a user
export async function getPinataFilesByMetadata(userId) {
  try {
    const response = await axios.get(`${PINATA_API_URL}/data/pinList`, {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      params: {
        metadata: JSON.stringify({
          keyvalues: {
            userId: {
              value: userId,
              op: "eq",
            },
          },
        }),
      },
    })

    return response.data.rows
  } catch (error) {
    console.error("Error fetching from Pinata:", error.response?.data || error.message)
    throw new Error(error.response?.data?.error || "Failed to fetch from IPFS")
  }
}
