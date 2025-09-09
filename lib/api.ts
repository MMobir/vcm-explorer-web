const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://vcm-fyi-api-staging.fly.dev'

export interface Project {
  project_id: string
  name: string
  country: string
  category: string
  project_type: string
  protocol: string
  registry: string
  status: string
  proponent: string
  is_compliance: boolean
  credits_issued: number
  credits_retired: number
}

export interface Transaction {
  project_id: string
  transaction_type: string
  transaction_date: string
  vintage: number
  quantity: number
  registry_user?: string
  retirement_account?: string
  retirement_reason?: string
  retirement_note?: string
}

export interface ApiResponse<T> {
  terms: string
  data: T
  count?: number
  current_page?: number
  per_page?: number
  total_pages?: number
}

function constructSearch(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v))
      } else {
        searchParams.append(key, String(value))
      }
    }
  })
  
  return searchParams.toString()
}

export async function fetchAPI<T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<ApiResponse<T>> {
  const search = params ? `?${constructSearch(params)}` : ''
  const url = `/api/query?path=${endpoint}${search ? '&' + search.slice(1) : ''}`
  
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

export const api = {
  projects: {
    list: (params?: {
      page?: number
      per_page?: number
      registries?: string[]
      categories?: string[]
      project_types?: string[]
      countries?: string[]
      protocols?: string[]
      compliance?: string
      search?: string
    }) => fetchAPI<Project[]>('projects', params),
    
    get: (id: string) => fetchAPI<Project>(`projects/${id}`),
  },
  
  transactions: {
    list: (params?: {
      page?: number
      per_page?: number
      project_id?: string
      transaction_type?: string
      vintage?: number
      registries?: string[]
    }) => fetchAPI<Transaction[]>('credits', params),
    
    byProject: (projectId: string, params?: {
      page?: number
      per_page?: number
    }) => fetchAPI<Transaction[]>('credits', { ...params, project_id: projectId }),
  },
  
  charts: {
    creditsOverTime: (params?: {
      registry?: string
      category?: string
    }) => fetchAPI<any>('charts/credits-over-time', params),
    
    projectsByCategory: () => fetchAPI<any>('charts/projects-by-category'),
  }
}
