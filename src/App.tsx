import { HashRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './lib/store';
import Home from './pages/Home';
import Month from './pages/Month';
import Person from './pages/Person';
import People from './pages/People';
import Gallery from './pages/Gallery';
import PersonForm from './components/PersonForm';

function Shell() {
  const loc = useLocation();
  const { openForm } = useStore();
  return (
    <>
      <header className="top">
        <NavLink to="/" className="logo script">Memory Calendar</NavLink>
        <nav>
          <NavLink to="/" end>Календарь</NavLink>
          <NavLink to="/people">Именинники</NavLink>
          <NavLink to="/gallery">Галерея</NavLink>
          <button className="btn small" onClick={() => openForm()}>Добавить</button>
        </nav>
      </header>
      <main key={loc.pathname} className="page">
        <Routes location={loc}>
          <Route path="/" element={<Home />} />
          <Route path="/month/:n" element={<Month />} />
          <Route path="/person/:id" element={<Person />} />
          <Route path="/people" element={<People />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <PersonForm />
    </>
  );
}
export default function App() {
  return <StoreProvider><HashRouter><Shell /></HashRouter></StoreProvider>;
}
