import { useState, useEffect } from "react";
import StudyCard from "./StudyCard";
import {
  getRecentStudyIds,
  removeRecentStudy,
} from "../../utils/recentStudies";

const API_BASE_URL = "http://127.0.0.1:3000";

function RecentStudyList() {
  const [studies, setStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ids = getRecentStudyIds();

    if (ids.length === 0) {
      setIsLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            const res = await fetch(`${API_BASE_URL}/study/${id}`);
            if (!res.ok) return null;
            const json = await res.json();
            return json?.data ?? json;
          }),
        );
        setStudies(results.filter(Boolean));
      } catch {
        setStudies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <div className="card_container recent_scroll">
      <span className="container_title">최근 조회한 스터디</span>
      <div className="card_wrap">
        {studies.length > 0 ? (
          studies.map((study) => <StudyCard key={study.id} study={study} />)
        ) : (
          <p className="list_state_message">아직 조회한 스터디가 없어요</p>
        )}
      </div>
    </div>
  );
}

export default RecentStudyList;
