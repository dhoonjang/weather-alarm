import produce from "immer";
import moment from "moment";

export enum EAlarmActionType {
  addAlarm = "ADD_ALARM",
  removeAlarm = "REMOVE_ALARM",
  newAlarm = "NEW_ALARM",
  checkAlarm = "CHECK_ALARM",
  setWeather = "SET_WEATHER",
  setDate = "SET_DATE",
  setPolicyTemp = "SET_POLICY_TEMP",
  setPolicyRain = "SET_POLICY_RAIN",
  setTitle = "SET_TITLE",
}

export interface IWeather {
  current: {
    temp: number;
    rainProbability: number;
  };
  forecast: {
    temp: number;
    rainProbability: number;
  };
}

export interface IPolicy {
  temp?: number;
  rainProbability?: number;
}

export interface IAlarm {
  date: string;
  title: string;
  policy: IPolicy;
}

export interface IAlarmAction {
  type: EAlarmActionType;
  index: number;
  value?: string | number;
  weather?: IWeather;
}

export interface IAlarmState {
  alarmIndex: number;
  alarms: IAlarm[];
  newAlarm: IAlarm | null;
  currentWeather: IWeather;
}

export const weatherList = [
  {
    current: {
      temp: 0,
      rainProbability: 0,
    },
    forecast: {
      temp: 10,
      rainProbability: 10,
    },
  },
  {
    current: {
      temp: 10,
      rainProbability: 10,
    },
    forecast: {
      temp: 20,
      rainProbability: 10,
    },
  },
  {
    current: {
      temp: 20,
      rainProbability: 10,
    },
    forecast: {
      temp: 10,
      rainProbability: 0,
    },
  },
  {
    current: {
      temp: 10,
      rainProbability: 0,
    },
    forecast: {
      temp: 30,
      rainProbability: 80,
    },
  },
  {
    current: {
      temp: 30,
      rainProbability: 80,
    },
    forecast: {
      temp: 20,
      rainProbability: 10,
    },
  },
  {
    current: {
      temp: 20,
      rainProbability: 10,
    },
    forecast: {
      temp: 0,
      rainProbability: 0,
    },
  },
];

export const initialAlarmState: IAlarmState = {
  alarmIndex: -1,
  alarms: [],
  newAlarm: null,
  currentWeather: weatherList[0],
};

const alarmReducer = (draft: IAlarmState, action: IAlarmAction) => {
  switch (action.type) {
    case EAlarmActionType.addAlarm:
      if (draft.newAlarm) {
        draft.alarms.push({ ...draft.newAlarm });
        draft.newAlarm = null;
      }
      break;
    case EAlarmActionType.removeAlarm:
      if (action.index >= 0 && draft.alarms[action.index])
        draft.alarms.splice(action.index, 1);
      break;
    case EAlarmActionType.newAlarm:
      if (draft.newAlarm) draft.newAlarm = null;
      else
        draft.newAlarm = {
          date: moment().format("YYYY/MM/DD | hh:mm:ss"),
          title: "",
          policy: {},
        };
      break;
    case EAlarmActionType.checkAlarm:
      if (action.index === draft.alarmIndex)
        draft.alarms.splice(action.index, 1);
      draft.alarmIndex = -1;
      break;
    case EAlarmActionType.setWeather:
      if (action.weather !== undefined) {
        draft.currentWeather = action.weather;
        draft.alarmIndex = draft.alarms.findIndex((a) => {
          if (a.policy.temp && action.weather) {
            if (action.weather.current.temp < action.weather.forecast.temp)
              return (
                action.weather.current.temp <= a.policy.temp &&
                a.policy.temp <= action.weather.forecast.temp
              );
            else
              return (
                action.weather.forecast.temp <= a.policy.temp &&
                a.policy.temp <= action.weather.current.temp
              );
          } else if (a.policy.rainProbability && action.weather) {
            return (
              a.policy.rainProbability <=
              action.weather.forecast.rainProbability
            );
          }
          return false;
        });
        if (draft.alarms[draft.alarmIndex])
          draft.alarms[draft.alarmIndex].date = moment().format(
            "YYYY/MM/DD | hh:mm:ss"
          );
      }
      break;
    case EAlarmActionType.setDate:
      if (action.value !== undefined && typeof action.value === "string") {
        if (action.index < 0 && draft.newAlarm)
          draft.newAlarm.date = action.value;
        else if (action.index > 0 && draft.alarms[action.index])
          draft.alarms[action.index].date = action.value;
      }
      break;
    case EAlarmActionType.setPolicyTemp:
      if (action.value !== undefined) {
        if (action.index < 0 && draft.newAlarm) {
          draft.newAlarm.policy.temp = Number(action.value);
          draft.newAlarm.policy.rainProbability = undefined;
        } else if (action.index > 0 && draft.alarms[action.index]) {
          draft.alarms[action.index].policy.temp = Number(action.value);
          draft.alarms[action.index].policy.rainProbability = undefined;
        }
      }
      break;
    case EAlarmActionType.setPolicyRain:
      if (action.value !== undefined) {
        if (action.index < 0 && draft.newAlarm) {
          draft.newAlarm.policy.rainProbability = Number(action.value);
          draft.newAlarm.policy.temp = undefined;
        } else if (action.index > 0 && draft.alarms[action.index]) {
          draft.alarms[action.index].policy.rainProbability = Number(
            action.value
          );
          draft.alarms[action.index].policy.temp = undefined;
        }
      }
      break;
    case EAlarmActionType.setTitle:
      if (action.value !== undefined && typeof action.value === "string") {
        if (action.index < 0 && draft.newAlarm)
          draft.newAlarm.title = action.value;
        else if (action.index > 0 && draft.alarms[action.index])
          draft.alarms[action.index].title = action.value;
      }
      break;
  }

  return draft;
};

export default produce(alarmReducer);
