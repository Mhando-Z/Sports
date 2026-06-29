import { useState, useEffect, createContext } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [channels, setChannels] = useState();

  const fetchChannels = async () => {
    fetch("https://iptv-org.github.io/api/channels.json")
      .then((res) => res.json())
      .then((data) => {
        setChannels(data);
      });
    return null;
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  return (
    <DataContext.Provider value={channels}>{children}</DataContext.Provider>
  );
}

export default DataContext;
