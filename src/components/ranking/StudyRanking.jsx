import { useState, useEffect } from "react";
import axios from "../../utils/axios.js";

function StudyRanking() {
  const [studyRanking, setStudyRanking] = useState([]);

  const getStudyRanking = async () => {
    try {
      const response = await axios.get("/ranking/study");
      setStudyRanking(response.data);
    } catch (error) {
      console.error(error);
    }  
  };

  const topStudyRanking = studyRanking.slice(0, 3);
  const otherStudyRanking = studyRanking.slice(3, 10);

  useEffect(() => {
    getStudyRanking();
  }, []);

  return (
    <div>
      <span>스터디 랭킹</span>
      {topStudyRanking.map((study) => (
        <div key={study.id}>
          {study.rank}위 {study.name} {study.point}P
        </div>
      ))}
      {otherStudyRanking.map((study) => (
        <div key={study.id}>
          {study.rank}위 {study.name} {study.point}P
        </div>
      ))}
    </div>
  )
}

export default StudyRanking;