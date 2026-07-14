import { useEffect, useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';

import axios from '../utils/axios.js';
import FocusTimer from '../components/focus/FocusTimer.jsx';
import FocusPoint from '../components/focus/FocusPoint.jsx';
import FocusStatusAlert from '../components/focus/FocusStatusAlert.jsx';

import arrowRightIcon from '../assets/img/ic_arrow_right.svg';

import './TodayFocusPage.css';

function FocusPage() {
    const { id: studyId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const password = location.state?.password;

    const [focusData, setFocusData] = useState({
        studyName: '',
        currentPoint: 0,
    });
    const [isFocusLoading, setIsFocusLoading] = useState(true);
    const [focusLoadError, setFocusLoadError] = useState('');

    // 비밀번호 없이 들어왔으면 상세 페이지로 돌려보내기
    useEffect(() => {
        if (!password) {
            navigate(`/study/${studyId}`, { replace: true });
        }
    }, [password, studyId, navigate]);

    useEffect(() => {
        // 비밀번호가 없으면 타이머를 그리지 않음 (이동하는 동안 빈 화면)
        if (!password) return null;

        async function fetchFocusData() {
            setIsFocusLoading(true);
            setFocusLoadError('');

            try {
                const response = await axios.post(`/study/${studyId}/focus`, {
                    password,
                });

                setFocusData({
                    studyName: response.data.data.studyName,
                    currentPoint: response.data.data.currentPoint,
                });
            } catch (error) {
                console.error('오늘의 집중 조회 오류:', error);

                setFocusLoadError(
                    error?.response?.data?.message ??
                    '오늘의 집중 정보를 불러오지 못했습니다.',
                );
            } finally {
                setIsFocusLoading(false);
            }
        }

        fetchFocusData();
    }, [studyId, password]);

    const {
        studyName,
        currentPoint,
    } = focusData;

    return (
        <div className="focus-page">
            {isFocusLoading && (
                <FocusStatusAlert
                    type="loading"
                    message="오늘의 집중 정보를 불러오고 있습니다."
                />
            )}

            {!isFocusLoading && focusLoadError && (
                <FocusStatusAlert
                    type="error"
                    message={focusLoadError}
                />
            )}

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
                                to={`/study/${studyId}`}
                            >
                                <span>스터디</span>

                                <img
                                    className="focus-page__navigation-icon"
                                    src={arrowRightIcon}
                                    alt=""
                                />
                            </Link>

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
                                <FocusTimer
                                    studyId={studyId}
                                    password={password}
                                />
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default FocusPage;