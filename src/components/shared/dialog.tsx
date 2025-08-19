import { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Icons from "./icons";
import cn from "classnames";

type Props = {
  trigger: ReactNode;
  title?: string | ReactNode;
  description?: string;
  content: ReactNode | string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  width?: string;
};

export const BlurredDialog = ({
  trigger,
  title,
  description,
  content,
  open,
  onOpenChange,
  width = "max-w-[950px]",
}: Props) => (
  <Dialog.Root modal open={open} onOpenChange={onOpenChange}>
    <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="bg-white/80  backdrop-blur-xl data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-0 left-0 min-h-screen h-full w-full flex justify-center items-center focus:outline-none py-14 px-4 overflow-y-auto">
        <div
          className={cn(
            "space-y-6 w-full rounded-[56px] bg-grey-50 border border-grey-400 py-9 sm:py-14 3xl:py-[107px] px-5 sm:px-9 3xl:px-[67px] m-auto",
            width
          )}
        >
          <Dialog.Title className="text-grey-800 text-center text-xl 3xl:text-h6 !font-semibold">
            {title ? (
              title
            ) : (
              <img
                src="/icons/warning.png"
                alt=""
                width={56}
                height={56}
                className="w-10 md:w-[50px] h-10 md:h-[50px]"
              />
            )}
          </Dialog.Title>
          {description && (
            <Dialog.Description className="text-grey-500 my-5 z-50 text-base">
              {description}
            </Dialog.Description>
          )}
          {content}
        </div>
        <Dialog.Close asChild>
          <button
            className="text-primary-500 font-semibold text-base absolute top-7 right-[35px] appearance-none inline-flex gap-2 items-center justify-center focus:outline-none"
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

type FullPageDialogProps = {
  trigger: ReactNode;
  title: string;
  description?: string;
  content: ReactNode | string;
};

export const FullPageDialog = ({
  trigger,
  title,
  description,
  content,
}: FullPageDialogProps) => (
  <Dialog.Root modal>
    <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-0 left-0 min-h-screen h-full w-full md:w-[calc(100%-250px)] 2xl:w-[calc(100%-272px)] md:ml-[250px] 2xl:ml-[272px] border-l border-grey-300 bg-white py-[45px] px-[35px] focus:outline-none">
        <Dialog.Title className="text-grey-700 text-4xl font-bold">
          {title}
        </Dialog.Title>
        {description && (
          <Dialog.Description className="text-grey-500 my-5 text-base">
            {description}
          </Dialog.Description>
        )}
        <div className="mt-[67px]">{content}</div>

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
