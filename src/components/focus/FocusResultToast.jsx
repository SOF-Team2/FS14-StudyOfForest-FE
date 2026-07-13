import './FocusResultToast.css';

function FocusResultToast({
  resultType,
  earnedPoint = 0,
}) {
  const isSuccess = resultType === 'success';

  // 성공 여부에 따라 성공 또는 중단
  return (
    <div
      className={`focus-result-toast ${isSuccess
        ? 'focus-result-toast--success'
        : 'focus-result-toast--interrupted'
        }`}
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