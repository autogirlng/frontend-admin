import { ReactNode } from "react";

const FormRow = ({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description?: string;
}) => (
  <div className="space-y-[18px]">
    <p className="text-h6 3xl:text-h5 font-medium text-black">{title}</p>
    {description && (
      <p className="text-grey-600 text-base 3xl:text-xl font-normal">{description}</p>
    )}

    {children}
  </div>
);

export default FormRow;