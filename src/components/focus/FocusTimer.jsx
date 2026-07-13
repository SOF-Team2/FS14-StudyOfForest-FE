import { useState, useEffect } from 'react';
import './FocusTimer.css';

export default function FocusTimer() {
    const [elapsedSeconds, setElapsedSeconds] = useState(0); // 실제 흘러간 초 (계속 증가, 포인트 계산할 때 역산)
    const [isRunning, setIsRunning] = useState(false);  // 업데이트
    const [isStarted, setIsStarted] = useState(false);  // 한 번이라도 시작했는지 (버튼 바뀌는 거)
    const [settingMinutes, setSettingMinutes] = useState(25);  // 설정한 분
    const [settingSeconds, setSettingSeconds] = useState(0);   // 설정한 초
    const [isEditing, setIsEditing] = useState(false);         // 수정할 때 쓴 거 

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
        setIsRunning(true);
        setIsStarted(true);
    }

    function handlePause() {
        setIsRunning(false);   // 멈추지만 경과 시간은 유지 → 다시 시작하면 이어짐
    }

    function handleResume() {
        setIsRunning(true);
    }

    function handleFinish() {
        const point = calculatePoint(elapsedSeconds);
        console.log('집중한 시간(초):', elapsedSeconds, '/ 획득 포인트:', point);
        // TODO: 다음 단계에서 여기에 API 전송 붙이기

        handleReset();
    }

    function handleReset() {
        setIsRunning(false);
        setIsStarted(false);
        setElapsedSeconds(0);
    }

    return (
        <div className="focus-timer">
            <span>오늘의 집중</span>
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

            <div className="focus-timer__buttons">
                {!isStarted ? (
                    <button type="button" onClick={handleStart}>시작</button>
                ) : (
                    <>
                        {isRunning ? (
                            <button type="button" onClick={handlePause}>일시정지</button>
                        ) : (
                            <button type="button" onClick={handleResume}>계속</button>
                        )}
                        <button type="button" onClick={handleFinish}>정지</button>
                        <button type="button" onClick={handleReset}>초기화</button>
                    </>
                )}
            </div>
        </div>
    );
}