import { useState, useEffect } from "react";
import axios from "../../utils/axios.js"

function UserRanking() {
  const [userRanking, setUserRanking] = useState([])

  const getUserRanking = async () => {
    try {
      const response = await axios.get("/ranking/user");
      setUserRanking(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const topUserRanking = userRanking.slice(0, 3);
  const otherUserRanking = userRanking.slice(3, 10);

  useEffect(() => {
    getUserRanking();
  }, []);

  return (
    <div>
      <span>유저 랭킹</span>
      {topUserRanking.map((user) => (
        <div key={user.id}>
          {user.rank}위 {user.nickname} {user.point}P
        </div>
      ))}
      {otherUserRanking.map((user) => (
        <div key={user.id}>
          {user.rank}위 {user.nickname} {user.point}P
        </div>
      ))}
    </div>
  )
}

export default UserRanking;