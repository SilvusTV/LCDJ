export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 p-6">
      <div className="max-w-lg w-full text-center">
        <div className="text-7xl font-extrabold text-red-500">403</div>
        <h1 className="text-2xl font-bold mt-2">Accès refusé</h1>
        <p className="text-gray-600 mt-2">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a href="/" className="px-4 py-2 rounded border bg-white hover:bg-gray-100">Retour à l'accueil</a>
          <a href="/login" className="px-4 py-2 rounded bg-gray-900 text-white hover:bg-black">Se connecter</a>
        </div>
      </div>
    </div>
  )
}
