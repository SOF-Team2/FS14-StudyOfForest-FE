import { useNavigate } from "react-router-dom";
import tagImg from "../../assets/img/ic_point.svg";
import { addRecentStudy } from "../../utils/recentStudies";
import {
  getStudyBackgroundStyle,
  isImageBackground,
} from "../../utils/studyBackground.js";
import FavoriteButton from "../favoriteButton.jsx";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const getStudyPoint = (study) => study.point ?? study.points ?? 0;

const getElapsedDays = (createdAt) => {
  if (!createdAt) {
    return 1;
  }

  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    return 1;
  }

  return Math.max(
    1,
    Math.floor((Date.now() - createdDate.getTime()) / DAY_IN_MS) + 1,
  );
};

const getStudyEmojis = (study) => {
  const emojis = study.topEmojis ?? study.emojis ?? [];

  return Array.isArray(emojis) ? emojis.slice(0, 3) : [];
};

const getNicknameStyle = (study) => {
  const color = study.backgroundValue;

  if (color === "GREEN" || color === "#E1EDDE") {
    return { color: "#578246" };
  }

  if (color === "YELLOW" || color === "#FFF1CC") {
    return { color: "#C18E1B" };
  }

  if (color === "BLUE" || color === "#E0F1F5") {
    return { color: "#418099" };
  }

  if (color === "PINK" || color === "#FDE0E9") {
    return { color: "#BC3C6A" };
  }

  return {};
};

export function StudyCardContent({
  study,
  onFavoriteChange,
  isPreview = false,
}) {
  const emojis = getStudyEmojis(study);
  const nicknameStyle = getNicknameStyle(study);

  return (
    <>
      {isImageBackground(study) && (
        <div
          className="background_cover"
          aria-hidden="true"
        />
      )}

      <div className="card_title_wrap">
        <span className="card_title">
          <span style={nicknameStyle}>
            {study.nickname}
          </span>

          <span style={{ fontWeight: 300 }}>
            의
          </span>

          {" "}
          {study.name}
        </span>

        <div className="tag point_tag">
          <img src={tagImg} alt="태그 장식" />

          {getStudyPoint(study)}
          {"\u00A0"}P
        </div>
      </div>

      <span className="card_status">
        {getElapsedDays(study.createdAt)}일째 진행중
      </span>

      <div className="card_text">
        {study.description}
      </div>

      <div className="study-card-actions">
        <div className="tag_wrap">
          {emojis.length > 0 ? (
            emojis.map((emojiItem) => (
              <div
                className="tag"
                key={emojiItem.emoji}
              >
                {emojiItem.emoji}
                <span>{emojiItem.count}</span>
              </div>
            ))
          ) : (
            <span className="tag_empty">
              아직 반응이 없어요
            </span>
          )}
        </div>

        <div
          className="favorite_btn_wrap"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <FavoriteButton
            studyId={study.id}
            isFavorite={study.isFavorite ?? false}
            onFavoriteChange={onFavoriteChange}
            isPreview={isPreview}
          />
        </div>
      </div>
    </>
  );
}

function StudyCard({ study, onFavoriteChange }) {
  const navigate = useNavigate();
  const cardStyle = getStudyBackgroundStyle(study);
  const backgroundTypeClassName =
    study.backgroundType?.toLowerCase() ?? "color";

  const handleClick = () => {
    addRecentStudy(study);
    navigate(`/study/${study.id}`);
  };

  return (
    <div
      className={`${backgroundTypeClassName} card study-card`}
      style={cardStyle}
      onClick={handleClick}
    >
      <StudyCardContent
        study={study}
        onFavoriteChange={onFavoriteChange}
      />
    </div>
  );
}

export default StudyCard;
