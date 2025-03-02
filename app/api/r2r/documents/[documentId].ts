// app/api/r2r/delete/route.ts
// import { NextResponse } from 'next/server';


export async function DELETE(request) {
  console.log({ request })
  try {
    const filters = {
      document_id: {
        $eq: documentId
      }
    }

    const queryParams = new URLSearchParams({
      filters: JSON.stringify(filters)
    })

    const response = await fetch(
      `http://localhost:7272/v2/delete?${queryParams.toString()}`,
      {
        method: 'DELETE',
      }
    )

    if (response.ok) {
      logger.info(`Document deleted successfully: ${documentId}`)
      return res.status(200).json({
        success: true,
        message: `Document ${documentId} deleted successfully`,
        statusCode: response.status
      })
    }

    const errorText = await response.text()
    logger.error(`Delete failed with status ${response.status}: ${errorText}`)
    
    return res.status(response.status).json({
      success: false,
      message: `Failed to delete document: ${errorText || response.statusText}`,
      statusCode: response.status
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    logger.error(`Unexpected error during document deletion: ${errorMessage}`)
    
    return res.status(500).json({
      success: false,
      message: `Failed to delete document: ${errorMessage}`,
      statusCode: 500
    })
  }
}

