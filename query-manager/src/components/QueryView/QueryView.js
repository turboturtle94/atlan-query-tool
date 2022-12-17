import React, { useCallback, useContext, useEffect, useState } from "react";
import { QueryContext } from "../ContextProviders/QueryContext";
import styled from "styled-components";

import { Grid } from "../Grid/Grid";

import { executeQuery } from "../../utils/QueryEngine";

import { GiEmptyMetalBucket as Empty } from "react-icons/gi";

export const QueryView = () => {
  const queryContext = useContext(QueryContext);
  const { dispatch, queryState } = queryContext;
  const { title, query, results, paginationConfig, isPaginationEnabled } =
    queryState.find((el) => el.active);
  let { resultsPerPage } = paginationConfig;
  const [gridData, setGridData] = useState(results);
  const paginationCallBack = (startIndex, endIndex) => {
    dispatch({
      type: "update pagination",
      data: {
        ...paginationConfig,
        currentStartIndex: startIndex,
      },
    });
    setGridData(getResultSetWithinRange(startIndex, endIndex));
  };

  const getResultSetWithinRange = useCallback(
    (startIndex, endIndex) => {
      let currentActiveTab = queryState.find((el) => el.active);
      let tempResults = [];
      for (
        let i = startIndex - 1;
        i < endIndex && i < currentActiveTab.results.length;
        i++
      ) {
        tempResults.push(currentActiveTab.results[i]);
      }
      return tempResults;
    },
    [queryState]
  );

  useEffect(() => {
    const { paginationConfig, isPaginationEnabled } = queryState.find(
      (el) => el.active
    );
    const { currentStartIndex, resultsPerPage, maxResults } = paginationConfig;
    let startIndex = currentStartIndex;
    let endIndex =
      isPaginationEnabled && resultsPerPage > 0
        ? startIndex + resultsPerPage - 1
        : maxResults;
    setGridData(getResultSetWithinRange(startIndex, endIndex));
  }, [queryState, getResultSetWithinRange, gridData.length]);
  return (
    <QueryViewWrapper>
      <label>Title</label>
      <input
        type="text"
        value={title}
        onChange={(event) => {
          event.persist();
          dispatch({
            type: "update title",
            data: event.target.value,
          });
        }}
      ></input>
      <label>Query</label>
      <textarea
        value={query}
        onChange={(event) => {
          event.persist();
          dispatch({
            type: "update query",
            data: event.target.value,
          });
        }}
      ></textarea>
      <div className="query-config">
        <div className="query-actions">
          <button
            onClick={() => {
              let queryResults = executeQuery(query);
              dispatch({
                type: "update data",
                data: queryResults,
              });
            }}
          >
            Execute
          </button>
          <button>Export</button>
        </div>
        <div className="pagination-config">
          <input
            type="checkbox"
            checked={isPaginationEnabled}
            onChange={() => {
              dispatch({
                type: "toggle pagination",
              });
            }}
          ></input>
          <label>Enable pagination</label>
          {isPaginationEnabled ? (
            <span>
              <input
                type="input"
                value={resultsPerPage}
                onChange={(event) => {
                  event.persist();
                  dispatch({
                    type: "update pagination",
                    data: {
                      ...paginationConfig,
                      resultsPerPage: parseInt(event.target.value),
                    },
                  });
                }}
              />
              <label>Rows per page</label>
            </span>
          ) : null}
        </div>
      </div>
      {gridData.length > 0 ? (
        <Grid
          gridData={gridData}
          paginationConfig={paginationConfig}
          paginationCallBack={paginationCallBack}
          isPaginationEnabled={isPaginationEnabled}
        />
      ) : (
        <div className="no-data-div">
          <h2>Bucket is empty. Execute the query to see the results here</h2>
          <div className="no-data-icon-wrapper">
            <Empty className="no-data-icon"></Empty>
          </div>
        </div>
      )}
    </QueryViewWrapper>
  );
};

const QueryViewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  height: 70vh;
  font-size: 16px;
  div.no-data-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: grey;
    div.no-data-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 60px;
    }
  }
  div.query-config {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    justify-content: space-between;
    div.query-actions {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 4px;
    }
    div.pagination-config {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      label {
        margin-left: 4px;
        margin-right: 4px;
      }
      input[type="input"] {
        width: 40px;
        margin-left: 4px;
        margin-right: 4px;
        text-align: center;
      }
    }
    button {
      margin-right: 4px;
    }
  }
  input {
    height: 28px;
    border: 0.5px solid grey;
    margin-bottom: 8px;
    padding: 4px;
    border-radius: 4px;
    min-height: 28px;
  }
  textarea {
    height: 50%;
    border: 0.5px solid grey;
    margin-bottom: 8px;
    padding: 4px;
    border-radius: 4px;
    min-height: 30vh;
  }
`;
