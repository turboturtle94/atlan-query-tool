import React, { useCallback, useContext, useEffect, useState } from "react";
import { QueryContext } from "../ContextProviders/QueryContext";
import styled from "styled-components";

import { Grid } from "../Grid/Grid";

import { executeQuery } from "../../utils/QueryEngine";

import { GiEmptyMetalBucket as Empty } from "react-icons/gi";

import { sortData } from "./Sort";

import Papa from "papaparse";

export const QueryView = () => {
  const queryContext = useContext(QueryContext);
  const { dispatch, queryState } = queryContext;
  const {
    title,
    query,
    results,
    paginationConfig,
    isPaginationEnabled,
    sortConfig,
    exportedFile,
  } = queryState.find((el) => el.active);
  let { resultsPerPage } = paginationConfig;
  const [gridData, setGridData] = useState(results);

  const exportData = (queryToDownload) => {
    let title = queryToDownload.trim();
    title = title !== "" ? title : "Sample";
    const blob = new File([Papa.unparse(results)], title + ".csv", {
      type: "text/csv",
    });
    dispatch({
      type: "generate file",
      data: {
        name: title,
        url: URL.createObjectURL(blob),
      },
    });
  };
  const paginationCallBack = (startIndex, endIndex) => {
    dispatch({
      type: "update pagination",
      data: {
        ...paginationConfig,
        currentStartIndex: startIndex,
      },
    });
    const finalData = sortData(
      getResultSetWithinRange(startIndex, endIndex),
      sortConfig.sortedColumns,
      sortConfig.isDescending
    );
    setGridData(finalData);
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
    const { paginationConfig, isPaginationEnabled, sortConfig } =
      queryState.find((el) => el.active);
    const { currentStartIndex, resultsPerPage, maxResults } = paginationConfig;
    let startIndex = currentStartIndex;
    let endIndex =
      isPaginationEnabled && resultsPerPage > 0
        ? startIndex + resultsPerPage - 1
        : maxResults;
    const finalData = sortData(
      getResultSetWithinRange(startIndex, endIndex),
      sortConfig.sortedColumns.map((el) => el.name),
      sortConfig.isDescending
    );
    setGridData(finalData);
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
      {query !== "" ? (
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
            {gridData.length > 0 ? (
              <button
                onClick={(event) => {
                  event.preventDefault();
                  exportData(title);
                }}
              >
                Export
              </button>
            ) : null}
            {exportedFile.url !== "" ? (
              <a href={exportedFile.url}>{exportedFile.name}</a>
            ) : null}
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
                    let value = parseInt(event.target.value);
                    event.persist();
                    dispatch({
                      type: "update pagination",
                      data: {
                        ...paginationConfig,
                        resultsPerPage: isNaN(value) ? 1 : value,
                      },
                    });
                  }}
                />
                <label>Rows per page</label>
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
      {gridData.length > 0 ? (
        <Grid
          gridData={gridData}
          paginationConfig={paginationConfig}
          paginationCallBack={paginationCallBack}
          isPaginationEnabled={isPaginationEnabled}
          sortConfig={sortConfig}
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
  height: 80vh;
  font-size: 16px;
  overflow-y: scroll;
  background-color: #f2f4f8;
  border-radius: 8px;
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
      background-color: #2026d2;
      color: white;
      border: none;
      width: 80px;
      height: 30px;
      border-radius: 2px;
      cursor: pointer;
      &:hover {
        background-color: white;
        border: #2026d2;
        color: #2026d2;
      }
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
    height: 30%;
    border: 0.5px solid grey;
    margin-bottom: 8px;
    padding: 4px;
    border-radius: 4px;
    min-height: 30vh;
  }
`;
