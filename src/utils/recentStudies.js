const RECENT_STUDIES_KEY = "recentStudies";
const MAX_RECENT_STUDIES = 3;

export const getRecentStudies = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedStudies = window.localStorage.getItem(RECENT_STUDIES_KEY);
    const parsedStudies = savedStudies ? JSON.parse(savedStudies) : [];

    return Array.isArray(parsedStudies) ? parsedStudies : [];
  } catch {
    return [];
  }
};

export const addRecentStudy = (study) => {
  if (typeof window === "undefined" || !study?.id) {
    return [];
  }

  const currentStudies = getRecentStudies();
  const nextStudies = [
    study,
    ...currentStudies.filter((currentStudy) => currentStudy.id !== study.id),
  ].slice(0, MAX_RECENT_STUDIES);

  window.localStorage.setItem(RECENT_STUDIES_KEY, JSON.stringify(nextStudies));

  return nextStudies;
};
