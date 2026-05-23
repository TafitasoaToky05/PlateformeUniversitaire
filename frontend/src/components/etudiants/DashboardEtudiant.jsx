import React from 'react';

// Composant simple pour une carte d'information
const StatCard = ({ title, value }) => (
  <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', flex: 1 }}>
    <h3>{title}</h3>
    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</p>
  </div>
);

export default function DashboardEtudiant() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Mon Espace Étudiant</h1>
      
      {/* Zone des statistiques */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <StatCard title="Moyenne Générale" value="14.5/20" />
        <StatCard title="Cours à venir" value="3" />
        <StatCard title="Absences" value="2" />
      </div>

      {/* Zone du contenu principal */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <section style={{ border: '1px solid #eee', padding: '20px' }}>
          <h2>Emploi du temps</h2>
          <ul>
            <li>09:00 - Mathématiques</li>
            <li>11:00 - Informatique</li>
            <li>14:00 - Gestion de projet</li>
          </ul>
        </section>

        <section style={{ border: '1px solid #eee', padding: '20px' }}>
          <h2>Dernières notes</h2>
          <ul>
            <li>Web Design: 16/20</li>
            <li>Base de données: 13/20</li>
          </ul>
        </section>
      </div>
    </div>
  );
}