import Icons from "@/utils/Icon";
import * as Popover from "@radix-ui/react-popover";

const Tooltip = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Popover.Root>
    <Popover.Trigger asChild>
      <button
        className="cursor-pointer outline-none text-grey-500"
        aria-label="Update dimensions"
      >
        {Icons.ic_info}
      </button>
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content
        className="rounded-xl p-4 w-[330px] bg-white border border-grey-200 will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
        sideOffset={5}
      >
        <div className="flex items-start gap-2">
          <div className="text-sm space-y-1">
            <p className="text-grey-800 font-semibold">{title}</p>
            <p className="text-grey-500">{description}</p>
          </div>
          <Popover.Close
            className="outline-none cursor-pointer text-grey-500"
            aria-label="Close"
          >
            {Icons.ic_multiply}
          </Popover.Close>
        </div>
        <Popover.Arrow asChild className="fill-white">
          {Icons.ic_tooltip_arrow}
        </Popover.Arrow>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);

export default Tooltip;
