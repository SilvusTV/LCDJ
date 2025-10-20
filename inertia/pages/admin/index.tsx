import AdminLayout from '~/components/admin/AdminLayout'

export default function AdminIndex() {
  const Card = ({ href, title, desc }: { href: string; title: string; desc: string }) => (
    <a
      href={href}
      className="border rounded-lg p-5 hover:shadow-md transition-shadow block bg-white"
    >
      <div className="font-semibold text-lg">{title}</div>
      <div className="text-gray-600 text-sm mt-1">{desc}</div>
    </a>
  )

  return (
    <AdminLayout title="Tableau de bord">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          href="/admin/settings"
          title="Paramètres"
          desc="Réseaux sociaux, liens de la page d'accueil"
        />
        <Card href="/admin/news" title="Nos Actus" desc="Gérer les actualités" />
        <Card href="/admin/partners" title="Nos Partenaires" desc="Gérer les partenaires" />
        <Card href="/admin/keyfigures" title="Chiffres clés" desc="Gérer les chiffres clés" />
        <Card href="/admin/users" title="Utilisateurs" desc="Promouvoir/déclasser des admins" />
        <Card href="/admin/storage" title="Fichiers (S3)" desc="Voir, télécharger, renommer et supprimer" />
      </div>
    </AdminLayout>
  )
}
