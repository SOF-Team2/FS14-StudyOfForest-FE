import { useNavigate } from "react-router-dom";
import tagImg from "../../assets/img/ic_point.svg";
import { addRecentStudy } from "../../utils/recentStudies";
import bgDesk from "../../assets/img/bg_create_desk.svg";
import bgWindow from "../../assets/img/bg_create_window.svg";
import bgTiles from "../../assets/img/bg_create_tiles.svg";
import bgLeaves from "../../assets/img/bg_create_leaves.svg";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const IMAGE_BACKGROUND_MAP = {
  desk: bgDesk,
  window: bgWindow,
  tiles: bgTiles,
  leaves: bgLeaves,
};

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

const getCardStyle = (study) => {
  if (study.backgroundType === "image") {
    const imageUrl = IMAGE_BACKGROUND_MAP[study.backgroundValue];

    return imageUrl
      ? {
          backgroundImage: `url("${imageUrl}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {};
  }
  return { backgroundColor: study.backgroundValue };
};

function StudyCard({ study }) {
  const navigate = useNavigate();
  const emojis = getStudyEmojis(study);
  const cardstyle = getCardStyle(study);

  const handleClick = () => {
    addRecentStudy(study);
    navigate(`/study/${study.id}`);
  };

  return (
    <div className="card" style={cardstyle} onClick={handleClick}>
      <div className="card_title_wrap">
        <span className="card_title">{study.name}</span>
        <div className="tag point_tag">
          <img src={tagImg} alt="태그 장식" />
          {getStudyPoint(study)}
          {"\u00A0"}P
        </div>
      </div>
      <span className="card_status">
        {getElapsedDays(study.createdAt)}일째 진행중
      </span>
      <div className="card_text">{study.description}</div>
      <div className="tag_wrap">
        {emojis.length > 0 ? (
          emojis.map((emojiItem) => (
            <div className="tag" key={emojiItem.emoji}>
              {emojiItem.emoji}
              <span>{emojiItem.count}</span>
            </div>
          ))
        ) : (
          <div className="tag">
            🌱<span>0</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyCard;
