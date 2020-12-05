import produce from "immer";
import moment from "moment";

export enum EAlarmActionType {
  addAlarm = "ADD_ALARM",
  removeAlarm = "REMOVE_ALARM",
  newAlarm = "NEW_ALARM",
  setDate = "SET_DATE",
  setPolicy = "SET_POLICY",
  setTitle = "SET_TITLE",
}

export interface IAlarm {
  date: string;
  title: string;
  policy: string;
}

export interface IAlarmState {
  alarms: IAlarm[];
  newAlarm: IAlarm | null;
}

export interface IAlarmAction {
  type: EAlarmActionType;
  index: number;
  value?: string;
}

export const initialAlarmState: IAlarmState = {
  alarms: [],
  newAlarm: null,
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
          policy: "",
        };
      break;
    case EAlarmActionType.setDate:
      if (action.value !== undefined) {
        if (action.index < 0 && draft.newAlarm)
          draft.newAlarm.date = action.value;
        else if (action.index > 0 && draft.alarms[action.index])
          draft.alarms[action.index].date = action.value;
      }
      break;
    case EAlarmActionType.setPolicy:
      if (action.value !== undefined) {
        if (action.index < 0 && draft.newAlarm)
          draft.newAlarm.policy = action.value;
        else if (action.index > 0 && draft.alarms[action.index])
          draft.alarms[action.index].policy = action.value;
      }
      break;
    case EAlarmActionType.setTitle:
      if (action.value !== undefined) {
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
