import React, { useState } from "react"

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean
}

interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean
}

interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
}

export function Collapsible({ 
  children, 
  defaultOpen = false,
  className = "",
  ...props 
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={className} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === CollapsibleTrigger) {
            return React.cloneElement(child as React.ReactElement<CollapsibleTriggerProps>, {
              isOpen,
              onClick: () => setIsOpen(!isOpen),
            })
          }
          if (child.type === CollapsibleContent) {
            return React.cloneElement(child as React.ReactElement<CollapsibleContentProps>, {
              isOpen,
            })
          }
        }
        return child
      })}
    </div>
  )
}

export function CollapsibleTrigger({ 
  children, 
  isOpen,
  className = "",
  ...props 
}: CollapsibleTriggerProps) {
  return (
    <button
      type="button"
      className={`w-full ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function CollapsibleContent({ 
  children, 
  isOpen,
  className = "",
  ...props 
}: CollapsibleContentProps) {
  if (!isOpen) return null

  return (
    <div
      className={`overflow-hidden transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
} 