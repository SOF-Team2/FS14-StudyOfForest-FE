import bgDesk from "../assets/img/bg_create_desk.svg";
import bgWindow from "../assets/img/bg_create_window.svg";
import bgTiles from "../assets/img/bg_create_tiles.svg";
import bgLeaves from "../assets/img/bg_create_leaves.svg";

export const CUSTOM_BACKGROUND_ID = "custom-upload";

export const backgroundOptions = [
  {
    id: "green",
    type: "color",
    value: "#E1EDDE",
    className: "study-create-bg-green",
  },
  {
    id: "yellow",
    type: "color",
    value: "#FFF1CC",
    className: "study-create-bg-yellow",
  },
  {
    id: "blue",
    type: "color",
    value: "#E0F1F5",
    className: "study-create-bg-blue",
  },
  {
    id: "pink",
    type: "color",
    value: "#FDE0E9",
    className: "study-create-bg-pink",
  },
  {
    id: "desk",
    type: "image",
    value: "desk",
    className: "study-create-bg-desk",
  },
  {
    id: "window",
    type: "image",
    value: "window",
    className: "study-create-bg-window",
  },
  {
    id: "tiles",
    type: "image",
    value: "tiles",
    className: "study-create-bg-tiles",
  },
  {
    id: "leaves",
    type: "image",
    value: "leaves",
    className: "study-create-bg-leaves",
  },
];

const IMAGE_BACKGROUND_MAP = {
  desk: bgDesk,
  window: bgWindow,
  tiles: bgTiles,
  leaves: bgLeaves,
};

const CUSTOM_BACKGROUND_KIND = "custom-image";
const TARGET_CUSTOM_BACKGROUND_BYTES = 80 * 1024;
const MAX_ORIGINAL_IMAGE_FILE_SIZE = 30 * 1024 * 1024;
const DEFAULT_CUSTOM_LAYOUT = {
  fit: "cover",
  positionX: 50,
  positionY: 50,
  zoom: 100,
};

const clampPercent = (value) => {
  const nextValue = Number(value);

  if (Number.isNaN(nextValue)) {
    return 50;
  }

  return Math.min(100, Math.max(0, nextValue));
};

const clampZoom = (value) => {
  const nextValue = Number(value);

  if (Number.isNaN(nextValue)) {
    return 100;
  }

  return Math.min(200, Math.max(50, nextValue));
};

export const createDefaultCustomBackground = () => ({
  src: "",
  ...DEFAULT_CUSTOM_LAYOUT,
});

export const normalizeCustomBackground = (customBackground = {}) => {
  const sourceBackground = customBackground ?? {};

  return {
    src: sourceBackground.src ?? "",
    fit: sourceBackground.fit === "contain" ? "contain" : "cover",
    positionX: clampPercent(sourceBackground.positionX),
    positionY: clampPercent(sourceBackground.positionY),
    zoom: clampZoom(sourceBackground.zoom),
  };
};

export const parseCustomBackgroundValue = (backgroundValue) => {
  if (typeof backgroundValue !== "string" || !backgroundValue) {
    return null;
  }

  if (backgroundValue.startsWith("data:image/")) {
    return normalizeCustomBackground({
      src: backgroundValue,
    });
  }

  try {
    const parsedValue = JSON.parse(backgroundValue);

    if (parsedValue?.kind !== CUSTOM_BACKGROUND_KIND || !parsedValue.src) {
      return null;
    }

    return normalizeCustomBackground(parsedValue);
  } catch {
    return null;
  }
};

const stringifyCustomBackground = (customBackground) => {
  const normalizedBackground = normalizeCustomBackground(customBackground);

  return JSON.stringify({
    kind: CUSTOM_BACKGROUND_KIND,
    src: normalizedBackground.src,
    fit: normalizedBackground.fit,
    positionX: normalizedBackground.positionX,
    positionY: normalizedBackground.positionY,
    zoom: normalizedBackground.zoom,
  });
};

const getStringBytes = (value) => new Blob([value]).size;

export const getBackgroundPayload = (selectedBackground, customBackground) => {
  if (selectedBackground === CUSTOM_BACKGROUND_ID) {
    const normalizedBackground = normalizeCustomBackground(customBackground);

    if (!normalizedBackground.src) {
      return null;
    }

    return {
      type: "image",
      value: stringifyCustomBackground(normalizedBackground),
    };
  }

  const selectedOption =
    backgroundOptions.find((option) => option.id === selectedBackground) ??
    backgroundOptions[0];

  return {
    type: selectedOption.type,
    value: selectedOption.value,
  };
};

