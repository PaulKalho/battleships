"use client";

import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import network from "@/utils/sockets/socket";
type DataType = {
  firstName: string;
};

interface ContextProps {
  socket: any;
}

const GlobalContext = createContext<ContextProps>({
  socket: {},
});

export const GlobalContextProvider = ({ children }) => {
  const socket = network;

  return (
    <GlobalContext.Provider value={{ socket }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
