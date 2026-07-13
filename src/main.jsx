import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App.jsx'
import TodayHabitPage from './pages/TodayHabitPage.jsx';
import StudyCreatePage from './pages/StudyCreatePage.jsx';
import StudyListPage from './pages/StudyListPage.jsx';

import TodayFocusPage from './pages/TodayFocusPage.jsx';

function Main() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<StudyListPage />} />
                    <Route path="study-create" element={<StudyCreatePage />} />
                    <Route path="study/:id/habit" element={<TodayHabitPage />} />
                    <Route path="study/:id/focus" element={<TodayFocusPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
export default Main;
