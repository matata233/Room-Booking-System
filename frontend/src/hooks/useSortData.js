import { useState, useMemo } from "react";

const useSortData = (data) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "" });

  const sortBy = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else {
      direction = "ascending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data; // No sorting if sortConfig.key is null
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  return { sortedData, sortBy };
};

export default useSortData;
