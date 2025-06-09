import Icons from "./icons";
import cn from "classnames";

type Props = { className?: string; onClick?: () => void; [key: string]: any };

const MoreButton = ({ className, onClick, ...rest }: Props) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "block border border-grey-200 bg-white text-black rounded-lg p-2 w-fit mx-auto",
        className
      )}
      {...rest}
    >
      {Icons.ic_more}
    </button>
  );
};

export default MoreButton;
