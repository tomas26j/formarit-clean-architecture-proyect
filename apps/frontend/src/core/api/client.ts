/**
 * Cliente HTTP para comunicación con el backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
  code?: string
}

export class ApiClientError extends Error {
  status: number
  errors?: Record<string, string[]>
  code?: string

  constructor(message: string, status: number, errors?: Record<string, string[]>, code?: string) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.errors = errors
    this.code = code
  }
}

/**
 * Obtiene el token de autenticación del almacenamiento local
 */
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token')
}

/**
 * Maneja la respuesta de la API y lanza errores si es necesario
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiError
    try {
      errorData = await response.json()
    } catch {
      errorData = {
        message: `Error ${response.status}: ${response.statusText}`,
        status: response.status,
      }
    }

    // Manejo especial para errores de autenticación
    if (response.status === 401) {
      localStorage.removeItem('auth_token')
      // Opcional: redirigir al login
      window.dispatchEvent(new CustomEvent('auth:logout'))
    }

    throw new ApiClientError(
      errorData.message,
      errorData.status,
      errorData.errors,
      errorData.code
    )
  }

  // Manejar respuestas vacías (204 No Content)
  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

/**
 * Construye los headers de la petición
 */
function buildHeaders(includeAuth: boolean = true): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

/**
 * GET request
 */
export async function apiGet<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: buildHeaders(includeAuth),
  })

  return handleResponse<T>(response)
}

/**
 * POST request
 */
export async function apiPost<T>(
  endpoint: string,
  data: unknown,
  includeAuth: boolean = true
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: buildHeaders(includeAuth),
    body: JSON.stringify(data),
  })

  return handleResponse<T>(response)
}

/**
 * PUT request
 */
export async function apiPut<T>(
  endpoint: string,
  data: unknown,
  includeAuth: boolean = true
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: buildHeaders(includeAuth),
    body: JSON.stringify(data),
  })

  return handleResponse<T>(response)
}

/**
 * DELETE request
 */
export async function apiDelete<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: buildHeaders(includeAuth),
  })

  return handleResponse<T>(response)
}

