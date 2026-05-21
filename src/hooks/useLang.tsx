import { createContext, useContext } from 'react';
import type { Lang } from '../data/translations';
import type { ReactNode } from 'react';

export const LangContext = createContext<Lang>('zh');

export function LangProvider(props: { children: ReactNode }) {
  return (
    <LangContext.Provider value={'zh'}>
      {props.children}
    </LangContext.Provider>
  );
}

export function useLang(): Lang {
  return useContext(LangContext);
}
