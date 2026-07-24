import { useState, useEffect } from 'react';
import axios from '../../utils/axios.js';
import './FocusTimeline.css';
import AlertMessage from '../AlertMessage.jsx';

export default function FocusTimeline({ studyId, refreshKey = 0 }) {
    const [scope, setScope] = useState('me');   // 토글용
    const [stats, setStats] = useState({ totalSeconds: 0, totalPoint: 0, sessions: [] });

    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState('');



    useEffect(() => {
        async function fetchSessionData() {
            setIsLoading(true);
            setLoadError('');

            try {
                const response = await axios.post(`/study/${studyId}/focus/sessions`, {
                    scope
                });

                const nextSessionData = response.data.data;
                setStats(nextSessionData);

            } catch (error) {
                console.error('오늘의 집중 조회 오류:', error);

                setLoadError(
                    error?.response?.data?.message ??
                    '오늘의 집중 정보를 불러오지 못했습니다.',
                );
            } finally {
                setIsLoading(false);
            }
        }

        fetchSessionData();
    }, [refreshKey, scope, studyId]);

    function getDateKey(startedAt) {
        return new Date(startedAt).toLocaleDateString('ko-KR');
    }

    const grouped = stats.sessions.reduce((acc, session) => {
        const key = getDateKey(session.startedAt);
        if (!acc[key]) {
            acc[key] = [];
        };
        acc[key].push(session);
        return acc;
    }, {});

    if (isLoading && stats.sessions.length === 0) {
        return <p>불러오는 중...</p>;
    }

    return (
        <div className="focus-timeline">
            {loadError && (
                <AlertMessage
                    message={loadError}
                    variant="error"
                    onClose={() => setLoadError('')}
                />
            )}
            <div className="focus-timeline__summary">
                <div className="focus-timeline__stat">
                    <span className="focus-timeline__stat-value">{Math.floor(stats.totalSeconds / 60)}</span>
                    <span className="focus-timeline__stat-label">분 집중</span>
                </div>
                <div className="focus-timeline__stat">
                    <span className="focus-timeline__stat-value">{stats.totalPoint}</span>
                    <span className="focus-timeline__stat-label">점 획득</span>
                </div>
            </div>
            <div className="focus-timeline__toggle">
                <button
                    onClick={() => setScope('me')}
                    className={scope === 'me' ? 'is-active' : ''}
                >
                    내 기록
                </button>
                <button
                    onClick={() => setScope('all')}
                    className={scope === 'all' ? 'is-active' : ''}
                >
                    전체
                </button>
            </div>
            {Object.entries(grouped).map(([dateKey, daySessions], index, arr) => (
                <div
                    key={dateKey}
                    className={
                        index === arr.length - 1
                            ? 'focus-timeline__day focus-timeline__day--last'
                            : 'focus-timeline__day'
                    }
                >
                    <h3>{dateKey}</h3>
                    {daySessions.map((session) => (

                        <div key={session.id} className="focus-timeline__row">
                            <div className="focus-timeline__marker">
                                <span className="focus-timeline__dot" />
                            </div>

                            <div
                                key={session.id}
                                className={
                                    session.point > 0
                                        ? 'focus-timeline__session'
                                        : 'focus-timeline__session focus-timeline__session--empty'
                                }
                            >
                                <span className="focus-timeline__time">
                                    {new Date(session.startedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="focus-timeline__duration">
                                    {Math.floor(session.durationSeconds / 60)}분 집중
                                </span>
                                {scope === 'all' && (
                                    <span className="focus-timeline__nickname">{session.user.nickname}</span>
                                )}
                                <span className={session.point > 0 ? 'focus-timeline__point' : 'focus-timeline__point--empty'}>
                                    {session.point > 0 ? `+${session.point}점` : '기록만'}
                                </span>
                            </div>
                        </div>


                    ))}
                </div>
            ))}
        </div>
    );

};
