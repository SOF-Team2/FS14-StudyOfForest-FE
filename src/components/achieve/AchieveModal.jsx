import { useEffect } from "react";
import "./achievements.css";


const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
};

export default function AchieveModal({ achievements, onClose }) {
    const { merged, achievedCount, isLoading, errorMessage } = achievements;

    //모달 밖 누르면 닫혀요
    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };
    //esc 누르면 닫혀요 
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <div className="modal_wrap" onClick={handleOverlayClick}>
            <div className="modal achieve_modal">
                <div className="achieve_header">
                    <div className="achieve_header_text">
                        <strong>전체 업적</strong>
                        <p>
                            전체 {merged.length}개 중 <b>{achievedCount}개</b>를 달성했어요
                        </p>
                    </div>

                    <button
                        type="button"
                        className="achieve_close"
                        onClick={onClose}
                        aria-label="닫기"
                    >
                        ×
                    </button>
                </div>
                {isLoading && <p className="list_state_message">업적을 불러오는 중입니다.</p>}

                {!isLoading && errorMessage && (
                    <p className="list_state_message error">{errorMessage}</p>
                )}

                {!isLoading && !errorMessage && (
                    <ul className="achieve_list">
                        {merged.map((item) => (
                            <li
                                className={`achieve_item ${item.isAchieved ? "" : "is_locked"}`}
                                key={item.type}
                            >
                                <div className="achieve_icon">
                                    {item.isAchieved ? item.icon : "🔒"}
                                </div>

                                <div className="achieve_text">
                                    <div className="achieve_text">
                                        <strong>{item.name}</strong>
                                        <p>{item.description}</p>

                                        {item.isAchieved && (
                                            <span className="achieve_date">{formatDate(item.achievedAt)} 달성</span>
                                        )}
                                    </div>
                                </div>

                                <span className="achieve_state">
                                    {item.isAchieved ? "달성" : "미달성"}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}