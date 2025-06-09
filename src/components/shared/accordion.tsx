import React, { forwardRef } from "react";
import cn from "classnames";
import * as Accordion from "@radix-ui/react-accordion";
import Icons from "./icons";

const AccordionList = ({
  accordion,
}: {
  accordion: { title: string; content: string }[];
}) => (
  <Accordion.Root
    className="w-full space-y-5"
    type="single"
    defaultValue="item-1"
    collapsible
  >
    {accordion.map((item, index) => (
      <AccordionItem value={`item-${index + 1}`} key={index}>
        <AccordionTrigger>{item.title}</AccordionTrigger>
        <AccordionContent>{item.content}</AccordionContent>
      </AccordionItem>
    ))}
  </Accordion.Root>
);

const AccordionItem = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Accordion.Item>
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Item
    className={cn(
      "overflow-hidden data-[state=open]:py-6 data-[state=open]:py-8 data-[state=open]:px-5 data-[state=open]:md:px-11 data-[state=open]:relative data-[state=open]:z-10 data-[state=open]:rounded-3xl data-[state=open]:border data-[state=open]:border-primary-500 data-[state=open]:bg-primary-50",
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </Accordion.Item>
));

AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Accordion.Trigger>
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className="flex">
    <Accordion.Trigger
      className={cn(
        "group flex flex-1 cursor-default items-center justify-between bg-grey-50 rounded-3xl text-h6 md:text-h5 3xl:text-h4 text-primary-900 outline-none hover:bg-primary-50 data-[state=open]:bg-primary-50 data-[state=closed]:py-6 data-[state=closed]:py-8 data-[state=closed]:px-5 data-[state=closed]:md:px-11",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
      {Icons.ic_chevron_down}
    </Accordion.Trigger>
  </Accordion.Header>
));

AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Accordion.Content>
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={cn(
      "overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown",
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    <div className="pt-3 !font-normal text-sm md:text-base 3xl:text-xl text-primary-900">
      {children}
    </div>
  </Accordion.Content>
));

AccordionContent.displayName = "AccordionContent";

export default AccordionList;
