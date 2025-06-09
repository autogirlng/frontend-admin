import { ReactNode } from "react";

const FormRow = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-8 3xl:gap-[50px]">
      {children}
    </div>
  );
};

export default FormRow;
