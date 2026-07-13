import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Header from '../components/Header.jsx';
import FocusTimer from '../components/focus/FocusTimer.jsx';
import FocusPoint from '../components/focus/FocusPoint.jsx';
import arrowRightIcon from '../assets/img/ic_arrow_right.svg';
import FocusResultToast from '../components/focus/FocusResultToast.jsx';

import './TodayFocusPage.css';

const API_BASE_URL = 'http://localhost:3000'; // 임시 API 연결 테스트용, BE 레포 서버 연상태에서 테스트해야함

function FocusPage() {
    const { id: studyId } = useParams();
    const password = '1234'; // 임시 API 연결 테스트용

    const [focusData, setFocusData] = useState({
        studyName: '',
        currentPoint: 0,
    });

    const [isFocusLoading, setIsFocusLoading] = useState(true);
    const [focusLoadError, setFocusLoadError] = useState('');

    useEffect(() => {
        async function fetchFocusData() {
            setIsFocusLoading(true);
            setFocusLoadError('');

            try {
                const response = await fetch(
                    `${API_BASE_URL}/study/${studyId}/focus`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            password,
                        }),
                    },
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || '오늘의 집중 데이터를 불러오지 못했습니다.',
                    );
                }

                setFocusData({
                    studyName: result.data.studyName,
                    currentPoint: result.data.currentPoint,
                });
            } catch (error) {
                console.error('오늘의 집중 조회 오류:', error);

                setFocusLoadError(
                    error instanceof Error
                        ? error.message
                        : '오늘의 집중 데이터를 불러오지 못했습니다.',
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
            {/* 중단, 성공 토스트 임시 확인용, 중단 토스트 확인 필요한 경우 resultType="interrupted"로 변경하면 확인 가능
            <FocusResultToast
                resultType="success"
                earnedPoint={5} /> */}
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