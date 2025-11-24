import { useEffect, useState } from 'react'
import AdminLayout from '~/components/admin/AdminLayout'

function ImgWithFallback({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [tried, setTried] = useState(false)

  const handleError = async () => {
    if (tried) return
    setTried(true)
    try {
      const base = (import.meta.env.VITE_API_URL as string | undefined) || '/api'
      const qs = new URLSearchParams({ url: src, disposition: 'inline' }).toString()
      const res = await fetch(`${base}/admin/storage/signed-url-by-url?${qs}`, { credentials: 'include' })
      const json = await res.json().catch(() => null)
      if (json && json.url) {
        setCurrentSrc(json.url as string)
      }
    } catch (_) {
      // ignore
    }
  }

  return <img src={currentSrc} alt={alt} className={className} onError={handleError} />
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(';').shift()!
  return ''
}

interface NewsItem { id?: number; title: string; link: string; imageName?: string | null }

export default function AdminNews({ news }: { news?: NewsItem[] }) {
  const [items, setItems] = useState<NewsItem[]>(news || [])
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null)

  const load = async () => {
    const r = await fetch('/api/admin/news')
    const data = await r.json()
    setItems(data)
  }

  useEffect(() => {
    if (!news) {
      load()
    }
  }, [])

  const add = async () => {
    setMessage(null)
    // Pour créer une actu, une image est requise côté backend
    if (!file) {
      setMessage("Veuillez sélectionner une image avant d'ajouter l'actualité")
      return
    }

    // 1) Uploader l'image côté serveur pour obtenir son URL publique
    const formFile = new FormData()
    formFile.append('image', file)
    const upRes = await fetch('/api/admin/news/upload-image', {
      method: 'POST',
      headers: { 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '' },
      credentials: 'same-origin',
      body: formFile,
    })
    const upData = await upRes.json().catch(() => null)
    if (!upRes.ok || !upData?.imageUrl) {
      setMessage("Échec de l'upload de l'image")
      return
    }

    const imageUrl: string = upData.imageUrl

    // 2) Créer l'actualité avec l'URL d'image
    const createRes = await fetch('/api/admin/news', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '',
      },
      credentials: 'same-origin',
      body: JSON.stringify({ title, link, imageName: imageUrl }),
    })
    if (!createRes.ok) {
      const err = await createRes.json().catch(() => null)
      setMessage(err?.error || "Échec de la création de l'actualité")
      return
    }
    setTitle('')
    setLink('')
    setFile(null)
    setMessage('Actu ajoutée ✅')
    await load()
  }

  const update = async (id?: number, currentImageName?: string | null) => {
    if (!id) return
    setMessage(null)
    try {
      let nextImageName: string | null | undefined = currentImageName

      if (file) {
        // Uploader la nouvelle image pour obtenir l'URL
        const formFile = new FormData()
        formFile.append('image', file)
        const upRes = await fetch('/api/admin/news/upload-image', {
          method: 'POST',
          headers: { 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '' },
          credentials: 'same-origin',
          body: formFile,
        })
        const upData = await upRes.json().catch(() => null)
        if (!upRes.ok || !upData?.imageUrl) {
          setMessage("Échec de l'upload de l'image")
          return
        }
        nextImageName = upData.imageUrl
      }

      const payload: any = { title, link }
      if (nextImageName !== undefined) payload.imageName = nextImageName

      const r = await fetch(`/api/admin/news/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '',
          'Accept': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      })

      if (!r.ok) {
        const data = await r.json().catch(() => null)
        setMessage(data?.error || "Erreur lors de la mise à jour")
        return
      }

      await load()
      setMessage('Actu mise à jour ✅')
      setModalOpen(false)
      setTitle('')
      setLink('')
      setFile(null)
    } catch (e) {
      setMessage("Erreur réseau lors de la mise à jour")
    }
  }

  const remove = async (id?: number) => {
    if (!id) return
    await fetch(`/api/admin/news/${id}`, {
      method: 'DELETE',
      headers: {
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '',
      },
      credentials: 'same-origin',
    })
    await load()
  }

  return (
    <AdminLayout title="Nos Actus">
      <div className="space-y-8">
        <div className="bg-gray-50 border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold mb-2">Actus</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => { setEditingItem(null); setTitle(''); setLink(''); setFile(null); setMessage(null); setModalOpen(true) }}>Ajouter une actus</button>
          </div>
          {message && <div className="text-green-700 text-sm">{message}</div>}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Liste</h2>
          <ul className="space-y-2">
            {items.map((n) => (
              <li key={n.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden border">
                    {n.imageName ? (
                      <ImgWithFallback src={n.imageName} alt={n.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Aucune image</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{n.title}</div>
                    <div className="text-sm text-gray-600 truncate max-w-xl">{n.link}</div>
                    {n.imageName && (
                      <div className="text-xs text-gray-600 truncate max-w-xl">
                        <a className="text-blue-700 underline" href={n.imageName} target="_blank" rel="noreferrer">Ouvrir l'image</a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button className="text-blue-600 hover:underline" onClick={() => { setEditingItem(n); setTitle(n.title); setLink(n.link); setFile(null); setMessage(null); setModalOpen(true) }}>Modifier</button>
                  <button className="text-red-600 hover:underline" onClick={() => remove(n.id)}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 z-10">
            <h3 className="text-lg font-semibold mb-4">{editingItem ? 'Modifier une actu' : 'Ajouter une actu'}</h3>
            <div className="space-y-3">
              <input className="border w-full px-3 py-2 rounded" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <input className="border w-full px-3 py-2 rounded" placeholder="Lien" value={link} onChange={(e) => setLink(e.target.value)} required />
              <div>
                <input className="border w-full px-3 py-2 rounded" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                {editingItem?.imageName && !file && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-600">Image actuelle:</span>
                    <a href={editingItem.imageName} target="_blank" rel="noreferrer" className="inline-block">
                      <ImgWithFallback
                        src={editingItem.imageName}
                        alt={editingItem.title || 'Image actuelle'}
                        className="w-20 h-20 object-cover rounded border hover:ring-2 hover:ring-blue-500 transition"
                      />
                    </a>
                  </div>
                )}
                {file && <div className="mt-2 text-xs text-gray-600">Nouveau fichier: {file.name}</div>}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button className="px-4 py-2 rounded border" onClick={() => setModalOpen(false)}>Annuler</button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={editingItem ? (!title || !link) : (!title || !link || !file)}
                onClick={async () => {
                  if (editingItem?.id) {
                    await update(editingItem.id, editingItem.imageName || null)
                  } else {
                    await add()
                    setModalOpen(false)
                  }
                }}
              >
                {editingItem ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