export const getBackgroundSelectionFromStudy = (study) => {
  const backgroundType = study?.backgroundType ?? "";
  const backgroundValue = study?.backgroundValue ?? "";
  const normalizedBackgroundType = backgroundType.toLowerCase();
  const customBackground = parseCustomBackgroundValue(backgroundValue);

  if (normalizedBackgroundType === "image" && customBackground) {
    return {
      selectedBackground: CUSTOM_BACKGROUND_ID,
      customBackground,
    };
  }

  const normalizedBackgroundValue = backgroundValue.toLowerCase();

  const matchedOption = backgroundOptions.find(
    (option) =>
      (option.type === normalizedBackgroundType && option.value === backgroundValue) ||
      option.id === normalizedBackgroundValue ||
      option.value.toLowerCase() === normalizedBackgroundValue,
  );

  return {
    selectedBackground: matchedOption?.id ?? backgroundOptions[0].id,
    customBackground: createDefaultCustomBackground(),
  };
};

export const getBackgroundPreviewStyle = (selectedBackground, customBackground) => {
  if (selectedBackground === CUSTOM_BACKGROUND_ID) {
    const normalizedBackground = normalizeCustomBackground(customBackground);

    if (!normalizedBackground.src) {
      return {};
    }

    return {
      backgroundColor: "#F6F4EF",
      backgroundImage: `url("${normalizedBackground.src}")`,
      backgroundPosition: `${normalizedBackground.positionX}% ${normalizedBackground.positionY}%`,
      backgroundRepeat: "no-repeat",
      backgroundSize:
        normalizedBackground.zoom === 100
          ? normalizedBackground.fit
          : `${normalizedBackground.zoom}%`,
    };
  }

  const selectedOption =
    backgroundOptions.find((option) => option.id === selectedBackground) ??
    backgroundOptions[0];

  if (selectedOption.type === "image") {
    return {
      backgroundImage: `url("${IMAGE_BACKGROUND_MAP[selectedOption.value]}")`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    };
  }

  return {
    backgroundColor: selectedOption.value,
  };
};

export const getStudyBackgroundStyle = (study) => {
  const backgroundType = study?.backgroundType?.toLowerCase();
  const backgroundValue = study?.backgroundValue ?? "";

  if (backgroundType === "image") {
    const customBackground = parseCustomBackgroundValue(backgroundValue);

    if (customBackground) {
      return getBackgroundPreviewStyle(CUSTOM_BACKGROUND_ID, customBackground);
    }

    const imageUrl = IMAGE_BACKGROUND_MAP[backgroundValue];

    return imageUrl
      ? {
          backgroundImage: `url("${imageUrl}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {};
  }

  return {
    backgroundColor: backgroundValue,
  };
};

export const isImageBackground = (study) =>
  study?.backgroundType?.toLowerCase() === "image";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("이미지 파일을 읽지 못했습니다."));
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("이미지 파일을 불러오지 못했습니다."));
    image.src = src;
  });

const createCanvasDataUrl = (image, maxSize, quality) => {
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", quality);
};

export const createCustomBackgroundFromFile = async (file, previousLayout) => {
  if (!file) {
    return null;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 업로드할 수 있습니다.");
  }

  if (file.size > MAX_ORIGINAL_IMAGE_FILE_SIZE) {
    throw new Error("30MB 이하의 이미지를 업로드해주세요.");
  }

  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(originalDataUrl);
  const layout = normalizeCustomBackground(previousLayout);
  const maxSizes = [900, 760, 620, 520, 420, 360, 300, 260, 220];
  const qualities = [0.82, 0.74, 0.66, 0.58, 0.5, 0.42, 0.34, 0.28];

  for (const maxSize of maxSizes) {
    for (const quality of qualities) {
      const nextDataUrl = createCanvasDataUrl(image, maxSize, quality);
      const nextBackgroundValue = stringifyCustomBackground({
        ...layout,
        src: nextDataUrl,
      });

      if (getStringBytes(nextBackgroundValue) <= TARGET_CUSTOM_BACKGROUND_BYTES) {
        return {
          ...layout,
          src: nextDataUrl,
        };
      }
    }
  }

  throw new Error("이미지를 80KB 이하로 자동 압축하지 못했습니다. 더 작은 이미지를 업로드해주세요.");
};
