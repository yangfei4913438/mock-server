import React, { createContext, useContext, useState } from 'react';

interface IUserInfo {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface ITime {
  type: 'createdAt' | 'updatedAt';
  start: string;
  end: string;
}

interface IStoreContext {
  userInfo?: IUserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo | undefined>>;
  list?: any[];
  setList: React.Dispatch<React.SetStateAction<any[] | undefined>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  time: ITime;
  setTime: React.Dispatch<React.SetStateAction<ITime>>;
}

const initData: IStoreContext = {
  setUserInfo: () => undefined,
  setList: () => undefined,
  search: '',
  setSearch: () => undefined,
  time: { type: 'createdAt', start: '', end: '' },
  setTime: () => undefined,
};

const StoreContext = createContext<IStoreContext>(initData);

export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 用户信息，包含认证jwt
  const [userInfo, setUserInfo] = useState<IUserInfo>();
  // 展示的列表
  const [list, setList] = useState<any[]>();
  // 搜索信息
  const [search, setSearch] = useState(initData.search);
  // 时间信息
  const [time, setTime] = useState<ITime>(initData.time);

  const state: IStoreContext = {
    userInfo,
    setUserInfo,
    list,
    setList,
    search,
    setSearch,
    time,
    setTime,
  };

  return <StoreContext.Provider value={state}>{children}</StoreContext.Provider>;
};

export function useAppContext() {
  return useContext(StoreContext);
}
