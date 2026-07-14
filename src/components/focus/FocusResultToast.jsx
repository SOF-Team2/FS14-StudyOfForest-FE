import './FocusResultToast.css';

function FocusResultToast({
    resultType,
    earnedPoint = 0,
}) {
    const isSuccess = resultType === 'success';
    const isGoalAchieved = resultType === 'goalAchieved';

    // 성공과 목표 달성 토스트는 같은 초록색 스타일 사용
    const toastTypeClass =
        isSuccess || isGoalAchieved
            ? 'focus-result-toast--success'
            : 'focus-result-toast--interrupted';

    return (
        <div
            className={`focus-result-toast ${toastTypeClass}`}
            role="status"
            aria-live="polite"
        >
            {isSuccess ? (
                <span className="focus-result-toast__message">
                    <span
                        className="focus-result-toast__icon"
                        aria-hidden="true"
                    >
                        🎉
                    </span>

                    {earnedPoint}포인트를 획득했습니다!
                </span>
            ) : isGoalAchieved ? (
                <span className="focus-result-toast__message">
                    <span
                        className="focus-result-toast__icon"
                        aria-hidden="true"
                    >
                        🎉
                    </span>

                    <span className="focus-result-toast__text">
                        <strong className="focus-result-toast__title">
                            목표 시간 달성!
                        </strong>

                        <span className="focus-result-toast__description">
                            10분 더 집중할 때마다 1P가 추가돼요.
                        </span>
                    </span>
                </span>
            ) : (
                <span className="focus-result-toast__message">
                    <span
                        className="focus-result-toast__icon"
                        aria-hidden="true"
                    >
                        🚨
                    </span>

                    집중이 중단되었습니다.
                </span>
            )}
        </div>
    );
}

export default FocusResultToast;