import { useLocation, useParams } from 'react-router-dom';
import FocusTimer from '../components/focus/FocusTimer.jsx';

export default function TodayFocusPage() {
    // const password = location.state?.password;
    const password = '1234';   // 임시 테스트용, 나중에 위 줄로 교체
    const { studyId } = useParams();          // URL에서 studyId 꺼내기
    const location = useLocation();
    return <>
        <FocusTimer studyId={studyId} password={password} />
    </>
}