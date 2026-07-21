import Header from './components/Header.jsx';
import { Outlet } from 'react-router-dom';
import './font.css';
import './style.css';
import './dark-mode.css';
import DarkModeButton from './components/DarkModeButton.jsx';

function App() {
  return (
    <>
      <Header />
      <Outlet />
      <DarkModeButton/>
    </>
  )
}

export default App;
