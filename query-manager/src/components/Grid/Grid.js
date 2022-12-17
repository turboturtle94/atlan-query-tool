import React, { useEffect, useMemo, useState } from "react";
import DataGrid from "react-data-grid";
import { Pagination } from "./Pagination";

export const Grid = ({
  gridData,
  isPaginationEnabled,
  paginationCallBack,
  paginationConfig,
}) => {
  const [rowsToBeDisplayed, setRowsToBeDisplayed] = useState(gridData);
  const { resultsPerPage, maxResults, currentStartIndex } =
    paginationConfig || {};
  const columns = useMemo(() => {
    if (gridData.length > 0) {
      return Object.keys(gridData[0]).map((item) => {
        return {
          key: item,
          name: item,
        };
      });
    }
  }, [gridData]);
  useEffect(() => {
    setRowsToBeDisplayed(gridData);
  }, [gridData]);
  return (
    <div>
      <DataGrid columns={columns} rows={rowsToBeDisplayed} />
      {isPaginationEnabled ? (
        <Pagination
          totalResults={maxResults}
          startIndex={currentStartIndex}
          resultsPerPage={resultsPerPage}
          onNavigate={(index) => {
            paginationCallBack(index, index + resultsPerPage - 1);
          }}
          endIndex={
            currentStartIndex + resultsPerPage - 1 >= maxResults
              ? maxResults.length
              : currentStartIndex + resultsPerPage - 1
          }
        ></Pagination>
      ) : null}
    </div>
  );
};
