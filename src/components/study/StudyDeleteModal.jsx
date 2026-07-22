import { useEffect, useRef } from "react";

function StudyDeleteModal({
  studyName,
  confirmation,
  errorMessage,
  isDeleting,
  onConfirmationChange,
  onCancel,
  onConfirm,
}) {
  const inputRef = useRef(null);
  const isConfirmed = confirmation === studyName;

  useEffect(() => {
    inputRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isDeleting) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDeleting, onCancel]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isConfirmed && !isDeleting) {
      onConfirm();
    }
  };

  return (
    <div
      className="study-delete-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onCancel();
        }
      }}
    >
      <section
        className="study-delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="study-delete-modal-title"
        aria-describedby="study-delete-modal-description"
      >
        <h2 id="study-delete-modal-title">스터디 삭제하기</h2>
        <p id="study-delete-modal-description">
          삭제한 스터디는 복구할 수 없습니다.
          <br />
          계속하려면 스터디 제목을 입력해주세요.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="study-delete-confirmation">스터디 제목</label>
          <input
            ref={inputRef}
            id="study-delete-confirmation"
            type="text"
            value={confirmation}
            placeholder={studyName}
            autoComplete="off"
            disabled={isDeleting}
            aria-invalid={Boolean(errorMessage)}
            onChange={(event) => onConfirmationChange(event.target.value)}
          />

          {errorMessage && (
            <p className="study-delete-modal-error" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="study-delete-modal-actions">
            <button type="button" onClick={onCancel} disabled={isDeleting}>
              취소
            </button>
            <button
              type="submit"
              className="delete"
              disabled={!isConfirmed || isDeleting}
            >
              {isDeleting ? "삭제 중" : "삭제하기"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default StudyDeleteModal;
