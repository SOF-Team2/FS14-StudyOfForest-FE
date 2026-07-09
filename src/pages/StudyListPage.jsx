import { useEffect, useState } from "react";
import StudyCard from "../components/study/StudyCard";
import RecentStudyList from "../components/study/RecentStudyList";
import SearchSortBar from "../components/study/StudyListPage";

import tagImg from "../assets/img/ic_point.svg";

function StudyListPage() {
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sortValue, setSortValue] = useState("recent");

  useEffect(() => {
    fetch("http://127.0.0.1:3000/study")
      .then((res) => res.json())
      .then((res) => {
        setItems(res.data.items);
      });
  }, []);

  return (
    <section>
      <div className="inner">
        <RecentStudyList />

        <div className="card_container">
          <span className="container_title">스터디 둘러보기</span>

          <SearchSortBar
            keyword={keyword}
            onKeywordChange={setKeyword}
            sortValue={sortValue}
            onSortChange={setSortValue}
          />

          <div className="card_wrap">
            {items.map((study) => (
              <StudyCard key={study.id} study={study} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudyListPage;
