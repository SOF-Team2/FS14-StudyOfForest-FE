import { useNavigate } from "react-router-dom";
import tagImg from "../../assets/img/ic_point.svg";
import { addRecentStudy } from "../../utils/recentStudies";

function StudyCard({ study }) {
  const navigate = useNavigate();

  const handleClick = () => {
    addRecentStudy(study);
    navigate(`/study/${study.id}`);
  };

  return (
    <div className="card" onClick={handleClick}>
      <div className="card_title_wrap">
        <span className="card_title">{study.name}</span>
        <div className="tag">
          <img src={tagImg} alt="태그 장식" />
          {study.point}P 획득
        </div>
      </div>
      <span className="card_status">n일째 진행중</span>
      <div className="card_text">{study.description}</div>
      <div className="tag_wrap">
        <div className="tag">
          👩🏻‍💻<span>40</span>
        </div>
        <div className="tag">
          🔥<span>16</span>
        </div>
        <div className="tag">
          🤍<span>8</span>
        </div>
      </div>
    </div>
  );
}

export default StudyCard;
