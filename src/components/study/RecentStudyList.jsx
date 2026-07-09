import { useEffect, useState } from "react";
import tagImg from "../../assets/img/ic_point.svg";

function RecentStudyList() {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentStudies");
    if (saved) {
      setRecent(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="card_container">
      <span className="container_title">최근 조회한 스터디</span>
      <div className="card_wrap">
        {recent.map((study) => (
          <div className="card" key={study.id}>
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
        ))}
      </div>
    </div>
  );
}

export default RecentStudyList;
