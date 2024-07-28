export enum NewsActionsType {
  PIN_NEWS = 'PIN_NEWS',
  STORE_LOCAL_DATA = 'STORE_LOCAL_DATA',
  SET_LIST_VIEW_DATA = 'SET_LIST_VIEW_DATA'
}

interface NewsActions {
  type: NewsActionsType;
  payload: Object[];
}

export const newsReducer = (state: any, action: NewsActions) => {
  switch (action.type) {
    case "PIN_NEWS": {
      return {
        ...state,
        pinnedNews: action.payload,
      };
    }
    case "STORE_LOCAL_DATA": {
      return {
        ...state,
        storageNewsData: action.payload,
      };
    }
    case "SET_LIST_VIEW_DATA": {
      return {
        ...state,
        currentData: action.payload.filter(news => news !== undefined),
      };
    }
  }
};