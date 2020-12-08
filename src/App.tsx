import React, { useEffect, useMemo, useReducer } from "react";
import alarmReducer, {
  EAlarmActionType,
  initialAlarmState,
  weatherList,
} from "./alarmReducer";
import moment from "moment";

function App() {
  const [state, dispatch] = useReducer(alarmReducer, initialAlarmState);

  const alarmView = useMemo(() => {
    let sortedAlarms = [...state.alarms];

    if (sortedAlarms.length > 0)
      sortedAlarms = sortedAlarms.sort(
        (a, b) =>
          moment(b.date, "YYYY/MM/DD | hh:mm:ss").unix() -
          moment(a.date, "YYYY/MM/DD | hh:mm:ss").unix()
      );

    return sortedAlarms.map((a, index) => (
      <div className="alarm_box" key={index}>
        <button
          className="delete-btn"
          onClick={() =>
            dispatch({ type: EAlarmActionType.removeAlarm, index })
          }
        >
          X
        </button>
        <div className="title">제목: {a.title}</div>
        <div className="policy">
          규칙:{" "}
          {a.policy.temp !== undefined
            ? "온도 => " + a.policy.temp + "도"
            : "강수확률 => " + a.policy.rainProbability + "%"}
        </div>
        <div className="date">마지막 업데이트: {a.date}</div>
      </div>
    ));
  }, [state.alarms]);

  useEffect(() => {
    let index = 0;

    const to = setInterval(() => {
      if (index++ >= weatherList.length) index = 0;
      dispatch({
        type: EAlarmActionType.setWeather,
        index: -1,
        weather: weatherList[index],
      });
    }, 20000);

    return () => {
      clearInterval(to);
    };
  }, []);

  return (
    <div className="App">
      {state.alarms[state.alarmIndex] && (
        <div className="alarm_popup">
          <div className="content_box">
            <div className="title">
              제목: {state.alarms[state.alarmIndex].title}
            </div>
            <div className="policy">
              규칙:
              {state.alarms[state.alarmIndex].policy.temp !== undefined
                ? " 온도 => " +
                  state.alarms[state.alarmIndex].policy.temp +
                  "도"
                : " 강수확률 => " +
                  state.alarms[state.alarmIndex].policy.rainProbability +
                  "%"}
            </div>
            <div className="weather">
              온도: {state.currentWeather.current.temp}
              {" -> "}
              {state.currentWeather.forecast.temp}
              <br />
              강수확률: {state.currentWeather.forecast.rainProbability}%
              <br />
            </div>
            <button
              className="check_btn"
              onClick={() =>
                dispatch({ type: EAlarmActionType.checkAlarm, index: -1 })
              }
            >
              확인
            </button>
            <button
              className="delete_btn"
              onClick={() =>
                dispatch({
                  type: EAlarmActionType.checkAlarm,
                  index: state.alarmIndex,
                })
              }
            >
              알람 삭제
            </button>
          </div>
        </div>
      )}
      {state.newAlarm !== null && (
        <div className="new_alarm_popup">
          <div className="content_box">
            <div className="title">
              제목
              <input
                type="text"
                className="title_input"
                value={state.newAlarm.title}
                onChange={(e) =>
                  dispatch({
                    type: EAlarmActionType.setTitle,
                    index: -1,
                    value: e.currentTarget.value,
                  })
                }
              />
            </div>
            <div className="policy">
              규칙
              <input
                type="number"
                placeholder="온도"
                min={-50}
                max={100}
                className="temp"
                value={
                  state.newAlarm.policy.temp !== undefined
                    ? state.newAlarm.policy.temp
                    : ""
                }
                onChange={(e) =>
                  dispatch({
                    type: EAlarmActionType.setPolicyTemp,
                    index: -1,
                    value: e.currentTarget.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="강수확률"
                className="rain"
                min={0}
                max={100}
                value={
                  state.newAlarm.policy.rainProbability !== undefined
                    ? state.newAlarm.policy.rainProbability
                    : ""
                }
                onChange={(e) =>
                  dispatch({
                    type: EAlarmActionType.setPolicyRain,
                    index: -1,
                    value: e.currentTarget.value,
                  })
                }
              />
            </div>
            <button
              className="add_btn"
              onClick={() =>
                dispatch({ type: EAlarmActionType.addAlarm, index: -1 })
              }
            >
              알람 추가
            </button>
          </div>
        </div>
      )}
      <div className="app_title">
        날씨 알람
        <button
          className="new_alarm_btn"
          onClick={() =>
            dispatch({ type: EAlarmActionType.newAlarm, index: -1 })
          }
        >
          {state.newAlarm ? "X" : "+"}
        </button>
      </div>
      <div className="alarm_view">{alarmView}</div>
    </div>
  );
}

export default App;
