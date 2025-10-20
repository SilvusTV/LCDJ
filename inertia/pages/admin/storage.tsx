import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '~/components/admin/AdminLayout'
import { useApi } from '../../utils/ApiRequest'

function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(';').shift()!
  return ''
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function AdminStorage({ bucket }: { bucket: string }) {
  const [prefix, setPrefix] = useState('')
  const { data, isLoading, reload } = useApi<{
    prefix: string
    folders: { prefix: string; name: string }[]
    files: { key: string; name: string; size: number; lastModified: string | null }[]
    breadcrumb: { name: string; prefix: string }[]
  }>('admin/storage/list', { method: 'GET', queryParams: { prefix }, deps: [prefix] })

  const breadcrumb = data?.breadcrumb || []
  const folders = data?.folders || []
  const files = data?.files || []

  const currentPathDisplay = useMemo(() => (prefix ? '/' + prefix : '/'), [prefix])

  const goTo = (p: string) => setPrefix(p)

  const makeSignedUrl = async (key: string, disposition: 'inline' | 'attachment') => {
    const qs = new URLSearchParams({ key, disposition }).toString()
    const base = (import.meta.env.VITE_API_URL as string | undefined) || '/api'
    const res = await fetch(`${base}/admin/storage/signed-url?${qs}`, { credentials: 'include' })
    const json = await res.json()
    return json.url as string
  }

  const viewFile = async (key: string) => {
    const url = await makeSignedUrl(key, 'inline')
    window.open(url, '_blank')
  }

  const downloadFile = async (key: string) => {
    const url = await makeSignedUrl(key, 'attachment')
    window.open(url, '_blank')
  }

  const deleteFile = async (key: string) => {
    if (!confirm('Supprimer ce fichier ?')) return
    const base = (import.meta.env.VITE_API_URL as string | undefined) || '/api'
    const qs = new URLSearchParams({ key }).toString()
    await fetch(`${base}/admin/storage/object?${qs}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '' },
    })
    reload()
  }

  const renameFile = async (key: string) => {
    const name = key.split('/').pop() || ''
    const baseName = prompt('Nouveau nom de fichier', name)
    if (!baseName) return
    const toKey = (prefix ? prefix.replace(/\/$/, '') + '/' : '') + baseName
    const base = (import.meta.env.VITE_API_URL as string | undefined) || '/api'
    await fetch(`${base}/admin/storage/rename`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '' },
      body: JSON.stringify({ fromKey: key, toKey }),
    })
    reload()
  }

  useEffect(() => {
    // Optional: refresh when prefix changes
  }, [prefix])

  return (
    <AdminLayout title={`Fichiers du bucket: ${bucket}`}>
      <div className="mb-4 text-sm text-gray-600">Chemin: {currentPathDisplay}</div>

      <div className="breadcrumbs mb-4 text-sm">
        {breadcrumb.map((b, i) => (
          <span key={b.prefix}>
            <a className="text-blue-600 hover:underline cursor-pointer" onClick={() => goTo(b.prefix)}>
              {b.name || 'root'}
            </a>
            {i < breadcrumb.length - 1 ? ' / ' : ''}
          </span>
        ))}
      </div>

      {isLoading && <div>Chargement...</div>}

      {!isLoading && (
        <div className="space-y-6">
          <div>
            <div className="font-semibold mb-2">Dossiers</div>
            {folders.length === 0 && <div className="text-gray-500 text-sm">Aucun dossier</div>}
            <ul className="divide-y rounded border bg-white">
              {folders.map((f) => (
                <li key={f.prefix} className="flex items-center justify-between p-3 hover:bg-gray-50">
                  <button className="text-left font-medium text-blue-700" onClick={() => goTo(f.prefix.replace(/\/$/, ''))}>
                    📁 {f.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-semibold mb-2">Fichiers</div>
            {files.length === 0 && <div className="text-gray-500 text-sm">Aucun fichier</div>}
            <ul className="divide-y rounded border bg-white">
              {files.map((f) => (
                <li key={f.key} className="flex items-center justify-between p-3 hover:bg-gray-50">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="truncate" title={f.key}>
                      🗎 {f.name}
                    </span>
                    <span className="text-xs text-gray-500">{formatBytes(f.size)}</span>
                    {f.lastModified && (
                      <span className="text-xs text-gray-400">{new Date(f.lastModified).toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 text-sm border rounded hover:bg-gray-100" onClick={() => viewFile(f.key)}>
                      Voir
                    </button>
                    <button className="px-2 py-1 text-sm border rounded hover:bg-gray-100" onClick={() => downloadFile(f.key)}>
                      Télécharger
                    </button>
                    <button className="px-2 py-1 text-sm border rounded hover:bg-gray-100" onClick={() => renameFile(f.key)}>
                      Renommer
                    </button>
                    <button className="px-2 py-1 text-sm border rounded text-red-600 hover:bg-red-50" onClick={() => deleteFile(f.key)}>
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
