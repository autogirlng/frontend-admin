"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";
import clsx from "clsx";

export interface ActionMenuItem {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

interface ActionMenuProps {
  actions: ActionMenuItem[];
}

export function ActionMenu({ actions }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 192;
      const menuHeight = actions.length * 40 + 10;
      const spaceBelow = window.innerHeight - rect.bottom;

      let topPos = rect.bottom + 5;

      if (spaceBelow < menuHeight && rect.top > menuHeight) {
        topPos = rect.top - menuHeight - 5;
      }

      setPosition({
        top: topPos,
        left: rect.right - menuWidth,
      });
      setIsOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const MenuDropdown = (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      className="z-50 w-48 origin-top-right bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={() => {
              action.onClick();
              setIsOpen(false);
            }}
            className={clsx(
              "flex w-full items-center px-4 py-2 text-sm",
              action.danger
                ? "text-red-700 hover:bg-red-50"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <Icon className="mr-3 h-4 w-4" aria-hidden="true" />
            {action.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <MoreVertical className="h-5 w-5" />
      {isClient && isOpen && createPortal(MenuDropdown, document.body)}
    </button>
  );
}
