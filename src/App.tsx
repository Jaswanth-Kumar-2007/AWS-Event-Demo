import { useState } from 'react';
import { ChallengeProvider, useChallenge } from '@/context/ChallengeContext';
import { AppShell, type Page } from '@/components/AppShell';
import { Registration } from '@/pages/Registration';
import { Home } from '@/pages/Home';
import { Compute } from '@/pages/Compute';
import { Storage } from '@/pages/Storage';
import { DatabasePage } from '@/pages/Database';
import { Hosting } from '@/pages/Hosting';
import { Complete } from '@/pages/Complete';
import { CloudJourney } from '@/pages/CloudJourney';
import { Glossary } from '@/pages/Glossary';
import { Organizer } from '@/pages/Organizer';

function ChallengeApp() {
  const { participant, loading } = useChallenge();
  const [page, setPage] = useState<Page>('home');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cloud-950">
        <div className="flex items-center gap-3 text-cloud-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-cloud-600 border-t-accent-400" />
          Loading...
        </div>
      </div>
    );
  }

  if (!participant) {
    return <Registration />;
  }

  const renderPage = () => {
    switch (page) {
      case 'home': return <Home onNavigate={setPage} />;
      case 'compute': return <Compute onNavigate={setPage} />;
      case 'storage': return <Storage onNavigate={setPage} />;
      case 'database': return <DatabasePage onNavigate={setPage} />;
      case 'hosting': return <Hosting onNavigate={setPage} />;
      case 'complete': return <Complete onNavigate={setPage} />;
      case 'journey': return <CloudJourney />;
      case 'glossary': return <Glossary />;
      case 'organizer': return <Organizer />;
      default: return <Home onNavigate={setPage} />;
    }
  };

  return (
    <AppShell current={page} onNavigate={setPage}>
      {renderPage()}
    </AppShell>
  );
}

function App() {
  return (
    <ChallengeProvider>
      <ChallengeApp />
    </ChallengeProvider>
  );
}

export default App;
