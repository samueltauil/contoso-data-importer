import { Header } from './components/layout';
import { Dashboard } from './components/pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
