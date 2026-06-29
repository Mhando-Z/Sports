"use client";

import { useState, useEffect, useMemo, createContext } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [channels, setChannels] = useState();
  const [feeds, setFeeds] = useState();
  const [logos, setLogos] = useState();
  const [streams, setStream] = useState();
  const [categories, setCategories] = useState();

  const mergedChannels = useMemo(() => {
    if (!channels || !feeds || !logos || !streams) return [];

    const feedMap = new Map(feeds.map((f) => [f.channel, f]));
    const logoMap = new Map(
      logos.filter((l) => l.in_use).map((l) => [l.channel, l]),
    );
    const streamMap = new Map(streams.map((s) => [s.channel, s]));

    return channels.map((channel) => ({
      ...channel,
      feed: feedMap.get(channel.id),
      logo: logoMap.get(channel.id),
      stream: streamMap.get(channel.id),
    }));
  }, [channels, feeds, logos, streams]);

  const fetchCategories = async () => {
    try {
      fetch("https://iptv-org.github.io/api/categories.json")
        .then((res) => res.json())
        .then((data) => {
          setCategories(data);
        });
    } catch {}
  };
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
    fetchCategories();
    fetchLogos();
  }, []);

  return (
    <DataContext.Provider
      value={{
        channels: mergedChannels,
        rawChannels: channels,
        feeds,
        logos,
        streams,
        categories,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataContext;
