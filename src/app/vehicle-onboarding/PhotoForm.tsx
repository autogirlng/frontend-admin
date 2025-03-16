"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import PhotoUploadField from "../components/core/form-field/PhotoFormField";
import { ImageAssets } from "../utils/ImageAssets";

const vehicleSides = [
  {
    name: "frontView",
    label: "Front View",
    icon: ImageAssets.vehicleFrontView,
  },
  { name: "backView", label: "Back View", icon: ImageAssets.vehicleBackView },
  {
    name: "sideView1",
    label: "Side View 1",
    icon: ImageAssets.vehicleSideView1,
  },
  {
    name: "sideView2",
    label: "Side View 2",
    icon: ImageAssets.vehicleSideView2,
  },
  {
    name: "interior",
    label: "Interior",
    icon: ImageAssets.vehicleInteriorView,
  },
  { name: "other", label: "Other", icon: ImageAssets.vehicleOtherView },
];

const initialValues = vehicleSides.reduce((acc, side) => {
  acc[side.name] = null;
  return acc;
}, {} as Record<string, string | null>);

const validationSchema = Yup.object().shape({
  frontView: Yup.mixed().required("Front view image is required"),
});

const PhotoForm: React.FC<{
  onFormValidationChange?: (isValid: boolean) => void;
}> = ({ onFormValidationChange }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnMount
      onSubmit={(values) => console.log("Form Data:", values)}
    >
      {({ isValid, dirty }) => {
        onFormValidationChange?.(isValid && dirty);

        return (
          <Form className="grid grid-cols-1 md:grid-cols-2  gap-4">
            {vehicleSides.map(({ name, label, icon }) => (
              <PhotoUploadField
                key={name}
                name={name}
                label={label}
                icon={icon}
              />
            ))}
          </Form>
        );
      }}
    </Formik>
  );
};

export default PhotoForm;
