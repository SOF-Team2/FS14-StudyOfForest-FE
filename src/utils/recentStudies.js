const RECENT_STUDIES_KEY = "recentStudies";
const MAX_RECENT_STUDIES = 3;

export const getRecentStudyIds = () => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const saved = window.localStorage.getItem(RECENT_STUDIES_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const addRecentStudy = (study) => {
  if (typeof window === "undefined" || !study?.id) {
    return [];
  }

  const currentIds = getRecentStudyIds();
  const nextIds = [
    study.id,
    ...currentIds.filter((id) => id !== study.id),
  ].slice(0, MAX_RECENT_STUDIES);

  window.localStorage.setItem(RECENT_STUDIES_KEY, JSON.stringify(nextIds));
  return nextIds;
};

export const removeRecentStudy = (studyId) => {
  if (typeof window === "undefined" || !studyId) {
    return [];
  }

  const nextIds = getRecentStudyIds().filter((id) => id !== studyId);
  
  window.localStorage.setItem(RECENT_STUDIES_KEY, JSON.stringify(nextIds));
  return nextIds;
};
