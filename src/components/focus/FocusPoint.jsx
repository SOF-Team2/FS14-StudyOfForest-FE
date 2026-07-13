import pointIcon from '../../assets/img/ic_point.svg';
import './FocusPoint.css';

// =========================================
// 현재 포인트를 화면에 보여주는 표시 전용
// =========================================
function FocusPoint({ point = 0 }) {
  return (
    <div
      className="focus-point"
      aria-label={`현재까지 획득한 포인트 ${point}점`}
    >
      <span className="focus-point__label">
        현재까지 획득한 포인트
      </span>

      <div className="focus-point__value-wrap">
        <img
          className="focus-point__icon"
          src={pointIcon}
          alt=""
        />

        <strong className="focus-point__value">
          {point}P 획득
        </strong>
      </div>
    </div>
  );
}

export default FocusPoint;