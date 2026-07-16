import { useState } from "react";
import StudyRanking from "../components/ranking/StudyRanking.jsx";
import UserRanking from "../components/ranking/UserRanking.jsx";

function RangkingPage() {
  const [selectTab, setSelectTab] = useState("study");

  return (
    <section>
      <div>
        <span>이번 주 랭킹</span>
        <div>
          <button type="button" onClick={() => setSelectTab("study")}>
            스터디 랭킹
          </button>
          <button type="button" onClick={() => setSelectTab("user")} >
            유저 랭킹
          </button>
        </div>

        {selectTab === "study" && <StudyRanking />}

        {selectTab === "user" && <UserRanking />}
      </div>
    </section>
  )
}

export default RangkingPage;