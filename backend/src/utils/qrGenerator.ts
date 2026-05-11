import QRCode from 'qrcode'

export interface QRPayloadParsed {
  gtin: string
  packagingBatchCode: string
  serial: string
}

export const generateQRPayload = (
  gtin: string,
  packagingBatchCode: string,
  serial: string
): string => {
  return `https://trace.aurelia.ai/amk/01/${gtin}/lot/${packagingBatchCode}/ser/${serial.padStart(6, '0')}`
}

export const parseQRPayload = (qrPayload: string): QRPayloadParsed | null => {
  try {
    const url = new URL(qrPayload)
    const pathParts = url.pathname.split('/')

    // Expected: /amk/01/{gtin}/lot/{packagingBatchCode}/ser/{serial}
    const gtinIndex = pathParts.indexOf('01')
    const lotIndex = pathParts.indexOf('lot')
    const serIndex = pathParts.indexOf('ser')

    if (gtinIndex === -1 || lotIndex === -1 || serIndex === -1) {
      return null
    }

    const gtin = pathParts[gtinIndex + 1]
    const packagingBatchCode = pathParts[lotIndex + 1]
    const serial = pathParts[serIndex + 1]

    if (!gtin || !packagingBatchCode || !serial) {
      return null
    }

    return { gtin, packagingBatchCode, serial }
  } catch (error) {
    return null
  }
}

export const generateQRImage = async (qrPayload: string): Promise<string> => {
  try {
    const dataUrl = await QRCode.toDataURL(qrPayload, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
    return dataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw error
  }
}
