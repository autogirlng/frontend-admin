import { Formik, Form } from "formik";
import { StepperNavigation } from "@/components/shared/stepper";
import { documentVehicleInformationSchema } from "@/utils/validationSchema";
import useDocumentInformationForm from "./useDocumentInformationForm";
import FileInputField from "@/components/shared/fileInputField"; // Make sure this path is correct

const DocumentInformationForm = ({
  steps,
  currentStep,
  setCurrentStep,
}: {
  steps: string[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}) => {
  const { submitStep5, saveStep5, initialValues } = useDocumentInformationForm({
    currentStep,
    setCurrentStep,
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={documentVehicleInformationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        console.log("Form values:", values);
        const formData = new FormData();
        for (const key in values) {
          // @ts-ignore
          if (values[key]) {
            formData.append(
              key,
              // @ts-ignore
              values[key] as File
            );
          }
        }
        await submitStep5.mutateAsync(formData);
        setSubmitting(false);
      }}
    >
      {({ values, setFieldValue, isValid, isSubmitting, handleBlur }) => (
        <Form className="max-w-[800px] w-full space-y-8">
          <FileInputField
            name="proofOfOwnership"
            id="proofOfOwnership"
            label="Proof Of Ownership"
            placeholder="Upload Document"
            filePicker
            onFileSelect={(file) => setFieldValue("proofOfOwnership", file)}
            onBlur={handleBlur} // Pass Formik's onBlur to update touched state
            info
            tooltipTitle="Proof Of Ownership:"
            tooltipDescription="Upload documents such as vehicle purchase receipts or Certificate of Ownership to verify that you legally own the vehicle."
            value={values.proofOfOwnership}
          />
          <FileInputField
            name="vehicleRegistration"
            id="vehicleRegistration"
            label="Vehicle Registration Document"
            placeholder="Upload Document"
            filePicker
            onFileSelect={(file) => setFieldValue("vehicleRegistration", file)}
            onBlur={handleBlur}
            info
            tooltipTitle="Vehicle Registration Document:"
            tooltipDescription="Provide a document showing that the vehicle is officially registered and recognized by the appropriate authorities."
            value={values.vehicleRegistration}
          />
          <FileInputField
            name="insuranceCertificate"
            id="insuranceCertificate"
            label="Current Insurance Certificate"
            placeholder="Upload Document"
            filePicker
            onFileSelect={(file) => setFieldValue("insuranceCertificate", file)}
            onBlur={handleBlur}
            info
            tooltipTitle="Current Insurance Certificate:"
            tooltipDescription="Submit your current insurance certificate to confirm that the vehicle is insured with valid coverage."
            value={values.insuranceCertificate}
          />
          <FileInputField
            name="vehicleInspectionReport"
            id="vehicleInspectionReport"
            label="Vehicle Inspection Report"
            placeholder="Upload Document"
            filePicker
            onFileSelect={(file) =>
              setFieldValue("vehicleInspectionReport", file)
            }
            onBlur={handleBlur}
            info
            tooltipTitle="Vehicle Inspection Report:"
            tooltipDescription="Attach a report from a certified inspection authority to verify the condition of the vehicle. Providing this helps Muvment ensure your vehicle can serve our users with confidence."
            value={values.vehicleInspectionReport}
          />
          <FileInputField
            name="maintenanceHistory"
            id="maintenanceHistory"
            label="Maintenance History (optional)"
            placeholder="Upload Document"
            filePicker
            onFileSelect={(file) => setFieldValue("maintenanceHistory", file)}
            onBlur={handleBlur}
            info
            tooltipTitle="Maintenance History:"
            tooltipDescription="Share service and maintenance records to showcase regular upkeep. This helps build trust in your vehicle’s performance for our user experiences."
            value={values.maintenanceHistory}
          />
          <FileInputField
            name="authorizationLetter"
            id="authorizationLetter"
            label="Authorization Letter"
            placeholder="Upload Document"
            filePicker
            onFileSelect={(file) => setFieldValue("authorizationLetter", file)}
            onBlur={handleBlur}
            info
            tooltipTitle="Authorization Letter:"
            tooltipDescription="If you are not the owner but have permission to use the vehicle, provide a formal authorization letter granting you permission to manage the vehicle."
            value={values.authorizationLetter}
          />

          <StepperNavigation
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            handleSaveDraft={async () => {
              const formData = new FormData();
              for (const key in values) {
                // @ts-ignore
                if (values[key]) {
                  formData.append(
                    key,
                    // @ts-ignore
                    values[key] as File
                  );
                }
              }
              await saveStep5.mutateAsync(formData);
            }}
            isSaveDraftloading={saveStep5.isPending}
            isNextLoading={isSubmitting || submitStep5.isPending}
            disableNextButton={
              !isValid || isSubmitting || submitStep5.isPending
            }
          />
        </Form>
      )}
    </Formik>
  );
};

export default DocumentInformationForm;