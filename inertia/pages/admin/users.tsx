import { useEffect, useState } from 'react'
import AdminLayout from '~/components/admin/AdminLayout'

function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(';').shift()!
  return ''
}

type UserItem = {
  id: number
  fullName: string | null
  email: string
  role: 'user' | 'admin'
  scopes: string[]
}

export default function AdminUsers({ users }: { users?: UserItem[] }) {
  const [items, setItems] = useState<UserItem[]>(users || [])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const load = async () => {
    const r = await fetch('/api/admin/users')
    const data = await r.json()
    setItems(data)
  }

  useEffect(() => {
    if (!users) load()
  }, [])

  const updateRole = async (id: number, role: 'user' | 'admin') => {
    setLoading(true)
    setMessage(null)
    try {
      const r = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ role }),
      })
      if (!r.ok) {
        const data = await r.json().catch(() => ({}))
        throw new Error(data?.error || 'Erreur lors de la mise à jour')
      }
      setMessage('Sauvegardé ✅')
      await load()
    } catch (e: any) {
      setMessage(e?.message || 'Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Utilisateurs">
      <div className="space-y-4">
        <div className="text-sm text-gray-600">Promouvoir ou retirer les droits administrateur des comptes.</div>
        <div className="overflow-auto">
          <table className="min-w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 border-b">Nom</th>
                <th className="text-left px-4 py-2 border-b">Email</th>
                <th className="text-left px-4 py-2 border-b">Rôle</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{u.fullName || <span className="text-gray-500">(sans nom)</span>}</td>
                  <td className="px-4 py-2 border-b">{u.email}</td>
                  <td className="px-4 py-2 border-b">
                    <select
                      className="border px-2 py-1 rounded bg-white"
                      value={u.role}
                      onChange={(e) => updateRole(u.id, e.target.value as 'user' | 'admin')}
                      disabled={loading}
                    >
                      <option value="user">Utilisateur</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {message && <div className="text-sm text-green-700">{message}</div>}
      </div>
    </AdminLayout>
  )
}
