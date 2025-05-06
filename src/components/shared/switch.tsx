import * as Switch from "@radix-ui/react-switch";

type SwitchProps = {
  className?: string;
  id: string;
  name: string;
  onChange?: (value: boolean) => void;
  value?: boolean;
  disabled?: boolean;
};

const AppSwitch = ({
  id,
  name,
  value,
  className,
  disabled = false,
  onChange,
}: SwitchProps) => (
  <Switch.Root
    className="w-[62px] h-[39px] bg-grey-200 rounded-full relative data-[state=checked]:bg-primary-400 outline-none cursor-default min-w-[60px]"
    id={id}
    checked={value}
    disabled={disabled}
    name={name}
    onCheckedChange={onChange}
  >
    <Switch.Thumb className="block w-[31px] h-[31px] bg-white rounded-full transition-transform duration-100 translate-x-1 will-change-transform data-[state=checked]:translate-x-[27px] cursor-pointer" />
  </Switch.Root>
);

export default AppSwitch;
