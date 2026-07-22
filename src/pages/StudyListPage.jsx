import { useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "../utils/axios";
import StudyCard from "../components/study/StudyCard";
import RecentStudyList from "../components/study/RecentStudyList";
import SearchSortBar from "../components/study/SearchSortBar";

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
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [favoriteState, setFavoriteState] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pendingScrollYRef = useRef(null);
  const sentinelRef = useRef(null);
  const relatedSuggestions = Array.from(
    new Map(
      items.filter((study) => study?.name).map((study) => [study.name, study]),
    ).values(),
  ).slice(0, 5);
  const userId = localStorage.getItem("userId");

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
      const params = {
        page: targetPage,
        pageSize: "6",
        sort: sortValue,
      };
      const trimmedKeyword = keyword.trim();

      if (trimmedKeyword) {
        params.keyword = trimmedKeyword;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await axios.get("/study", {
          params,
          signal: controller.signal,

          headers: {
            "x-user-id": userId,
          },
        });

        const data = response.data;
        const newItems = normalizeStudyItems(data);
        const tp = data?.data?.totalPages ?? data?.totalPages ?? 1;

        setItems((prev) => (replace ? newItems : [...prev, ...newItems]));
        setTotalPages(tp);
        setPage(targetPage);
      } catch (error) {
        if (error.name === "CanceledError") {
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
    const params = {
      page: page + 1,
      pageSize: "6",
      sort: sortValue,
    };
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) params.keyword = trimmedKeyword;

    setIsLoadingMore(true);
    setErrorMessage("");

    axios
      .get("/study", { params })
      .then((response) => {
        const data = response.data;
        const newItems = normalizeStudyItems(data);
        const tp = data?.data?.totalPages ?? data?.totalPages ?? 1;

        setItems((prev) => [...prev, ...newItems]);
        setTotalPages(tp);
        setPage((prev) => prev + 1);
      })
      .catch((error) => {
        setErrorMessage(error.message || "스터디 목록을 불러오지 못했습니다.");
      })
      .finally(() => setIsLoadingMore(false));
  };

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading && !isLoadingMore) {
          handleLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [handleLoadMore, isLoading, isLoadingMore, items.length]);

  const handleKeywordChange = (nextKeyword) => {
    rememberScrollPosition();
    setKeyword(nextKeyword);
  };

  const handleSortChange = (nextSortValue) => {
    rememberScrollPosition();
    setSortValue(nextSortValue);
  };

  const handleFavoriteChange = (studyId, isFavorite) => {
    setFavoriteState((prev) => ({
      ...prev,
      [studyId]: isFavorite,
    }));

    setItems((prevItems) =>
      prevItems.map((study) =>
        study.id === studyId
          ? {
              ...study,
              isFavorite,
            }
          : study,
      ),
    );
  };

  return (
    <section>
      <div className="inner">
        <RecentStudyList
          favoriteState={favoriteState}
          onFavoriteChange={handleFavoriteChange}
        />
        <div className="card_container">
          <span className="container_title">스터디 둘러보기</span>

          <SearchSortBar
            keyword={keyword}
            onKeywordChange={handleKeywordChange}
            sortValue={sortValue}
            onSortChange={handleSortChange}
            suggestions={relatedSuggestions}
            isSearching={isLoading}
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
              items.map((study) => (
                <StudyCard
                  key={study.id}
                  study={{
                    ...study,
                    isFavorite:
                      favoriteState[study.id] ?? study.isFavorite ?? false,
                  }}
                  onFavoriteChange={handleFavoriteChange}
                />
              ))}
            {isLoadingMore && (
              <p className="list_state_message">불러오는 중...</p>
            )}
          </div>

          {!isLoading && !errorMessage && page < totalPages && (
            <button
              type="button"
              className="load_more_button"
              onClick={handleLoadMore}
            >
              더보기
            </button>
          )}
          {!isLoading && !errorMessage && page < totalPages && (
            <div ref={sentinelRef} style={{ height: "1px" }} />
          )}
        </div>
      </div>
    </section>
  );
}

export default StudyListPage;
