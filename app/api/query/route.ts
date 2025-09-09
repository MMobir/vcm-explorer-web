import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

function constructSearch(search: Record<string, any> = {}): string {
  const params = new URLSearchParams()

  Object.keys(search).forEach((key) => {
    const value = search[key]
    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry))
    } else if (value !== undefined && value !== null) {
      params.append(key, value)
    }
  })

  return params.toString()
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')
    
    if (!path) {
      return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 })
    }

    // Remove 'path' from params and construct query for API
    const apiParams: Record<string, any> = {}
    searchParams.forEach((value, key) => {
      if (key !== 'path') {
        if (apiParams[key]) {
          if (Array.isArray(apiParams[key])) {
            apiParams[key].push(value)
          } else {
            apiParams[key] = [apiParams[key], value]
          }
        } else {
          apiParams[key] = value
        }
      }
    })

    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/${path}`)
    apiUrl.search = constructSearch(apiParams)

    const response = await fetch(apiUrl.toString(), {
      headers: { 'X-API-KEY': process.env.API_KEY! },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    
    return NextResponse.json({
      terms: 'https://offsets-db-data.readthedocs.io/en/latest/TERMS-OF-DATA-ACCESS.html',
      ...result,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
