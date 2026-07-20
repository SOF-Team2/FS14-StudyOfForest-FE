function AlertMessage({
  message,
  variant = "success",
  status = "visible",
  onClose,
}) {
  if (!message || status === "hidden") {
    return null;
  }

  const isError = variant === "error";
  const isLoading = variant === "loading";

  return (
    <div
      className={`study-create-notice ${isError ? "is-error" : ""} ${
        isLoading ? "is-loading" : ""
      } ${status === "closing" ? "is-closing" : ""}`}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
    >
      <span className="study-create-notice-icon" aria-hidden="true" />
      <span className="study-create-notice-text">{message}</span>
      {onClose && (
        <button
          className="study-create-notice-close"
          type="button"
          aria-label="알림 닫기"
          onClick={onClose}
        />
      )}
    </div>
  );
}

export default AlertMessage;
