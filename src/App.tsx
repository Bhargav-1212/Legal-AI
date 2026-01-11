import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Research from './pages/Research';
import Documents from './pages/Documents';
import Cases from './pages/Cases';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="documents" element={<Documents />} />
          <Route path="research" element={<Research />} />
          <Route path="cases" element={<Cases />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
