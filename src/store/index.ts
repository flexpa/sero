import Resource from "../resources"

export type Status = 'create' | 'updated' | 'deleted' | 'recreated';

type IStore = {
  [key in Resource]: {
    id: {
      id: string;
      txid: number;
      ts: number;
      status: Status;
      resource: Resource;
    };
  };
};

type IAction = string;

type Reducer = (state: IStore, action: IAction) => IStore;


export default function createStore(reducer: Reducer, initialState?: IStore): Reducer {
  return reducer
}


createStore((state, action) => { return state });