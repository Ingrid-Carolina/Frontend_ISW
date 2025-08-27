import { createContext, useContext, useMemo, useState } from 'react';

const LiveContext = createContext(null);

export const LiveProvider = ({ children }) => {
  const [isLive, setIsLive] = useState(false); // true mientras el video no haya terminado
  const value = useMemo(() => ({ isLive, setIsLive }), [isLive]);
  return <LiveContext.Provider value={value}>{children}</LiveContext.Provider>;
};

export const useLive = () => {
  const ctx = useContext(LiveContext);
  if (!ctx) throw new Error('useLive must be used within LiveProvider');
  return ctx;
};