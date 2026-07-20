import { useState, useEffect } from "react";
import StudyCard from "./StudyCard";
import {
  getRecentStudyIds,
  removeRecentStudy,
} from "../../utils/recentStudies";

//const API_BASE_URL = "http://127.0.0.1:3000";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
        const notFoundIds = [];

        const results = await Promise.all(
          ids.map(async (id) => {
            const res = await fetch(`${API_BASE_URL}/study/${id}`);
            if (!res.ok) {
              notFoundIds.push(id);
              return null;
            }
            const json = await res.json();
            return json?.data ?? json;
          }),
        );

        notFoundIds.forEach((id) => removeRecentStudy(id));

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
          studies.map((study) => (
            <div className="recent-study-card-slot" key={study.id}>
              <StudyCard study={study} />
            </div>
          ))
        ) : (
          <p className="list_state_message">아직 조회한 스터디가 없어요</p>
        )}
      </div>
    </div>
  );
}

export default RecentStudyList;
