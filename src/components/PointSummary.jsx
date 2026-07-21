import pointIcon from "../assets/img/ic_point.svg";
import "./PointSummary.css";

export default function PointSummary({ point = 0, variant = "default" }) {
  return (
    <div
      className={`point-summary point-summary--${variant}`}
      aria-label={`획득한 포인트 ${point}점`}
    >
      <span className="point-summary__label">
        획득한
        <span className="point-summary__label-suffix"> 포인트</span>
      </span>
      <div className="point-summary__value-wrap">
        <img className="point-summary__icon" src={pointIcon} alt="" />
        <strong className="point-summary__value">{point} P</strong>
      </div>
    </div>
  );
}
