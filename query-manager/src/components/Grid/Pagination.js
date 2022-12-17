import React from "react";
import styled from "styled-components";

export const Pagination = ({ resultsPerPage, totalResults, startIndex,endIndex=totalResults,onNavigate }) => {

  return (
    <PaginationWrapper>
      <label>
        {startIndex} - {endIndex} of {totalResults}
      </label>
      <div>
        <button
          disabled={startIndex - 1 <= 0}
          onClick={() => {
            onNavigate(startIndex - resultsPerPage);
          }}
        >
          &#10094;
        </button>
        <button
          disabled = {startIndex + resultsPerPage - 1 >= totalResults}
          onClick={() => {
            onNavigate(startIndex + resultsPerPage);
          }}
        >
          &#10095;
        </button>
      </div>
    </PaginationWrapper>
  );
};

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
  div {
    display: flex;
    justify-content: space-between;
    width: 50px;
    button {
      border: none;
      background: none;
    }
  }
`;
