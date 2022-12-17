import React from "react";

import { TabList } from "./TabList";
import { TabContent } from "./TabContent";
import styled from "styled-components";
export const Tabs = ({ tabList, children, defaultTitle,activeIndex,...restProps }) => {
  return (
    <TabWrapper>
      <div className="tab-list">
        <TabList
          tabList={tabList}
          defaultTitle={defaultTitle}
          activeIndex={activeIndex}
          {...restProps}
        ></TabList>
      </div>
      <div className="tab-content">
        <TabContent>{children}</TabContent>
      </div>
    </TabWrapper>
  );
};

const TabWrapper = styled.div`
  border: 0.5px solid grey;
  div.tab-list {
    height: 30px;
    background-color: #f2f4f8;
    padding: 4px;
  }
  div.tab-content{
    height: calc(100% - 20px);
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    margin-top: 4px;
  }
`;
