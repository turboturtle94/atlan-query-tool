export const sortData = (data, columnsList,isDescending) => {
  const sortCallback = (item1, item2, columns) => {
    for (let i = 0; i < columns.length; i++) {
      let key = columns[i];
      if (item1[key] > item2[key]) {
        return isDescending ? -1:1;
      } else if (item1[key] < item2[key]) {
        return isDescending? 1:-1;
      }
    }
    return 0;
  };

  return columnsList.length > 0
    ? data.sort((item1, item2) => sortCallback(item1, item2, columnsList))
    : data;
};
