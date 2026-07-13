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
  const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

  const getMonday = (date = new Date()) => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);

    const day = result.getDay(); // 일: 0, 월: 1, ... 토: 6
    const diff = day === 0 ? -6 : 1 - day;

    result.setDate(result.getDate() + diff);

    return result;
  };

  const formatDateKey = (date) => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  };

  const monday = getMonday();

  const handleLoad = async () => {
    const response = await axios.get(`/study/${studyId}/habit/weekly`);

    setWeeklyHabits(response.data);
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <>
      <div className="card_container inner_container">
        <div className="modal_title left">습관 기록표</div>
        <div className="table_wrap">
          <div className="day_wrap">
            <div className="day">월</div>
            <div className="day">화</div>
            <div className="day">수</div>
            <div className="day">목</div>
            <div className="day">금</div>
            <div className="day">토</div>
            <div className="day">일</div>
          </div>
          {weeklyHabits.map((habit, habitIndex) => {
            const recordsByDate = habit.habitRecords.reduce((map, record) => {
              const dateKey = formatDateKey(record.recordDate);
              const previousRecord = map.get(dateKey);

              // 같은 날짜의 기록이 여러 개라면 최근 수정된 기록 사용
              if (
                !previousRecord ||
                new Date(record.updatedAt) > new Date(previousRecord.updatedAt)
              ) {
                map.set(dateKey, record);
              }

              return map;
            }, new Map());

            return (
              <div className="weekly_habit_record_line" key={habit.id}>
                <div className="habit_name">{habit.name}</div>

                {DAYS.map((day, dayIndex) => {
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
                          record?.isChecked ? images[habitIndex] : defaultIcon
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
        </div>
      </div>
    </>
  );
}

export default WeeklyHabitRecordTable;
