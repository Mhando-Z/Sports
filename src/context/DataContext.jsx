"use client";

import { useState, useEffect, createContext } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [channels, setChannels] = useState();
  const [feeds, setFeeds] = useState();
  const [logos, setLogos] = useState();
  const [stream, setStream] = useState();

  const fetchStreamsds = async () => {
    try {
      fetch("https://iptv-org.github.io/api/streams.json")
        .then((res) => res.json())
        .then((data) => {
          setStream(data);
        });
    } catch {}
  };
  const fetchFeeds = async () => {
    try {
      fetch("https://iptv-org.github.io/api/feeds.json")
        .then((res) => res.json())
        .then((data) => {
          setFeeds(data);
        });
    } catch {}
  };
  const fetchLogos = async () => {
    try {
      fetch("https://iptv-org.github.io/api/logos.json")
        .then((res) => res.json())
        .then((data) => {
          setLogos(data);
        });
    } catch {}
  };

  const fetchChannels = async () => {
    try {
      fetch("https://iptv-org.github.io/api/channels.json")
        .then((res) => res.json())
        .then((data) => {
          setChannels(data);
        });
    } catch {}
  };

  useEffect(() => {
    fetchChannels();
    fetchStreamsds();
    fetchFeeds();
    fetchLogos();
  }, []);

  return (
    <DataContext.Provider value={channels}>{children}</DataContext.Provider>
  );
}

export default DataContext;
