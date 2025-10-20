import { useEffect, useState } from 'react'
import AdminLayout from '~/components/admin/AdminLayout'

function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(';').shift()!
  return ''
}

interface LinkItem { title: string; url: string }
interface ContactInfo { email?: string; address?: string; city?: string; country?: string; phone?: string }

const emptySocials = { instagram: '', facebook: '', linkedin: '', tiktok: '' }

function socialsArrayToFixed(arr: LinkItem[] | undefined) {
  const map = { ...emptySocials }
  ;(arr || []).forEach((s) => {
    const t = (s.title || '').toLowerCase()
    if (t.includes('instagram')) map.instagram = s.url || ''
    if (t.includes('facebook')) map.facebook = s.url || ''
    if (t.includes('linkedin')) map.linkedin = s.url || ''
    if (t.includes('tiktok')) map.tiktok = s.url || ''
  })
  return map
}

function socialsFixedToArray(obj: typeof emptySocials): LinkItem[] {
  return [
    { title: 'Instagram', url: obj.instagram || '' },
    { title: 'Facebook', url: obj.facebook || '' },
    { title: 'LinkedIn', url: obj.linkedin || '' },
    { title: 'TikTok', url: obj.tiktok || '' },
  ]
}

export default function AdminSettings({ settings }: { settings?: { socials: LinkItem[]; homeLinks: LinkItem[]; contact?: ContactInfo } }) {
  const [socialsFixed, setSocialsFixed] = useState(socialsArrayToFixed(settings?.socials))
  const [homeLinks, setHomeLinks] = useState<LinkItem[]>(settings?.homeLinks || [])
  const [contact, setContact] = useState<ContactInfo>({
    email: settings?.contact?.email || '',
    address: settings?.contact?.address || '',
    city: settings?.contact?.city || '',
    country: settings?.contact?.country || '',
    phone: settings?.contact?.phone || '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!settings) {
      fetch('/api/admin/settings')
        .then((r) => r.json())
        .then((data) => {
          setSocialsFixed(socialsArrayToFixed(data?.socials))
          setHomeLinks(data?.homeLinks || [])
          setContact({
            email: data?.contact?.email || '',
            address: data?.contact?.address || '',
            city: data?.contact?.city || '',
            country: data?.contact?.country || '',
            phone: data?.contact?.phone || '',
          })
        })
        .catch(() => {})
    }
  }, [])

  const save = async () => {
    setSaving(true)
    setMessage(null)
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ socials: socialsFixedToArray(socialsFixed), homeLinks, contact }),
      })
      setMessage('Enregistré ✅')
    } catch (e) {
      setMessage("Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  const updateItem = (list: LinkItem[], idx: number, field: keyof LinkItem, value: string) => {
    const copy = list.slice()
    copy[idx] = { ...copy[idx], [field]: value }
    return copy
  }

  const addItem = (setter: (v: LinkItem[]) => void) => setter((s) => [...s, { title: '', url: '' }])
  const removeItem = (list: LinkItem[], idx: number, setter: (v: LinkItem[]) => void) =>
    setter(list.filter((_, i) => i !== idx))

  return (
    <AdminLayout title="Paramètres">
      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-semibold mb-3">Réseaux sociaux</h2>
          <div className="space-y-3 max-w-2xl">
            <div className="flex gap-2 items-center">
              <label className="w-32">Instagram</label>
              <input className="border px-3 py-2 rounded flex-1" placeholder="URL Instagram" value={socialsFixed.instagram} onChange={(e) => setSocialsFixed({ ...socialsFixed, instagram: e.target.value })} />
            </div>
            <div className="flex gap-2 items-center">
              <label className="w-32">Facebook</label>
              <input className="border px-3 py-2 rounded flex-1" placeholder="URL Facebook" value={socialsFixed.facebook} onChange={(e) => setSocialsFixed({ ...socialsFixed, facebook: e.target.value })} />
            </div>
            <div className="flex gap-2 items-center">
              <label className="w-32">LinkedIn</label>
              <input className="border px-3 py-2 rounded flex-1" placeholder="URL LinkedIn" value={socialsFixed.linkedin} onChange={(e) => setSocialsFixed({ ...socialsFixed, linkedin: e.target.value })} />
            </div>
            <div className="flex gap-2 items-center">
              <label className="w-32">TikTok</label>
              <input className="border px-3 py-2 rounded flex-1" placeholder="URL TikTok" value={socialsFixed.tiktok} onChange={(e) => setSocialsFixed({ ...socialsFixed, tiktok: e.target.value })} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Liens de la page d'accueil</h2>
          <div className="space-y-3">
            {homeLinks.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  className="border px-3 py-2 rounded flex-1"
                  placeholder="Titre"
                  value={s.title}
                  onChange={(e) => setHomeLinks(updateItem(homeLinks, i, 'title', e.target.value))}
                />
                <input
                  className="border px-3 py-2 rounded flex-1"
                  placeholder="URL"
                  value={s.url}
                  onChange={(e) => setHomeLinks(updateItem(homeLinks, i, 'url', e.target.value))}
                />
                <button className="text-red-600 hover:underline" onClick={() => removeItem(homeLinks, i, setHomeLinks)}>
                  Supprimer
                </button>
              </div>
            ))}
            <button className="text-blue-600 hover:underline" onClick={() => addItem(setHomeLinks)}>
              + Ajouter
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <div className="space-y-3 max-w-2xl">
            <div className="flex gap-2 items-center">
              <label className="w-40">Email</label>
              <input className="border px-3 py-2 rounded flex-1" placeholder="Email" value={contact.email || ''} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
            </div>
            <div className="flex gap-2 items-center">
              <label className="w-40">Adresse</label>
              <input className="border px-3 py-2 rounded flex-1" placeholder="Adresse" value={contact.address || ''} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
            </div>
            <div className="flex gap-2 items-center">
              <label className="w-40">Ville</label>
              <input className="border px-3 py-2 rounded flex-1" placeholder="Ville" value={contact.city || ''} onChange={(e) => setContact({ ...contact, city: e.target.value })} />
            </div>
            <div className="flex gap-2 items-center">
              <label className="w-40">Pays</label>
              <input className="border px-3 py-2 rounded flex-1" placeholder="Pays" value={contact.country || ''} onChange={(e) => setContact({ ...contact, country: e.target.value })} />
            </div>
            <div className="flex gap-2 items-center">
              <label className="w-40">Numéro de téléphone</label>
              <input className="border px-3 py-2 rounded flex-1" placeholder="Téléphone" value={contact.phone || ''} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
            </div>
          </div>
        </section>

        <div className="flex items-center gap-4">
          <button
            onClick={save}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-700"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          {message && <span className="text-green-700">{message}</span>}
        </div>
      </div>
    </AdminLayout>
  )
}
