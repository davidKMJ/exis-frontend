import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ModeType } from "@/components/ui/gluestack-ui-provider";
import { storeObjectData, getObjectData, removeData } from "./async-storage";

type ModeState = {
    mode: ModeType;
    setMode: (mode: ModeType) => void;
};

export const useModeStore = create<ModeState>()(
    persist(
        (set) => ({
            mode: "system",
            setMode: (mode) => set((state) => ({ ...state, mode })),
        }),
        {
            name: "mode-store",
            storage: createJSONStorage(() => ({
                getItem: getObjectData,
                setItem: storeObjectData,
                removeItem: removeData,
            })),
        }
    )
);
