import { useEffect, useState } from 'react'
import AdminLayout from '~/components/admin/AdminLayout'

function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(';').shift()!
  return ''
}

interface PartnerItem { id?: number; name: string; url?: string | null; logoUrl?: string | null }

export default function AdminPartners({ partners }: { partners?: PartnerItem[] }) {
  const [items, setItems] = useState<PartnerItem[]>(partners || [])
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [currentKey, setCurrentKey] = useState<string>('')
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [orderDirty, setOrderDirty] = useState(false)

  const load = async () => {
    const qs = currentKey !== '' ? `?key=${encodeURIComponent(currentKey)}` : ''
    const r = await fetch(`/api/admin/partners${qs}`)
    const data = await r.json()
    setItems(data)
  }

  useEffect(() => {
    if (!partners) load()
  }, [])

  const add = async () => {
    setMessage(null)
    let logoUrl: string | null = null

    if (file) {
      const form = new FormData()
      form.append('logo', file)
      const upRes = await fetch('/api/admin/partners/upload', {
        method: 'POST',
        headers: { 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '' },
        credentials: 'same-origin',
        body: form,
      })
      const upData = await upRes.json().catch(() => null)
      if (!upRes.ok || !upData?.publicUrl) {
        setMessage("Échec de l'upload du logo")
        return
      }
      logoUrl = upData.publicUrl
    }

    const createRes = await fetch('/api/admin/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '' },
      credentials: 'same-origin',
      body: JSON.stringify({ name, url, logoUrl, key: currentKey }),
    })
    if (!createRes.ok) {
      const err = await createRes.json().catch(() => null)
      setMessage(err?.error || 'Échec de la création du partenaire')
      return
    }

    setName('')
    setUrl('')
    setFile(null)
    setMessage('Partenaire ajouté ✅')
    await load()
  }

  const remove = async (id?: number) => {
    if (!id) return
    await fetch(`/api/admin/partners/${id}`, {
      method: 'DELETE',
      headers: { 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '' },
      credentials: 'same-origin',
    })
    await load()
  }

  const onDragStart = (index: number) => setDragIndex(index)
  const onDragOver = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    const copy = [...items]
    const [moved] = copy.splice(dragIndex, 1)
    copy.splice(index, 0, moved)
    setItems(copy)
    setDragIndex(index)
    setOrderDirty(true)
  }
  const onDrop = () => setDragIndex(null)

  const saveOrder = async () => {
    const ids = items.map((it) => it.id).filter(Boolean) as number[]
    await fetch('/api/admin/partners/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '' },
      credentials: 'same-origin',
      body: JSON.stringify({ ids }),
    })
    setOrderDirty(false)
  }

  return (
    <AdminLayout title="Partenaires">
      <div className="space-y-8">
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Groupe (key)</h2>
          <div className="flex items-center gap-2 max-w-3xl">
            <input className="border px-3 py-2 rounded w-72" placeholder="Ex: home, sponsors, footer..." value={currentKey} onChange={(e) => setCurrentKey(e.target.value)} />
            <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800" onClick={load}>Charger</button>
            {orderDirty && (
              <button className="ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={saveOrder}>Enregistrer l'ordre</button>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">Laissez vide pour le groupe par défaut (key null).</p>
        </div>
        <div className="bg-gray-50 border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Ajouter un partenaire</h2>
          <div className="grid sm:grid-cols-3 gap-2 max-w-3xl">
            <input className="border px-3 py-2 rounded" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="border px-3 py-2 rounded" placeholder="Lien (site ou réseau)" value={url} onChange={(e) => setUrl(e.target.value)} />
            <input className="border px-3 py-2 rounded" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="sm:col-span-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={add}>Ajouter</button>
              {message && <span className="ml-3 text-green-700">{message}</span>}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Liste</h2>
          <ul className="space-y-2">
            {items.map((p, idx) => (
              <li
                key={p.id}
                className={`border rounded-lg p-4 flex items-center justify-between ${dragIndex === idx ? 'bg-gray-50' : ''}`}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={(e) => onDragOver(e, idx)}
                onDrop={onDrop}
              >
                <div className="flex items-center gap-3">
                  {p.logoUrl && <img src={p.logoUrl} alt={p.name} className="h-10 w-10 object-contain" />}
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    {p.url && <div className="text-sm text-blue-700 underline truncate max-w-xl"><a href={p.url} target="_blank" rel="noreferrer">{p.url}</a></div>}
                  </div>
                </div>
                <button className="text-red-600 hover:underline" onClick={() => remove(p.id)}>Supprimer</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}
