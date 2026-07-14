import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AlertProvider } from "./components/AlertProvider.jsx";
import App from "./App.jsx";
import TodayHabitPage from "./pages/TodayHabitPage.jsx";
import StudyCreatePage from "./pages/StudyCreatePage.jsx";
import StudyListPage from "./pages/StudyListPage.jsx";
import StudyDetailPage from "./pages/StudyDetailPage.jsx";
import StudyEditPage from "./pages/StudyEditPage";
import TodayFocusPage from './pages/TodayFocusPage.jsx';

function Main() {
  return (
    <AlertProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<StudyListPage />} />
            <Route path="study-create" element={<StudyCreatePage />} />
            <Route path="study/:id" element={<StudyDetailPage />} />
            <Route path="study/:id/edit" element={<StudyEditPage />} />
            <Route path="study/:id/habit" element={<TodayHabitPage />} />
            <Route path="study/:id/focus" element={<TodayFocusPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AlertProvider>
  );
}
export default Main;
