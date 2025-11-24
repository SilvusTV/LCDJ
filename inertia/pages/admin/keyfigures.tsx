import { useEffect, useState } from 'react'
import AdminLayout from '~/components/admin/AdminLayout'

function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(';').shift()!
  return ''
}

interface KeyFigureItem { id?: number; title: string; value: number; unit?: string | null }

export default function AdminKeyFigures({ keyFigures }: { keyFigures?: KeyFigureItem[] }) {
  const [items, setItems] = useState<KeyFigureItem[]>(keyFigures || [])
  const [title, setTitle] = useState('')
  const [value, setValue] = useState<string>('')
  const [message, setMessage] = useState<string | null>(null)
  const [unit, setUnit] = useState<string>('')
  const [orderDirty, setOrderDirty] = useState(false)
  const [editedDirty, setEditedDirty] = useState(false)
  const [editedIds, setEditedIds] = useState<Set<number>>(new Set())
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [justSavedIds, setJustSavedIds] = useState<Set<number>>(new Set())

  const load = async () => {
    const r = await fetch('/api/admin/keyfigures')
    const data = await r.json()
    setItems(data)
  }

  useEffect(() => {
    if (!keyFigures) load()
  }, [])

  const add = async () => {
    setMessage(null)
    const num = Number(value)
    if (!title.trim() || Number.isNaN(num)) {
      setMessage('Veuillez renseigner un titre et un chiffre valide')
      return
    }
    await fetch('/api/admin/keyfigures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '' },
      credentials: 'same-origin',
      body: JSON.stringify({ title: title.trim(), value: num, unit: unit.trim() || null }),
    })
    setTitle('')
    setValue('')
    setUnit('')
    setMessage('Chiffre clé ajouté ✅')
    await load()
  }

  const save = async (item: KeyFigureItem) => {
    if (!item.id) return
    await fetch(`/api/admin/keyfigures/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '' },
      credentials: 'same-origin',
      body: JSON.stringify({ title: item.title, value: item.value, unit: (item.unit ?? null) }),
    })
    await load()
  }

  const remove = async (id?: number) => {
    if (!id) return
    await fetch(`/api/admin/keyfigures/${id}`, {
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
    await fetch('/api/admin/keyfigures/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '' },
      credentials: 'same-origin',
      body: JSON.stringify({ ids }),
    })
  }

  const saveAll = async () => {
    try {
      setSaving(true)
      setToast(null)

      // 1) Reorder if needed
      if (orderDirty) {
        const ids = items.map((it) => it.id).filter(Boolean) as number[]
        await fetch('/api/admin/keyfigures/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '' },
          credentials: 'same-origin',
          body: JSON.stringify({ ids }),
        })
      }

      // 2) Patch edited items
      const idsToPatch = Array.from(editedIds)
      for (const id of idsToPatch) {
        const it = items.find((x) => x.id === id)
        if (!it) continue
        await fetch(`/api/admin/keyfigures/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '' },
          credentials: 'same-origin',
          body: JSON.stringify({ title: it.title, value: it.value, unit: (it.unit ?? null) }),
        })
      }

      // 3) Success UI
      setJustSavedIds(new Set(editedIds))
      setToast('Modifications enregistrées ✅')
      setEditedIds(new Set())
      setEditedDirty(false)
      setOrderDirty(false)

      // Auto-hide toast and row checks
      setTimeout(() => setToast(null), 3000)
      setTimeout(() => setJustSavedIds(new Set()), 2500)

      await load()
    } catch (e) {
      setToast("Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Chiffres clés">
      <div className="space-y-8">
        <div className="bg-gray-50 border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Ajouter un chiffre clé</h2>
          <div className="grid sm:grid-cols-4 gap-2 max-w-4xl">
            <input className="border px-3 py-2 rounded" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="border px-3 py-2 rounded" placeholder="Chiffre" value={value} onChange={(e) => setValue(e.target.value)} />
            <input className="border px-3 py-2 rounded" placeholder="Unité (ex: % / km / M€)" value={unit} onChange={(e) => setUnit(e.target.value)} />
            <div className="sm:col-span-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={add}>Ajouter</button>
              {message && <span className="ml-3 text-green-700">{message}</span>}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Liste</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Astuce: glissez-déposez les lignes pour changer l’ordre. Utilisez le bouton en bas pour enregistrer.</span>
            </div>
          </div>

          <ul className="space-y-2">
            {items.map((it, idx) => (
              <li
                key={it.id ?? idx}
                className={`border rounded-lg p-4 flex items-center justify-between gap-4 ${dragIndex === idx ? 'bg-yellow-50' : ''}`}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={(e) => onDragOver(e, idx)}
                onDrop={onDrop}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="cursor-grab select-none text-gray-400" title="Glisser pour réordonner">☰</span>
                  <input
                    className="border px-3 py-2 rounded w-2/3"
                    value={it.title}
                    onChange={(e) => {
                      const copy = [...items]
                      copy[idx] = { ...it, title: e.target.value }
                      setItems(copy)
                      setEditedDirty(true)
                      if (copy[idx].id) setEditedIds(new Set([...(Array.from(editedIds)), copy[idx].id!]))
                    }}
                  />
                  <input
                    className="border px-3 py-2 rounded w-32"
                    value={String(it.value)}
                    onChange={(e) => {
                      const v = e.target.value
                      const num = Number(v)
                      const copy = [...items]
                      copy[idx] = { ...it, value: Number.isNaN(num) ? (copy[idx].value || 0) : num }
                      setItems(copy)
                      setEditedDirty(true)
                      if (copy[idx].id) setEditedIds(new Set([...(Array.from(editedIds)), copy[idx].id!]))
                    }}
                  />
                  <input
                    className="border px-3 py-2 rounded w-36"
                    placeholder="Unité"
                    value={it.unit ?? ''}
                    onChange={(e) => {
                      const copy = [...items]
                      copy[idx] = { ...it, unit: e.target.value }
                      setItems(copy)
                      setEditedDirty(true)
                      if (copy[idx].id) setEditedIds(new Set([...(Array.from(editedIds)), copy[idx].id!]))
                    }}
                  />
                </div>
                <div className="flex items-center gap-3">
                  {it.id && justSavedIds.has(it.id) && (
                    <span className="text-green-600 text-sm">Enregistré ✓</span>
                  )}
                  <button className="text-red-600 hover:underline" onClick={() => remove(it.id)}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {toast && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow">
            {toast}
          </div>
        )}

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              {editedDirty ? 'Modifications non enregistrées' : ''}
              {orderDirty ? (editedDirty ? ' • Ordre modifié' : 'Ordre modifié') : ''}
            </div>
            <button
              className={`px-4 py-2 rounded ${saving || (!orderDirty && !editedDirty) ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              onClick={saveAll}
              disabled={saving || (!orderDirty && !editedDirty)}
            >
              {saving ? 'Enregistrement…' : 'Enregistrer toutes les modifications'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
