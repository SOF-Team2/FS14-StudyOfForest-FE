import { useState, useEffect } from 'react';
import FocusResultToast from './FocusResultToast.jsx';
import FocusButton from './FocusButton';
import './FocusTimer.css';

export default function FocusTimer({ studyId, password }) {
    const [elapsedSeconds, setElapsedSeconds] = useState(0); // 실제 흘러간 초 (계속 증가, 포인트 계산할 때 역산)
    const [isRunning, setIsRunning] = useState(false);  // 업데이트
    const [isStarted, setIsStarted] = useState(false);  // 한 번이라도 시작했는지 (버튼 바뀌는 거)
    const [settingMinutes, setSettingMinutes] = useState(25);  // 설정한 분
    const [settingSeconds, setSettingSeconds] = useState(0);   // 설정한 초
    const [isEditing, setIsEditing] = useState(false);         // 수정할 때 쓴 거 
    const [toast, setToast] = useState(null);


    const totalSettingSeconds = settingMinutes * 60 + settingSeconds;
    const remainingSeconds = totalSettingSeconds - elapsedSeconds;

    useEffect(() => {
        if (!isRunning) return;

        const timerId = setInterval(function () {
            setElapsedSeconds(function (prev) {
                return prev + 1;
            });
        }, 1000);

        return function () {
            clearInterval(timerId);
        };
    }, [isRunning]);

    // 토스트가 뜨면 3초 뒤 자동으로 사라짐
    useEffect(() => {
        if (!toast) return;   // 토스트가 없으면 아무것도 안 함

        const timeoutId = setTimeout(() => {
            setToast(null);
        }, 3000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [toast]);

    function formatTime(totalSeconds) {
        const isNegative = totalSeconds < 0;
        const abs = Math.abs(totalSeconds);
        const min = Math.floor(abs / 60);
        const sec = abs % 60;
        const sign = isNegative ? '-' : '';
        return `${sign}${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }

    // 포인트 계산: 기본 3점 + 10분당 1점 (실제 집중한 총 시간 기준)
    function calculatePoint(totalSeconds) {
        const totalMinutes = Math.floor(totalSeconds / 60);
        return 3 + Math.floor(totalMinutes / 10);
    }

    function handleStart() {
        setToast(null);
        setIsRunning(true);
        setIsStarted(true);
    }

    function handlePause() {
        setIsRunning(false);   // 멈추지만 경과 시간은 유지
    }

    function handleResume() {
        setIsRunning(true);
    }

    async function handleFinish() {
        // 설정한 시간을 다 채웠는지 확인
        const isCompleted = elapsedSeconds >= totalSettingSeconds;

        if (!isCompleted) {
            setToast({ resultType: 'interrupted' });
            handleReset();
            return;
        }

        // 여기부터는 완료한 경우만
        const point = calculatePoint(elapsedSeconds);
        console.log('획득포인트', point);

        try {
            const res = await fetch(`http://localhost:3000/study/${studyId}/focus/point`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, point }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.log(data.errorCode, data.message);
                return;
            }

            console.log('집중 성공:', data);
            setToast({ resultType: 'success', earnedPoint: point });

        } catch (error) {
            console.error('전송 실패:', error);
        }

        handleReset();
    }

    function handleReset() {
        setIsRunning(false);
        setIsStarted(false);
        setElapsedSeconds(0);
    }

    return (
        <div className="focus-timer">
            {isEditing ? (
                <div
                    className="focus-timer__display focus-timer__display--edit"
                    tabIndex={-1}
                    onBlur={(e) => {
                        // 포커스가 이 div 바깥으로 나갔을 때만 편집 종료
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                            setIsEditing(false);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            setIsEditing(false);   // 엔터 → 편집 종료
                        }
                    }}
                >
                    <input
                        type="number"
                        value={settingMinutes}
                        onChange={(e) => setSettingMinutes(Number(e.target.value))}
                        min="0"
                        autoFocus
                    />
                    <span>:</span>
                    <input
                        type="number"
                        value={settingSeconds}
                        onChange={(e) => setSettingSeconds(Number(e.target.value))}
                        min="0"
                        max="59"
                    />
                </div>
            ) : (
                <div
                    className={
                        remainingSeconds < 0
                            ? 'focus-timer__display focus-timer__display--over'
                            : 'focus-timer__display'
                    }
                    onClick={() => {
                        if (!isStarted) setIsEditing(true);
                    }}
                >
                    {formatTime(remainingSeconds)}
                </div>
            )}

            {toast && (
                <FocusResultToast
                    resultType={toast.resultType}
                    earnedPoint={toast.earnedPoint}
                />
            )}

            <div className="focus-timer__buttons">
                {!isStarted ? (
                    <FocusButton onClick={handleStart}>시작</FocusButton>
                ) : (
                    <>
                        {isRunning ? (
                            <FocusButton onClick={handlePause}>일시정지</FocusButton>
                        ) : (
                            <FocusButton onClick={handleResume}>계속</FocusButton>
                        )}
                        <FocusButton onClick={handleFinish}>정지</FocusButton>
                    </>
                )}
            </div>
        </div>
    );
}