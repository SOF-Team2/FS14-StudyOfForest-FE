import defaultIcon from "../../assets/img/sticker_empty.svg";
import icon1 from "../../assets/img/sticker_light_green_100_01.svg";
import icon2 from "../../assets/img/sticker_light_green_100_02.svg";
import icon3 from "../../assets/img/sticker_light_green_100_03.svg";
import icon4 from "../../assets/img/sticker_light_mint_100_04.svg";
import icon5 from "../../assets/img/sticker_light_mint_200_05.svg";
import icon6 from "../../assets/img/sticker_green_06.svg";
import icon7 from "../../assets/img/sticker_blue_100_07.svg";
import icon8 from "../../assets/img/sticker_blue_200_08.svg";
import icon9 from "../../assets/img/sticker_blue_300_09.svg";
import icon10 from "../../assets/img/sticker_purple_100_10.svg";
import icon11 from "../../assets/img/sticker_purple_200_11.svg";
import icon12 from "../../assets/img/sticker_purple_300_12.svg";
import icon13 from "../../assets/img/sticker_yellow_100_13.svg";
import icon14 from "../../assets/img/sticker_yellow_200_14.svg";
import icon15 from "../../assets/img/sticker_yellow_300_15.svg";
import icon16 from "../../assets/img/sticker_pink_100_16.svg";
import icon17 from "../../assets/img/sticker_pink_200_17.svg";
import icon18 from "../../assets/img/sticker_pink_300_18.svg";
import arrowRightIcon from "../../assets/img/ic_arrow_right.svg";
import { useEffect, useState } from "react";
import axios from "../../utils/axios";

const images = [
  icon1,
  icon2,
  icon3,
  icon4,
  icon5,
  icon6,
  icon7,
  icon8,
  icon9,
  icon10,
  icon11,
  icon12,
  icon13,
  icon14,
  icon15,
  icon16,
  icon17,
  icon18,
];

function WeeklyHabitRecordTable({ studyId }) {
  const [weeklyHabits, setWeeklyHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const weekNames = ["월", "화", "수", "목", "금", "토", "일"];

  const today = new Date();

  const getMonday = (date = new Date()) => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);

    const day = result.getDay(); // 일: 0, 월: 1, ... 토: 6
    const diff = day === 0 ? -6 : 1 - day;

    result.setDate(result.getDate() + diff);

    return result;
  };

  const monday = getMonday(selectedDate);

  const week = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    return {
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      day: weekNames[i],
      isToday:
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate(),
    };
  });

  const formatDateKey = (date) => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  };

  const handleLoad = async () => {
    setIsLoading(true);

    try {
      const date = formatDateKey(selectedDate);

      const response = await axios.get(`/study/${studyId}/habit/weekly`, {
        params: {
          date,
        },
      });

      setWeeklyHabits(response.data);
    } catch (error) {
      console.log(error);
      setWeeklyHabits([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 7);

      return newDate;
    });
  };

  const handleNextWeek = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 7);

      return newDate;
    });
  };

  useEffect(() => {
    handleLoad();
  }, [studyId, selectedDate]);

  return (
    <>
      <div className="card_container inner_container">
        <div className="modal_title left">
          습관 기록표
          <nav
            className="focus-page__navigation"
          >
            <button
              type="button"
              className="focus-page__navigation-button"
              onClick={() => console.log(1)}
            >
              <img
                className="focus-page__navigation-icon"
                src={arrowRightIcon}
                style={{rotate: '180deg'}}
                alt=""
              />
              <span style={{transform: 'translateY(2px)'}} onClick={handlePreviousWeek}>이전 주</span>
            </button>

            <button
              type="button"
              className="focus-page__navigation-button"
              onClick={() => console.log(1)}
            >
              <span style={{transform: 'translateY(2px)'}} onClick={handleNextWeek}>다음 주</span>

              <img
                className="focus-page__navigation-icon"
                src={arrowRightIcon}
                alt=""
              />
            </button>
          </nav>
        </div>
        <div className="table_wrap">
          {isLoading ? (
            <div className="habit_state_message">
              습관 목록을 불러오는 중입니다.
            </div>
          ) : weeklyHabits.length === 0 ? (
            <div className="habit_state_message">
              아직 습관이 없어요.
              <br /> 오늘의 습관에서 습관을 생성해보세요.
            </div>
          ) : (
            <>
              <div className="day_wrap">
                {week.map((item) => (
                  <div
                    className={`day ${item.isToday ? "today" : ""}`}
                    key={item.day}
                  >
                    {item.label}
                    <br />
                    {item.day}
                  </div>
                ))}
              </div>
              {weeklyHabits.map((habit, habitIndex) => {
                const recordsByDate = habit.habitRecords.reduce(
                  (map, record) => {
                    const dateKey = formatDateKey(record.recordDate);
                    const previousRecord = map.get(dateKey);

                    // 같은 날짜의 기록이 여러 개라면 최근 수정된 기록 사용
                    if (
                      !previousRecord ||
                      new Date(record.updatedAt) >
                        new Date(previousRecord.updatedAt)
                    ) {
                      map.set(dateKey, record);
                    }

                    return map;
                  },
                  new Map(),
                );

                return (
                  <div className="weekly_habit_record_line" key={habit.id}>
                    <div className="habit_name">{habit.name}</div>

                    {weekNames.map((day, dayIndex) => {
                      const targetDate = new Date(monday);
                      targetDate.setDate(monday.getDate() + dayIndex);

                      const dateKey = formatDateKey(targetDate);
                      const record = recordsByDate.get(dateKey);

                      return (
                        <div
                          className="habit_record_icon_container"
                          key={`${habit.id}-${dateKey}`}
                        >
                          <img
                            src={
                              record?.isChecked
                                ? images[habitIndex]
                                : defaultIcon
                            }
                            alt={`${day}요일 습관 체크 아이콘`}
                            className="habit_record_icon"
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default WeeklyHabitRecordTable;
