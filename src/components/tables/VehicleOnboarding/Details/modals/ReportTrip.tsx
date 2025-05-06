import Button from "@/components/shared/button";
import useBookingActions from "../../hooks/useVehicleOnboardingTable";
import {
  ChangeEvent,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import TextArea from "@/components/shared/textarea";
import { Form, Formik } from "formik";
import { BlurredDialog } from "@/components/shared/dialog";
import { reportBookingSchema } from "@/utils/validationSchema";

type ReportTripProps = {
  handleAction: ({ message }: { message: string }) => void;
  openModal: boolean;
  handleModal: (value?: boolean) => void;
  trigger: ReactNode;
  isLoading: boolean;
  setReport: Dispatch<SetStateAction<string>>;
};

const ReportTrip = ({
  trigger,
  handleAction,
  openModal,
  handleModal,
  isLoading,
  setReport,
}: ReportTripProps) => {
  return (
    <BlurredDialog
      open={openModal}
      onOpenChange={handleModal}
      trigger={trigger}
      content={
        <PopupContent
          handleAction={handleAction}
          handleModal={handleModal}
          isLoading={isLoading}
          setReport={setReport}
        />
      }
    />
  );
};

type PopupContentProps = {
  handleAction: ({ message }: { message: string }) => void;
  // openModal: boolean;
  handleModal: (value?: boolean) => void;
  isLoading: boolean;
  setReport: Dispatch<SetStateAction<string>>;
};

const PopupContent = ({
  handleAction,
  handleModal,
  isLoading,
  setReport,
}: PopupContentProps) => {
  return (
    <Formik
      initialValues={{ message: "" }}
      onSubmit={async (values, { setSubmitting }) => {
        console.log(values);

        handleAction(values);
        setSubmitting(false);
      }}
      validationSchema={reportBookingSchema}
      enableReinitialize={true}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          isValid,
          dirty,
          handleBlur,
          handleChange,
          isSubmitting,
        } = props;
        return (
          <Form className="space-y-6">
            <h6 className="text-base sm:text-xl 3xl:text-h6 !font-semibold text-grey-800">
              Report Booking
            </h6>
            <TextArea
              name="message"
              id="message"
              type="text"
              placeholder="Type a message"
              value={values.message}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                handleChange(event);
                setReport(event.target.value);
              }}
              onBlur={handleBlur}
              error={errors.message && touched.message ? errors.message : ""}
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                fullWidth
                variant="filled"
                color="white"
                type="submit"
                className="!bg-grey-90 !text-grey-700"
                onClick={() => handleModal(false)}
              >
                Cancel
              </Button>

              <Button
                fullWidth
                variant="filled"
                color="primary"
                loading={isLoading}
                disabled={isLoading || !isValid}
                type="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ReportTrip;
