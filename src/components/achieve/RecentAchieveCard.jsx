// 카드 높이를 옆 카드들과 맞추기 위해 최대 2개만 노출합니다.
const RECENT_COUNT = 2;

export default function RecentAchieveCard({ achievements, onOpenModal }) {
    const { achieved, totalCount, isLoading, errorMessage } = achievements;

    const recentAchievements = achieved.slice(0, RECENT_COUNT);

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpenModal();
        }
    };

    return (
        <div
            className="card dashboard_card dashboard_activity_card"
            style={{ cursor: "pointer" }}
            role="button"
            tabIndex={0}
            onClick={onOpenModal}
            onKeyDown={handleKeyDown}
        >
            <div className="dashboard_card_header">
                <div>
                    <div className="dashboard_card_label">최근 획득한 업적</div>

                    <p className="dashboard_card_description">
                        새롭게 달성한 기록이에요
                    </p>
                </div>

                <div className="dashboard_card_icon">🏆</div>
            </div>

            <div className="dashboard_achievement_list">
                {isLoading && (
                    <p className="dashboard_card_description">
                        업적을 불러오는 중입니다.
                    </p>
                )}

                {!isLoading && errorMessage && (
                    <p className="dashboard_card_description">{errorMessage}</p>
                )}

                {!isLoading && !errorMessage && recentAchievements.length === 0 && (
                    <p className="dashboard_card_description">
                        아직 달성한 업적이 없어요. 첫 업적에 도전해 보세요!
                    </p>
                )}

                {!isLoading &&
                    !errorMessage &&
                    recentAchievements.map((achievement) => (
                        <div className="dashboard_achievement_item" key={achievement.type}>
                            <div className="dashboard_achievement_icon">
                                {achievement.icon}
                            </div>

                            <div>
                                <strong>{achievement.name}</strong>
                                <p>{achievement.description}</p>
                            </div>
                        </div>
                    ))}
            </div>

            <div className="dashboard_card_footer">
                <span>전체 업적</span>
                <strong>{totalCount}개</strong>
            </div>
        </div>
    );
}