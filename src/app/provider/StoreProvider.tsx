"use client";
import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../../lib/store";

export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null); // <--- Add `| null` to the type and initialize with `null`

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  if (!storeRef.current) {
    return <div>Error: Could not initialize Redux store.</div>;
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
