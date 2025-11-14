import { SidebarTab } from '@/src/types/Tab';
import { createContext, useContext } from 'react';



export const TabContext = createContext<[SidebarTab, (tab: SidebarTab) => void]>([null, () => {}]);

export const useTabContext = () => useContext(TabContext);
