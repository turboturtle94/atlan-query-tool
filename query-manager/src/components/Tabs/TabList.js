import React, { useEffect } from "react";
import { AiOutlineClose as Times, AiOutlinePlus as Plus } from "react-icons/ai";
import styled from "styled-components";

export const TabList = ({ tabList,defaultTitle,onNewTab,onActivateTab,onCloseTab }) => {
  
  useEffect(() => {

  },[tabList])

  const newTab = (event) => {
    event.stopPropagation();
    if(tabList.length > 15){
      alert("Maximum tab limit reached!");
      return;
    }
    onNewTab();
  };

  const activateTab = (event, id) => {
    event.stopPropagation();
    onActivateTab(id)
  };

  const closeTab = (event, id) => {
    event.stopPropagation();
    onCloseTab(id)
  };
  return (
    <TabListWrapper>
      <ul>
        {tabList.map((tab) => {
          return (
            <li
              key={tab.id}
              className={tab.active ? "active" : ""}
              onClick={(event) => {
                activateTab(event, tab.id);
              }}
            >
              <label>{tab.title !== "" ? tab.title : defaultTitle}</label>
              {tabList.length > 1 ? (
                <button
                  onClick={(event) => {
                    closeTab(event, tab.id);
                  }}
                >
                  <Times></Times>
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
      <button
        onClick={(event) => {
          newTab(event);
        }}
      >
        <Plus></Plus>
      </button>
    </TabListWrapper>
  );
};

const TabListWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: lightgray;
  button {
    border: none;
    background: none;
  }
  ul {
    display: flex;
    padding: 0;
    margin: 0;
    align-items: center;
    li {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 4px;
      label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 4px;
      }
    }
    li.active {
      background-color: white;
    }
  }
`;
