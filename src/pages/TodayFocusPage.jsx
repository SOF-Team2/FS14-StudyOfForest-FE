import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import axios from '../utils/axios.js';
import AlertMessage from '../components/AlertMessage.jsx';
import FocusTimer from '../components/focus/FocusTimer.jsx';
import PointSummary from '../components/PointSummary.jsx';
import arrowRightIcon from '../assets/img/ic_arrow_right.svg';
import { getStudyBackgroundStyle } from '../utils/studyBackground.js';

const FOCUS_LOADING_FADE_DURATION = 400;

function FocusPage() {
    const { id: studyId } = useParams();
    const [focusData, setFocusData] = useState({
        studyName: '',
        currentPoint: 0,
    });
    const [studyDetail, setStudyDetail] = useState({});
    const [isFocusLoading, setIsFocusLoading] = useState(true);
    const [focusLoadingAlertStatus, setFocusLoadingAlertStatus] = useState('visible');
    const [focusLoadError, setFocusLoadError] = useState('');
    const loadingAlertTimerRef = useRef(null);

    useEffect(() => {
        let isActive = true;

        async function fetchFocusData() {
            setIsFocusLoading(true);
            setFocusLoadingAlertStatus('visible');
            setFocusLoadError('');

            try {
                const studyRequest = axios
                    .get(`/study/${studyId}`)
                    .then((response) => {
                        setStudyDetail(
                            response.data?.data ?? response.data ?? {},
                        );
                        return response;
                    })
                    .catch((studyError) => {
                        console.error('스터디 상세 조회 오류:', studyError);
                        return null;
                    });

                const focusRequest = axios.post(`/study/${studyId}/focus`, {});

                const [focusResponse] = await Promise.all([
                    focusRequest,
                    studyRequest,
                ]);

                const nextFocusData = focusResponse.data.data;

                setFocusData({
                    studyName: nextFocusData.studyName,
                    currentPoint: nextFocusData.currentPoint,
                });

                setStudyDetail((currentStudy) => (
                    Object.keys(currentStudy).length > 0
                        ? currentStudy
                        : { name: nextFocusData.studyName }
                ));
            } catch (error) {
                console.error('오늘의 집중 조회 오류:', error);

                setFocusLoadError(
                    error?.response?.data?.message ??
                    '오늘의 집중 정보를 불러오지 못했습니다.',
                );
            } finally {
                if (isActive) {
                    if (loadingAlertTimerRef.current) {
                        window.clearTimeout(loadingAlertTimerRef.current);
                    }

                    setIsFocusLoading(false);
                    setFocusLoadingAlertStatus('closing');
                    loadingAlertTimerRef.current = window.setTimeout(() => {
                        setFocusLoadingAlertStatus('hidden');
                        loadingAlertTimerRef.current = null;
                    }, FOCUS_LOADING_FADE_DURATION);
                }
            }
        }

        fetchFocusData();

        return () => {
            isActive = false;

            if (loadingAlertTimerRef.current) {
                window.clearTimeout(loadingAlertTimerRef.current);
                loadingAlertTimerRef.current = null;
            }
        };
    }, [studyId]);

    const {
        studyName,
        currentPoint,
    } = focusData;
    const study = {
        ...studyDetail,
        name: studyDetail.name ?? studyName,
    };
    const studyDetailBackgroundStyle = getStudyBackgroundStyle(study);

    return (
        <section>
            {focusLoadingAlertStatus !== 'hidden' && (
                <AlertMessage
                    message="오늘의 집중 정보를 불러오고 있습니다."
                    variant="loading"
                    status={focusLoadingAlertStatus}
                />
            )}

            {!isFocusLoading && focusLoadingAlertStatus === 'hidden' && focusLoadError && (
                <AlertMessage message={focusLoadError} variant="error" />
            )}

            <div className="inner">
                <section className="study-detail-section card_container study-subpage-detail">
                    <div
                        className="study-detail-background-layer"
                        style={studyDetailBackgroundStyle}
                        aria-hidden="true"
                    />

                    <div className="study-detail-content">
                        <nav
                            className="focus-page__navigation"
                            aria-label="스터디 페이지 이동"
                        >
                            <Link
                                to={`/study/${studyId}`}
                                className="focus-page__navigation-button"
                            >
                                <span>스터디</span>

                                <img
                                    className="focus-page__navigation-icon"
                                    src={arrowRightIcon}
                                    alt=""
                                />
                            </Link>

                            <Link
                                to={`/study/${studyId}/habit`}
                                className="focus-page__navigation-button"
                            >
                                <span>오늘의 습관</span>

                                <img
                                    className="focus-page__navigation-icon"
                                    src={arrowRightIcon}
                                    alt=""
                                />
                            </Link>
                        </nav>

                        <div className="study-detail-secondary-actions">
                            <div className="study-detail-current-point">
                                <PointSummary point={currentPoint} />
                            </div>
                        </div>

                        <div className="container_title">
                            <div className="study-detail-title">
                                {study.nickname && (
                                    <>
                                        <span>{study.nickname}</span>
                                        <span>의</span>
                                    </>
                                )}
                                <span>{study.name}</span>
                            </div>
                        </div>

                    </div>

                    <div className="card_container inner_container">
                        <div className="inner">
                            <span className="container_title">오늘의 집중</span>
                            <FocusTimer
                                studyId={studyId}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
}

export default FocusPage;
