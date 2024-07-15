import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PropsTypes from "prop-types";

function CircularTimer(props) {
  return (
    <div style={{ width: 50, height: 50 }}>
      <CircularProgressbar
        value={(props.seconds / 30) * 100}
        text={`${props.seconds}`}
        styles={buildStyles({
          textColor: props.color,
          pathColor: props.color,
          trailColor: "lightgrey",
        })}
      />
    </div>
  );
}

CircularTimer.propTypes = {
  color: PropsTypes.string,
  seconds: PropsTypes.number,
};

export default CircularTimer;
