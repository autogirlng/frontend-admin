import { ReactNode } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import cn from "classnames";

type Props = {
  tabs: { name: string; value: string; content: ReactNode }[];
  label: string;
  tabClass?: string;
  contentClass?: string;
};

const AppTabs = ({ tabs, label, contentClass, tabClass }: Props) => (
  <Tabs.Root className="w-full" defaultValue="tab1">
    <Tabs.List
      className="shrink-0 flex border-b border-grey-200"
      aria-label={label}
    >
      {tabs.map((tab, index) => (
        <Tabs.Trigger
          key={index}
          className={cn(
            "bg-transparent px-4 py-5 flex-1 flex items-center justify-center text-sm md:text-xl 3xl:text-h5 text-grey-700 select-none hover:text-primary-500 data-[state=active]:text-primary-500 data-[state=active]:border-b data-[state=active]:border-primary-500 outline-none",
            tabClass
          )}
          value={tab.value}
        >
          {tab.name}
        </Tabs.Trigger>
      ))}
    </Tabs.List>

    {tabs.map((tab, index) => (
      <Tabs.Content
        key={index}
        className={cn(
          "grow mt-6 p-5 bg-grey-50 px-6 md:px-8 3xl:px-10 py-7 3xl:py-8 space-y-10 rounded-[40px] outline-none",
          contentClass
        )}
        value={tab.value}
      >
        {tab.content}
      </Tabs.Content>
    ))}
  </Tabs.Root>
);

export default AppTabs;
