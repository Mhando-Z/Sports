import { useState, useEffect, createContext } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [data, setData] = usestate();

  return <DataContext.Provider>{children}</DataContext.Provider>;
}

export default DataContext;
