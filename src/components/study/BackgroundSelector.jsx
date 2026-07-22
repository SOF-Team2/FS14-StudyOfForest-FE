import { useRef, useState } from "react";
import selectedIcon from "../../assets/img/ic_bg_selected.png";
import {
  CUSTOM_BACKGROUND_ID,
  backgroundOptions,
  createCustomBackgroundFromFile,
  createDefaultCustomBackground,
  getBackgroundPreviewStyle,
  normalizeCustomBackground,
} from "../../utils/studyBackground.js";
import { StudyCardContent } from "./StudyCard.jsx";

const layoutFitOptions = [
  { value: "cover", label: "채우기" },
  { value: "contain", label: "전체 보기" },
];

const clampPercent = (value) => Math.min(100, Math.max(0, value));

function BackgroundSelector({
  selectedBackground,
  customBackground,
  onSelectedBackgroundChange,
  onCustomBackgroundChange,
  onError,
  previewStudy,
}) {
  const fileInputRef = useRef(null);
  const dragStateRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const normalizedCustomBackground = normalizeCustomBackground(
    customBackground ?? createDefaultCustomBackground(),
  );
  const isCustomSelected = selectedBackground === CUSTOM_BACKGROUND_ID;
  const selectedPresetOption = backgroundOptions.find(
    (option) => option.id === selectedBackground,
  );
  const isImagePreview =
    isCustomSelected || selectedPresetOption?.type === "image";
  const canDragCustomBackground = isCustomSelected && Boolean(normalizedCustomBackground.src);
  const previewStyle = getBackgroundPreviewStyle(
    selectedBackground,
    normalizedCustomBackground,
  );
  const previewCardClassName = [
    "study-create-background-preview-card",
    "card",
    "study-card",
    isImagePreview ? "is-image" : "is-color",
    isImagePreview ? "image" : "color",
    canDragCustomBackground ? "is-draggable" : "",
    isDragging ? "is-dragging" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const previewStudyData = {
    id: previewStudy?.id ?? "study-card-preview",
    nickname: previewStudy?.nickname || "닉네임",
    name: previewStudy?.name || "스터디 이름",
    description: previewStudy?.description || "스터디 소개가 표시됩니다.",
    point: previewStudy?.point ?? previewStudy?.points ?? 0,
    createdAt: previewStudy?.createdAt ?? new Date().toISOString(),
    emojis: previewStudy?.emojis ?? previewStudy?.topEmojis ?? [],
    isFavorite: previewStudy?.isFavorite ?? false,
    backgroundType: isImagePreview ? "image" : "color",
    backgroundValue: selectedPresetOption?.value ?? "",
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsProcessing(true);

    try {
      const nextCustomBackground = await createCustomBackgroundFromFile(
        file,
        normalizedCustomBackground,
      );

      onCustomBackgroundChange(nextCustomBackground);
      onSelectedBackgroundChange(CUSTOM_BACKGROUND_ID);
      onError?.("");
    } catch (error) {
      onError?.(error.message || "배경 사진을 업로드하지 못했습니다.");
    } finally {
      setIsProcessing(false);
      event.target.value = "";
    }
  };

  const handleCustomSelect = () => {
    if (normalizedCustomBackground.src) {
      onSelectedBackgroundChange(CUSTOM_BACKGROUND_ID);
      return;
    }

    openFilePicker();
  };

  const updateCustomLayout = (fieldName, value) => {
    onCustomBackgroundChange({
      ...normalizedCustomBackground,
      [fieldName]: value,
    });
    onSelectedBackgroundChange(CUSTOM_BACKGROUND_ID);
  };

  const removeCustomBackground = () => {
    onCustomBackgroundChange(createDefaultCustomBackground());
    onSelectedBackgroundChange(backgroundOptions[0].id);
  };

  const handlePreviewPointerDown = (event) => {
    if (!canDragCustomBackground || event.button !== 0) {
      return;
    }

    const previewRect = event.currentTarget.getBoundingClientRect();

    dragStateRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startPositionX: normalizedCustomBackground.positionX,
      startPositionY: normalizedCustomBackground.positionY,
      width: previewRect.width || 1,
      height: previewRect.height || 1,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    onSelectedBackgroundChange(CUSTOM_BACKGROUND_ID);
    setIsDragging(true);
    event.preventDefault();
  };

  const handlePreviewPointerMove = (event) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startClientX;
    const deltaY = event.clientY - dragState.startClientY;
    const nextPositionX = clampPercent(
      dragState.startPositionX - (deltaX / dragState.width) * 100,
    );
    const nextPositionY = clampPercent(
      dragState.startPositionY - (deltaY / dragState.height) * 100,
    );

    onCustomBackgroundChange({
      ...normalizedCustomBackground,
      positionX: nextPositionX,
      positionY: nextPositionY,
    });
  };

  const stopPreviewDragging = (event) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current = null;
    setIsDragging(false);
  };

  return (
    <fieldset className="study-create-background">
      <legend>배경을 선택해주세요</legend>

      <div className="study-create-background-preview">
        <div
          className={previewCardClassName}
          style={previewStyle}
          aria-label={
            canDragCustomBackground
              ? "업로드한 배경 사진 위치 조정"
              : undefined
          }
          onPointerDown={handlePreviewPointerDown}
          onPointerMove={handlePreviewPointerMove}
          onPointerUp={stopPreviewDragging}
          onPointerCancel={stopPreviewDragging}
        >
          <StudyCardContent study={previewStudyData} isPreview />
        </div>

        {isCustomSelected && normalizedCustomBackground.src && (
          <div className="study-create-background-layout">
            <div className="study-create-background-layout-header">
              <p className="study-create-background-drag-guide">
                드래그하여 사진의 위치를 조절하세요.
              </p>
              <div className="study-create-background-fit-options">
                {layoutFitOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={
                      normalizedCustomBackground.fit === option.value
                        ? "is-selected"
                        : ""
                    }
                    onClick={() => updateCustomLayout("fit", option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="study-create-background-zoom">
              <span>사진 크기</span>
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={normalizedCustomBackground.zoom}
                onChange={(event) =>
                  updateCustomLayout("zoom", event.target.value)
                }
              />
              <output>{Math.round(normalizedCustomBackground.zoom)}%</output>
            </label>

            <div className="study-create-background-actions">
              <button
                type="button"
                className="study-create-background-delete-button"
                onClick={removeCustomBackground}
              >
                사진 삭제
              </button>
              <button type="button" onClick={openFilePicker}>
                사진 변경
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="study-create-background-grid">
        <button
          type="button"
          className="study-create-background-option study-create-background-upload"
          aria-pressed={isCustomSelected}
          onClick={handleCustomSelect}
        >
          <span
            className={`study-create-background-tile study-create-background-upload-tile ${
              normalizedCustomBackground.src ? "has-image" : ""
            }`}
            style={
              normalizedCustomBackground.src
                ? getBackgroundPreviewStyle(
                    CUSTOM_BACKGROUND_ID,
                    normalizedCustomBackground,
                  )
                : undefined
            }
            aria-hidden="true"
          >
            {isCustomSelected && normalizedCustomBackground.src && (
              <img src={selectedIcon} alt="" />
            )}
            {!normalizedCustomBackground.src && (
              <span className="study-create-background-upload-content">
                <span className="study-create-background-upload-icon" />
                <span>{isProcessing ? "처리 중" : "사진 업로드"}</span>
              </span>
            )}
          </span>
        </button>

        {backgroundOptions.map((option) => {
          const isSelected = selectedBackground === option.id;

          return (
            <label className="study-create-background-option" key={option.id}>
              <input
                type="radio"
                name="background"
                value={option.value}
                data-background-type={option.type}
                checked={isSelected}
                onChange={() => onSelectedBackgroundChange(option.id)}
              />
              <span
                className={`study-create-background-tile ${option.className ?? ""}`}
                aria-hidden="true"
              >
                {isSelected && <img src={selectedIcon} alt="" />}
              </span>
            </label>
          );
        })}
      </div>

      <input
        ref={fileInputRef}
        className="study-create-background-file"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
      />
    </fieldset>
  );
}

export default BackgroundSelector;
