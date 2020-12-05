import React, { useMemo, useReducer } from "react";
import alarmReducer, {
  EAlarmActionType,
  initialAlarmState,
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

    return sortedAlarms.map((a, i) => {
      return (
        <div className="alarm_box" key={i}>
          <button
            className="delete-btn"
            onClick={() =>
              dispatch({ type: EAlarmActionType.removeAlarm, index: i })
            }
          >
            X
          </button>
          <div className="title">제목: {a.title}</div>
          <div className="policy">규칙: {a.policy}</div>
          <div className="date">마지막 업데이트: {a.date}</div>
        </div>
      );
    });
  }, [state.alarms]);

  return (
    <div className="App">
      {state.newAlarm !== null && (
        <div className="new_alarm_popup">
          <div className="content_box">
            <div className="title">
              제목
              <input
                type="text"
                className="title"
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
                type="text"
                className="policy"
                value={state.newAlarm.policy}
                onChange={(e) =>
                  dispatch({
                    type: EAlarmActionType.setPolicy,
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
