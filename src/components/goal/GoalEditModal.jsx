import { useState } from "react";
import axios from "../../utils/axios";

function GoalEditModal({ initialHours, onClose, onSaved }) {
    const [hours, setHours] = useState(
        initialHours && initialHours > 0 ? String(initialHours) : "",
    );
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const numericHours = Number(hours);

        if (!hours || Number.isNaN(numericHours) || numericHours < 0) {
            setErrorMessage("0 이상의 숫자를 입력해주세요.");
            return;
        }

        setIsSaving(true);
        setErrorMessage("");

        try {
            await axios.patch("/api/users/goal", {
                targetFocusHours: numericHours,
            });

            const refreshed = await axios.get("/api/users/goal");
            onSaved(refreshed.data?.data ?? {});
            onClose();
        } catch (error) {
            console.error("목표 저장 실패:", error);
            setErrorMessage(
                error.response?.data?.error?.message ??
                    "목표 저장에 실패했습니다.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal_overlay" onClick={onClose}>
            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                <h3>이번 주 목표 설정</h3>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="targetFocusHours">
                        이번 주 목표 집중 시간 (시간)
                    </label>

                    <input
                        id="targetFocusHours"
                        type="number"
                        min="0"
                        step="0.5"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        placeholder="예: 10"
                        autoFocus
                    />

                    {errorMessage && <p className="modal_error">{errorMessage}</p>}

                    <div className="modal_actions">
                        <button type="button" onClick={onClose} disabled={isSaving}>
                            취소
                        </button>

                        <button type="submit" disabled={isSaving}>
                            {isSaving ? "저장 중..." : "저장"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default GoalEditModal;