import Header from './components/Header.jsx';
import { Outlet } from 'react-router-dom';
import './font.css';
import './style.css';
import './dark-mode.css';
import DarkModeButton from './components/DarkModeButton.jsx';
import ScrollToTopButton from './components/ScrollToTopButton.jsx';

function App() {
  return (
    <>
      <Header />
      <Outlet />
      <ScrollToTopButton />
      <DarkModeButton/>
    </>
  )
}

export default App;
