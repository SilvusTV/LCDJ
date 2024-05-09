import { useState, useEffect, useCallback } from 'react'

type RequestOptions = {
  method?: 'GET' | 'DELETE' | 'PUT' | 'POST'
  body?: unknown
  queryParams?: Record<string, any>
  disable?: boolean
  deps?: unknown[]
}

type ApiResponse<T> = {
  data: T | null
  error: Error | null
  isLoading: boolean
  reload: () => void
}

export const useApi = <T>(
  url: string,
  { queryParams, method, body, disable, deps = [] }: RequestOptions
): ApiResponse<T> => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [key, setKey] = useState<number>(0)

  const abortController = new AbortController()

  const doRequest = useCallback(async () => {
    if (disable) {
      return
    }

    const queryString = queryParams
      ? '?' +
        Object.keys(queryParams)
          .reduce((acc: string[], key) => {
            const value = queryParams[key]
            if (value !== undefined && value !== null) {
              acc.push(`${key}=${value}`)
            }
            return acc
          }, [])
          .join('&')
      : ''

    try {
      const response = await fetch(`http://localhost:3333/api/${url}${queryString}`, {
        method,
        mode: 'cors',
        credentials: 'include',
        signal: abortController.signal,
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`)
      }

      const result = await response.text()
      setData(JSON.parse(result) as T)
    } catch (error) {
      setError(error)
    } finally {
      setIsLoading(false)
    }
    /* eslint react-hooks/exhaustive-deps: 0 */
  }, [queryParams, disable])

  useEffect(() => {
    doRequest()
    /* eslint react-hooks/exhaustive-deps: 0 */
  }, [key, disable, ...deps])

  const reload = () => {
    setIsLoading(true)
    setKey((prevKey) => prevKey + 1)
  }
  return { data, error, isLoading, reload }
}
