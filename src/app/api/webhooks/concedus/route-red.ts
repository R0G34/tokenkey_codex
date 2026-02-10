import { NextRequest, NextResponse } from 'next/server'

/**
 * Webhook forwarder for Concedus
 * Forwards requests to ngrok tunnel, replacing domain while keeping same path
 */
export const POST = async (req: NextRequest) => {
  try {
    // Build target URL by replacing domain with ngrok
    const url = new URL(req.url)
    const targetUrl = `https://obliging-dinosaur-definitely.ngrok-free.app${url.pathname}`

    // Get original body as text (no parsing needed)
    const body = await req.text()

    console.log('🔥 original body', body)

    // Only forward x-concedus-signature header + set content-type
    const headers = new Headers()
    const signature = req.headers.get('x-concedus-signature')
    if (signature) headers.set('x-concedus-signature', signature)
    headers.set('content-type', 'application/json')

    // Forward request to target URL
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body,
    })

    console.log(`🔥 Forward response status: ${response.status}`)

    return new Response(null, { status: 200 })
  } catch (error) {
    console.error('❌ Error forwarding webhook:', error)
    console.error('❌ Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Failed to forward request', details: String(error) },
      { status: 500 },
    )
  }
}
