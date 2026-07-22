import { useState, useEffect } from 'react';

import axios from '../../utils/axios.js';
import Button from '../Button.jsx';
import useAlert from '../useAlert.js';
import playIcon from '../../assets/img/ic_play.svg';
import pauseIcon from '../../assets/img/ic_pause.svg';
import stopIcon from '../../assets/img/ic_pause (1).svg';

import './FocusTimer.css';

export default function FocusTimer({ studyId }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0); // 실제 흘러간 초 (계속 증가, 포인트 계산할 때 역산)
  const [isRunning, setIsRunning] = useState(false);  // 업데이트
  const [isStarted, setIsStarted] = useState(false);  // 한 번이라도 시작했는지 (버튼 바뀌는 거)
  const [settingMinutes, setSettingMinutes] = useState(25);  // 설정한 분
  const [settingSeconds, setSettingSeconds] = useState(0);   // 설정한 초
  const [isEditing, setIsEditing] = useState(false);         // 수정할 때 쓴 거 
  const { showAlert } = useAlert();


  const totalSettingSeconds = settingMinutes * 60 + settingSeconds;
  const remainingSeconds = totalSettingSeconds - elapsedSeconds;
  const isCompleted = elapsedSeconds >= totalSettingSeconds;

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

  useEffect(() => {
    if (isRunning && remainingSeconds === 0) {
      showAlert('목표 시간 달성! 10분 더 집중할 때마다 1P가 추가돼요.');
    }
  }, [remainingSeconds, isRunning, showAlert]);

  useEffect(() => {
    function handleKeyDown(e) {
      // 편집 중일 땐 단축키 무시 (숫자 입력해야 하니까)
      if (isEditing) return;

      if (e.code === 'Space') {
        e.preventDefault();   // 스페이스로 화면이 스크롤되는 기본 동작 막기

        if (!isStarted) {
          handleStart();
        } else if (isRunning) {
          handlePause();
        } else {
          handleResume();
        }
      }

      if (e.key === 'Escape') {
        if (isStarted) {
          handleFinish();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isStarted, isRunning, isEditing]);

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
    setIsRunning(false);   // 멈추지만 경과 시간은 유지
  }

  function handleResume() {
    setIsRunning(true);
  }

  async function handleFinish() {
    if (!isCompleted) {
      showAlert('집중이 중단되었습니다.', 'error');
      handleReset();
      return;
    }

    // 여기부터는 완료한 경우만
    const point = calculatePoint(elapsedSeconds);
    console.log('획득포인트', point);

    try {
      const response = await axios.patch(
        `/study/${studyId}/focus/point`,
        {
          point,
        },
      );

      console.log('집중 성공:', response.data);

      showAlert(`${point}포인트를 획득했습니다!`);
    } catch (error) {
      console.error(
        '포인트 업데이트 실패:',
        error.response?.data ?? error,
      );
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
      {isStarted && (
        <div className="focus-timer__target">
          <span>  {formatTime(totalSettingSeconds)} </span>
        </div>
      )}
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
          <Button onClick={handleStart}><img src={playIcon} alt="" />시작</Button>
        ) : (
          <>
            {isRunning ? (
              <Button onClick={handlePause}><img src={pauseIcon} alt="" />일시정지</Button>
            ) : (
              <Button onClick={handleResume}><img src={playIcon} alt="" />계속</Button>
            )}
            <Button onClick={handleFinish}>
              <img src={stopIcon} alt="" />
              {isCompleted ? '완료' : '정지'}
            </Button>
          </>
        )}
      </div>
      <p className="focus-timer__guide">
        <span>space: 시작/일시정지/계속</span>
        <span className="focus-timer__guide-separator">|</span>
        <span>esc: 정지/완료</span>
      </p>
    </div>
  );
}
