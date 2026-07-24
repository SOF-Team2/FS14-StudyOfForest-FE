import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "../../utils/axios.js";
import { ACHIEVEMENTS } from "./achievements.js";

const isCanceled = (error) =>
  error.name === "AbortError" ||
  error.name === "CanceledError" ||
  error.code === "ERR_CANCELED";

function useAchievements() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoad = useCallback(async (signal) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get("/achievements", { signal });
      const data = response.data?.data ?? response.data ?? [];

      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      if (isCanceled(error)) return;

      console.error("업적 조회 실패:", error.response?.data ?? error);

      setRows([]);
      setErrorMessage(
        error.response?.data?.message ?? "업적을 불러오지 못했습니다.",
      );
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    handleLoad(controller.signal);

    return () => controller.abort();
  }, [handleLoad]);

  // 정적 목록(ACHIEVEMENTS)에 서버 달성 기록을 합칩니다.
  const merged = useMemo(
    () =>
      ACHIEVEMENTS.map((item) => {
        const found = rows.find((row) => row.achievementType === item.type);

        return {
          ...item,
          isAchieved: Boolean(found),
          achievedAt: found?.achievedAt ?? null,
        };
      }),
    [rows],
  );

  // 달성한 업적만 최신순으로 정렬합니다.
  const achieved = useMemo(
    () =>
      merged
        .filter((item) => item.isAchieved)
        .sort(
          (a, b) => new Date(b.achievedAt ?? 0) - new Date(a.achievedAt ?? 0),
        ),
    [merged],
  );

  return {
    merged,
    achieved,
    achievedCount: achieved.length,
    totalCount: merged.length,
    isLoading,
    errorMessage,
    reload: () => handleLoad(),
  };
}

export default useAchievements;