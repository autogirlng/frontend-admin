import { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import Icons from "./icons";
import cn from "classnames";

type Props = {
  trigger: ReactNode;
  content: ReactNode | string;
};

export const TipsPopup = ({ trigger, content }: Props) => (
  <Dialog.Root modal>
    <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="bg-[#00000061] backdrop-blur-xl data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-0 left-0 z-10 min-h-screen h-full w-full flex justify-center py-20 overflow-auto focus:outline-none">
        <Dialog.Title className="hidden"></Dialog.Title>
        <div className="h-fit max-w-[350px] py-7 px-[31px] rounded-[45px] bg-grey-75 ">
          {content}
        </div>

        <Dialog.Close asChild>
          <button
            className="text-primary-500 font-semibold text-base absolute top-[45px] right-[35px] appearance-none inline-flex gap-2 items-center justify-center focus:outline-none"
            aria-label="Close"
          >
            {Icons.ic_close_circle}
            Close
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export const Popup = ({
  content,
  trigger,
  className,
  open,
  isOpen,
  handleIsOpen,
  align,
}: {
  content: ReactNode;
  trigger: ReactNode;
  className?: string;
  open?: boolean;
  isOpen?: boolean;
  handleIsOpen?: (open: boolean) => void;
  align?: "center" | "end" | "start";
}) => (
  <Popover.Root {...(open ? { open: isOpen, onOpenChange: handleIsOpen } : {})}>
    <Popover.Trigger asChild>{trigger}</Popover.Trigger>
    <Popover.Portal>
      <Popover.Content
        align={align ?? "end"}
        className={cn(
          "rounded-xl p-4 w-[225px] sm:w-[255px] bg-white border border-grey-200 will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade",
          className
        )}
        sideOffset={5}
      >
        {content}
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);
