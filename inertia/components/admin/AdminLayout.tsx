import { ReactNode } from 'react'

function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(';').shift()!
  return ''
}

export default function AdminLayout({ title, children }: { title?: string; children: ReactNode }) {
  const logout = async () => {
    try {
      await fetch('/logout', {
        method: 'POST',
        headers: { 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '' },
        credentials: 'same-origin',
      })
      window.location.assign('/')
    } catch {}
  }

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <a
      href={href}
      className="block px-3 py-2 rounded hover:bg-gray-100 text-gray-800 transition-colors"
    >
      {label}
    </a>
  )

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/admin" className="font-extrabold text-xl">Backoffice</a>
            {title && <span className="text-gray-400">/</span>}
            {title && <h1 className="font-semibold text-lg">{title}</h1>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded bg-gray-900 text-white hover:bg-black transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-[220px,1fr] gap-6">
        <aside className="md:sticky md:top-6 h-max">
          <nav className="bg-white border rounded-lg p-2 space-y-1">
            <NavLink href="/admin" label="Tableau de bord" />
            <NavLink href="/admin/settings" label="Paramètres" />
            <NavLink href="/admin/news" label="Nos Actus" />
            <NavLink href="/admin/partners" label="Partenaires" />
            <NavLink href="/admin/keyfigures" label="Chiffres clés" />
            <NavLink href="/admin/storage" label="Gestion S3" />
            <NavLink href="/admin/users" label="Utilisateurs" />
          </nav>
        </aside>

        <main>
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
