import { Link, useParams, useLocation } from 'react-router-dom';

import Header from '../components/Header.jsx';
import FocusTimer from '../components/focus/FocusTimer.jsx';
import FocusPoint from '../components/focus/FocusPoint.jsx';
import arrowRightIcon from '../assets/img/ic_arrow_right.svg';

import './TodayFocusPage.css';

// ===================================================
// 확인용 임시 데이터
// ===================================================

const MOCK_FOCUS_DATA = {
    studyName: '스터디 네임 테스트',
    currentPoint: 30,
};


function FocusPage() {
    const { id: studyId } = useParams();
    // const password = location.state?.password;
    const password = '1234';   // 임시 테스트용, 나중에 위 줄로 교체
    const location = useLocation();

    const {
        studyName,
        currentPoint,
    } = MOCK_FOCUS_DATA;

    return (
        <div className="focus-page">

            <div className="focus-page__container">
                <main className="focus-page__card">
                    <section className="focus-page__study-header">
                        <div className="focus-page__study-info">
                            <h1 className="focus-page__study-name">
                                {studyName}
                            </h1>

                            <FocusPoint point={currentPoint} />
                        </div>

                        <nav
                            className="focus-page__navigation"
                            aria-label="스터디 페이지 이동"
                        >
                            <Link
                                className="focus-page__navigation-button"
                                to={`/study/${studyId}/habit`}
                            >
                                <span>오늘의 습관</span>

                                <img
                                    className="focus-page__navigation-icon"
                                    src={arrowRightIcon}
                                    alt=""
                                />
                            </Link>

                            <Link
                                className="focus-page__navigation-button focus-page__navigation-button--home"
                                to="/"
                            >
                                <span>홈</span>

                                <img
                                    className="focus-page__navigation-icon"
                                    src={arrowRightIcon}
                                    alt=""
                                />
                            </Link>
                        </nav>
                    </section>

                    <section className="focus-page__content">
                        <h2 className="focus-page__section-title">
                            오늘의 집중
                        </h2>

                        <div className="focus-page__timer-slot">
                            <div className="focus-page__timer-placeholder">
                                <FocusTimer studyId={studyId} password={password} />
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default FocusPage;