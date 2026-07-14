import './FocusStatusAlert.css';

function FocusStatusAlert({
  type = 'loading',
  message,
}) {
  const isError = type === 'error';

  if (!message) {
    return null;
  }

  return (
    <div
      className={`focus-status-alert ${
        isError
          ? 'focus-status-alert--error'
          : 'focus-status-alert--loading'
      }`}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
    >
      {isError ? (
        <span
          className="focus-status-alert__error-icon"
          aria-hidden="true"
        >
          !
        </span>
      ) : (
        <span
          className="focus-status-alert__spinner"
          aria-hidden="true"
        />
      )}

      <span className="focus-status-alert__message">
        {message}
      </span>
    </div>
  );
}

export default FocusStatusAlert;