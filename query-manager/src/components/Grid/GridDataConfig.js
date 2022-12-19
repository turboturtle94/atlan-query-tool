import React, { useContext } from "react";

import { BiSortAlt2, BiFilter } from "react-icons/bi";

import styled from "styled-components";

import * as Popover from "@radix-ui/react-popover";

import Switch from "react-switch";

import "./popOverStyles.css";

import { QueryContext } from "../ContextProviders/QueryContext";

import { AiOutlineClose as Times } from "react-icons/ai";

export const GridDataConfig = ({ sortConfig ,onSortCallBack}) => {
  const queryContext = useContext(QueryContext);

  const { columnsToSort, isDescending, sortedColumns } = sortConfig;
  const { dispatch } = queryContext;
  return (
    <GridDataConfigWrapper>
      <div className="data-config-options">
        <Popover.Root>
          <Popover.Trigger asChild>
            <button>
              <span>
                <BiSortAlt2></BiSortAlt2>
              </span>
              <label>Sort</label>
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="popover__content-sort" align="start">
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <label className="sort-type">
                  <span>Descending</span>
                  <Switch
                    uncheckedIcon={false}
                    checkedIcon={false}
                    height={10}
                    width={30}
                    onChange={() => {
                      dispatch({
                        type: "update sort type config",
                      });
                    }}
                    checked={isDescending}
                    handleDiameter={15}
                    onHandleColor="#fff"
                    onColor="#2026d2"
                  />
                </label>
                <label>Sort on</label>
                <div className="columninput-container">
                  {columnsToSort.map((item) => {
                    return (
                      <div key={item.name}>
                        <input
                          type="checkbox"
                          onChange={() => {
                            dispatch({
                              type: "update sort columns config",
                              data: {
                                name: item.name,
                              },
                            });
                            dispatch({
                              type: "toggle sorted columns",
                              data: {
                                name: item.name,
                                selected: !item.selected,
                              },
                            });
                          }}
                          checked={item.selected}
                        />
                        <label>{item.name}</label>
                      </div>
                    );
                  })}
                </div>
                <label>Sort order</label>
                <div className="selectedcolumns">
                  {sortedColumns.map((item) => {
                    return item.selected ? (
                      <div key={item.name}>
                        <label>{item.name}</label>
                        <button
                          onClick={() => {
                            dispatch({
                              type: "update sort columns config",
                              data: {
                                name: item.name,
                              },
                            });
                            dispatch({
                              type: "toggle sorted columns",
                              data: {
                                name: item.name,
                                selected: !item.selected,
                              },
                            });
                          }}
                        >
                          <Times></Times>
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </GridDataConfigWrapper>
  );
};

const GridDataConfigWrapper = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  div.data-config-options {
    width: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    button {
      border: none;
      background: none;
      color: #2026d2;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;
