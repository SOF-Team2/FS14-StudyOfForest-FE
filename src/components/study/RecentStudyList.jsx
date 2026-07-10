import { useState } from "react";
import StudyCard from "./StudyCard";
import { getRecentStudies } from "../../utils/recentStudies";


function RecentStudyList() {
  const [recent] = useState(() => getRecentStudies());

  if (recent.length === 0) {
    return null;
  }

  return (
    <div className="card_container recent_scroll">
      <span className="container_title">최근 조회한 스터디</span>
      <div className="card_wrap">
        {recent.map((study) => (
          <StudyCard key={study.id} study={study} />
        ))}
      </div>
    </div>
  );
}

export default RecentStudyList;
