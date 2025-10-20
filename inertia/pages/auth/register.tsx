import { useState, FormEvent } from 'react'

function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(';').shift()!
  return ''
}

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const token = getCookie('XSRF-TOKEN')
      const r = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': token || '',
        },
        body: JSON.stringify({ fullName, email, password }),
      })
      const data = await r.json()
      if (!r.ok || !data.success) {
        setError(data.error || "Inscription échouée")
      } else {
        window.location.assign(data.redirectTo || '/')
      }
    } catch (e) {
      setError("Inscription échouée")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-screen flex justify-center">
      <div className="w-8/12 py-12 max-w-xl">
        <a href="/">← Retour</a>
        <h1 className="text-3xl font-bold mb-6">Créer un compte</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            className="border px-3 py-2 rounded"
            type="text"
            placeholder="Nom complet (optionnel)"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            className="border px-3 py-2 rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="border px-3 py-2 rounded"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
          {error && <div className="text-red-600">{error}</div>}
        </form>
        <div className="mt-4">
          Déjà un compte ?{' '}
          <a className="text-blue-600 underline" href="/login">
            Se connecter
          </a>
        </div>
      </div>
    </div>
  )
}
