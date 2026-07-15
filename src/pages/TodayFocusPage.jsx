import { useEffect, useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';

import axios from '../utils/axios.js';
import useAlert from '../components/useAlert.js';
import FocusTimer from '../components/focus/FocusTimer.jsx';
import FocusPoint from '../components/focus/FocusPoint.jsx';
import FocusStatusAlert from '../components/focus/FocusStatusAlert.jsx';
import arrowRightIcon from '../assets/img/ic_arrow_right.svg';
import { getStudyBackgroundStyle } from '../utils/studyBackground.js';

function FocusPage() {
    const { id: studyId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const password = location.state?.password;
    const [focusData, setFocusData] = useState({
        studyName: '',
        currentPoint: 0,
    });
    const [studyDetail, setStudyDetail] = useState({});
    const [isFocusLoading, setIsFocusLoading] = useState(true);
    const [focusLoadError, setFocusLoadError] = useState('');

    // 비밀번호 없이 들어왔으면 상세 페이지로 돌려보내기
    useEffect(() => {
        if (!password) {
            showAlert('비밀번호 확인이 필요합니다.');   // ← alert 대신 이걸로
            navigate(`/study/${studyId}`, { replace: true });
        }
    }, [password, studyId, navigate, showAlert]);

    useEffect(() => {
        // 비밀번호가 없으면 타이머를 그리지 않음 (이동하는 동안 빈 화면)
        if (!password) return;

        async function fetchFocusData() {
            setIsFocusLoading(true);
            setFocusLoadError('');

            try {
                const response = await axios.post(`/study/${studyId}/focus`, {
                    password,
                });

                const nextFocusData = response.data.data;

                setFocusData({
                    studyName: nextFocusData.studyName,
                    currentPoint: nextFocusData.currentPoint,
                });

                try {
                    const studyResponse = await axios.get(`/study/${studyId}`);
                    setStudyDetail(studyResponse.data?.data ?? studyResponse.data ?? {});
                } catch (studyError) {
                    console.error('스터디 상세 조회 오류:', studyError);
                    setStudyDetail({ name: nextFocusData.studyName });
                }
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
    const study = {
        ...studyDetail,
        name: studyDetail.name ?? studyName,
    };
    const studyDetailBackgroundStyle = getStudyBackgroundStyle(study);

    return (
        <section>
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
                                state={{ password }}
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
                                <FocusPoint point={currentPoint} />
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
                                password={password}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
}

export default FocusPage;
