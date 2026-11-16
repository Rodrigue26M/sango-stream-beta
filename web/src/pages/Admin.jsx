import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [tiers, setTiers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUser) setUser(JSON.parse(storedUser));

    fetch(`${API_URL}/tiers`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setTiers(data.tiers || []))
      .catch(() => {});
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Bannière Bêta */}
      <div className="border-b border-orange-500/20 bg-orange-500/10 px-4 py-2 text-center text-xs font-semibold text-orange-200">
        🚧 Bêta publique Sango Stream — Version de démonstration pour investisseurs
      </div>

      {/* Barre de navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-900 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-500">Sango Stream</h1>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-zinc-400">
              👋 {user.full_name || user.email}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm transition"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Tableau de bord administrateur</h2>
          <p className="text-zinc-400">
            Bienvenue sur la plateforme de streaming musical Sango Stream.
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="text-zinc-400 text-sm mb-1">Utilisateurs actifs</div>
            <div className="text-3xl font-bold text-brand-500">11</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="text-zinc-400 text-sm mb-1">Titres en catalogue</div>
            <div className="text-3xl font-bold text-brand-500">3</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="text-zinc-400 text-sm mb-1">Abonnements PRO</div>
            <div className="text-3xl font-bold text-brand-500">6</div>
          </div>
        </div>

        {/* Paliers d'abonnement */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Paliers d'abonnement</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map((tier) => (
              <div
                key={tier.code}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
              >
                <div className="text-brand-500 font-bold text-lg mb-1">
                  {tier.name_fr}
                </div>
                <div className="text-3xl font-bold mb-2">
                  {tier.price} <span className="text-sm text-zinc-400">{tier.currency}</span>
                </div>
                <div className="text-sm text-zinc-400">
                  {tier.duration_days} jours • {tier.name_en}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pool de répartition */}
        <div className="bg-gradient-to-br from-brand-900/30 to-zinc-900 border border-brand-500/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-brand-500">
            💰 Répartition du pool (Novembre 2026)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-zinc-400 text-sm">Total abonnements</div>
              <div className="text-2xl font-bold">60 000 XAF</div>
            </div>
            <div>
              <div className="text-zinc-400 text-sm">Part plateforme (40%)</div>
              <div className="text-2xl font-bold">24 000 XAF</div>
            </div>
            <div>
              <div className="text-zinc-400 text-sm">Pool artistes (60%)</div>
              <div className="text-2xl font-bold text-brand-500">36 000 XAF</div>
            </div>
            <div>
              <div className="text-zinc-400 text-sm">Streams valides</div>
              <div className="text-2xl font-bold">3 000</div>
            </div>
          </div>
        </div>

        {/* Répartition par artiste */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Gains par artiste</h3>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-zinc-800 text-zinc-400 text-sm">
                <tr>
                  <th className="px-6 py-3">Artiste</th>
                  <th className="px-6 py-3">Streams</th>
                  <th className="px-6 py-3">Part (%)</th>
                  <th className="px-6 py-3 text-right">Gains</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                <tr>
                  <td className="px-6 py-4 font-medium">Artist A 🇨🇲</td>
                  <td className="px-6 py-4">600</td>
                  <td className="px-6 py-4">20%</td>
                  <td className="px-6 py-4 text-right font-bold text-brand-500">7 200 XAF</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Artist B 🇬🇦</td>
                  <td className="px-6 py-4">1 400</td>
                  <td className="px-6 py-4">46,7%</td>
                  <td className="px-6 py-4 text-right font-bold text-brand-500">16 800 XAF</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Artist C 🇨🇬</td>
                  <td className="px-6 py-4">1 000</td>
                  <td className="px-6 py-4">33,3%</td>
                  <td className="px-6 py-4 text-right font-bold text-brand-500">12 000 XAF</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-zinc-500">
          Sango Stream © 2026 — Plateforme de streaming musical panafricaine
        </div>
      </main>
    </div>
  );
}