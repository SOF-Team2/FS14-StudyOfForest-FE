import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App.jsx'
import TodayHabitPage from './pages/TodayHabitPage.jsx';
import TodayFocusPage from './pages/TodayFocusPage.jsx';
import DesignExample from './components/DesignExample.jsx';

function Main() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<DesignExample />} />
                    <Route path="study/:id/habit" element={<TodayHabitPage />} />
                    <Route path="study/:id/focus" element={<TodayFocusPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
export default Main;
