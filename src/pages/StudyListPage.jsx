import { useEffect, useLayoutEffect, useRef, useState } from "react";
import StudyCard from "../components/study/StudyCard";
import RecentStudyList from "../components/study/RecentStudyList";
import SearchSortBar from "../components/study/SearchSortBar";

const API_BASE_URL = "http://127.0.0.1:3000";

const normalizeStudyItems = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.data?.items)) {
    return data.data.items;
  }

  return [];
};

function StudyListPage() {
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sortValue, setSortValue] = useState("latest");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pendingScrollYRef = useRef(null);

  const rememberScrollPosition = () => {
    pendingScrollYRef.current = window.scrollY;
  };

  useLayoutEffect(() => {
    if (pendingScrollYRef.current === null) {
      return undefined;
    }

    const scrollY = pendingScrollYRef.current;
    pendingScrollYRef.current = null;
    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo({ top: scrollY, left: 0, behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [items, isLoading, errorMessage]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchStudies = async (targetPage, replace) => {
      const params = new URLSearchParams({
        page: String(targetPage),
        pageSize: "6",
        sort: sortValue,
      });
      const trimmedKeyword = keyword.trim();

      if (trimmedKeyword) {
        params.set("keyword", trimmedKeyword);
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/study?${params.toString()}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("스터디 목록을 불러오지 못했습니다.");
        }

        const data = await response.json();
        const newItems = normalizeStudyItems(data);
        const tp = data?.data?.totalPages ?? data?.totalPages ?? 1;

        setItems((prev) => (replace ? newItems : [...prev, ...newItems]));
        setTotalPages(tp);
        setPage(targetPage);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        if (replace) setItems([]);
        setErrorMessage(error.message || "스터디 목록을 불러오지 못했습니다.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchStudies(1, true);

    return () => controller.abort();
  }, [keyword, sortValue]);

  const handleLoadMore = () => {
    rememberScrollPosition();

    const params = new URLSearchParams({
      page: String(page + 1),
      pageSize: "6",
      sort: sortValue,
    });
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) params.set("keyword", trimmedKeyword);

    setIsLoading(true);
    setErrorMessage("");

    fetch(`${API_BASE_URL}/study?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("스터디 목록을 불러오지 못했습니다.");
        return res.json();
      })
      .then((data) => {
        const newItems = normalizeStudyItems(data);
        const tp = data?.data?.totalPages ?? data?.totalPages ?? 1;

        setItems((prev) => [...prev, ...newItems]);
        setTotalPages(tp);
        setPage((prev) => prev + 1);
      })
      .catch((error) => {
        setErrorMessage(error.message || "스터디 목록을 불러오지 못했습니다.");
      })
      .finally(() => setIsLoading(false));
  };

  const handleKeywordChange = (nextKeyword) => {
    rememberScrollPosition();
    setKeyword(nextKeyword);
  };

  const handleSortChange = (nextSortValue) => {
    rememberScrollPosition();
    setSortValue(nextSortValue);
  };

  return (
    <section>
      <div className="inner">
        <RecentStudyList />

        <div className="card_container">
          <span className="container_title">스터디 둘러보기</span>

          <SearchSortBar
            keyword={keyword}
            onKeywordChange={handleKeywordChange}
            sortValue={sortValue}
            onSortChange={handleSortChange}
          />

          <div className="card_wrap">
            {isLoading && (
              <p className="list_state_message">
                스터디 목록을 불러오는 중입니다.
              </p>
            )}
            {!isLoading && errorMessage && (
              <p className="list_state_message error">{errorMessage}</p>
            )}
            {!isLoading && !errorMessage && items.length === 0 && (
              <p className="list_state_message">표시할 스터디가 없습니다.</p>
            )}
            {!isLoading &&
              !errorMessage &&
              items.map((study) => <StudyCard key={study.id} study={study} />)}
          </div>

          {!isLoading && !errorMessage && page < totalPages && (
            <button type="button" className="load_more_button" onClick={handleLoadMore}>
              더보기
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default StudyListPage;
