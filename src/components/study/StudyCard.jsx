import { useNavigate } from "react-router-dom";
import tagImg from "../../assets/img/ic_point.svg";
import { addRecentStudy } from "../../utils/recentStudies";

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

  return Math.max(1, Math.floor((Date.now() - createdDate.getTime()) / DAY_IN_MS) + 1);
};

const getStudyEmojis = (study) => {
  const emojis = study.topEmojis ?? study.emojis ?? [];

  return Array.isArray(emojis) ? emojis.slice(0, 3) : [];
};

function StudyCard({ study }) {
  const navigate = useNavigate();
  const emojis = getStudyEmojis(study);

  const handleClick = () => {
    addRecentStudy(study);
    navigate(`/study/${study.id}`);
  };

  return (
    <div className="card" onClick={handleClick}>
      <div className="card_title_wrap">
        <span className="card_title">{study.name}</span>
        <div className="tag point_tag">
          <img src={tagImg} alt="태그 장식" />
          {getStudyPoint(study)}{"\u00A0"}P
        </div>
      </div>
      <span className="card_status">{getElapsedDays(study.createdAt)}일째 진행중</span>
      <div className="card_text">{study.description}</div>
      <div className="tag_wrap">
        {emojis.length > 0 ? (
          emojis.map((emojiItem) => (
            <div className="tag" key={emojiItem.emoji}>
              {emojiItem.emoji}<span>{emojiItem.count}</span>
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
