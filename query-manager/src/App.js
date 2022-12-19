import "react-data-grid/lib/styles.css";
import { useReducer } from "react";
import { Tabs } from "./components/Tabs/Tabs";
import { QueryView } from "./components/QueryView/QueryView";
import { QueryContext } from "./components/ContextProviders/QueryContext";
function App() {
  const queryHandler = (state, action) => {
    let newState = [...state];
    let id = newState.findIndex((el) => el.active);
    switch (action.type) {
      case "add data":
        let prevActive = newState.find((el) => el.active);
        prevActive.active = false;
        let newData = { ...action.data };
        newData.results = [];
        newData.query = "";
        newData.paginationConfig = {
          resultsPerPage: 10,
          maxResults: 0,
          currentStartIndex: 1,
        };
        newData.isPaginationEnabled = false;
        newData.sortConfig = {
          isDescending: false,
          columnsToSort: [],
          sortedColumns: [],
        };
        newData.exportedFile = {
          name: "",
          url: "",
        };
        newState.push(newData);
        return newState;
      case "activate":
        return action.data;
      case "remove data":
        return action.data;
      case "update data":
        newState[id].results = action.data;
        newState[id].paginationConfig = {
          ...newState[id].paginationConfig,
          maxResults: newState[id].results.length,
        };
        newState[id].sortConfig = {
          isDescending: false,
          columnsToSort: Object.keys(action.data[0]).map((item) => {
            return {
              name: item,
              selected: false,
            };
          }),
          sortedColumns: [],
        };
        return newState;
      case "update title":
        newState[id].title = action.data;
        return newState;
      case "update query":
        newState[id].query = action.data;
        return newState;
      case "update pagination":
        newState[id].paginationConfig = action.data;
        return newState;
      case "toggle pagination":
        newState[id].isPaginationEnabled = !newState[id].isPaginationEnabled;
        return newState;
      case "update sort columns config":
        let columnsToSort = newState[id].sortConfig.columnsToSort;
        let modifiedColumn = columnsToSort.find(
          (el) => el.name === action.data.name
        );
        modifiedColumn.selected = !modifiedColumn.selected;
        return newState;
      case "update sort type config":
        newState[id].sortConfig.isDescending =
          !newState[id].sortConfig.isDescending;
        return newState;
      case "toggle sorted columns":
        if (action.data.selected) {
          newState[id].sortConfig.sortedColumns.push({ ...action.data });
        } else {
          newState[id].sortConfig.sortedColumns = newState[
            id
          ].sortConfig.sortedColumns.filter(
            (el) => el.name !== action.data.name
          );
        }
        return newState;
      case "generate file":
        newState[id].exportedFile = { ...action.data };
        return newState;
      default:
        throw new Error("Invalid action dispatached");
    }
  };

  const [queryState, dispatch] = useReducer(queryHandler, [
    {
      title: "",
      query: "",
      results: [],
      active: true,
      id: Date.now(),
      paginationConfig: {
        resultsPerPage: 10,
        maxResults: 0,
        currentStartIndex: 1,
      },
      sortConfig: {
        columnsToSort: [],
        isDescending: false,
        sortedColumns: [],
      },
      isPaginationEnabled: false,
      exportedFile: {
        name: "",
        url: "",
      },
    },
  ]);

  return (
    <div className="App">
      <QueryContext.Provider
        value={{
          queryState,
          dispatch,
        }}
      >
        <Tabs
          tabList={queryState}
          defaultTitle="New query"
          activeIndex={queryState.findIndex((el) => el.active)}
          onNewTab={() => {
            dispatch({
              type: "add data",
              data: {
                id: Date.now(),
                title: "New query",
                active: true,
              },
            });
          }}
          onActivateTab={(id) => {
            let tempList = [...queryState];
            tempList.forEach((tab) => {
              if (tab.id === id) {
                tab.active = true;
              } else {
                tab.active = false;
              }
            });
            dispatch({
              type: "activate",
              data: tempList,
            });
          }}
          onCloseTab={(id) => {
            let tempList = [...queryState];
            tempList = tempList.filter((item) => item.id !== id);
            let activeTab = tempList.find((el) => {
              return el.active;
            });
            if (!activeTab) {
              tempList[tempList.length - 1].active = true;
            }
            dispatch({
              type: "remove data",
              data: tempList,
            });
          }}
        >
          <QueryView></QueryView>
        </Tabs>
      </QueryContext.Provider>
    </div>
  );
}

export default App;
