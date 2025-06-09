const BasicInformationTips = () => {
  return (
    <>
      <div className="">
        <p className="text-base md:text-xl font-semibold">Get your car ready</p>
        <ul className="list-disc text-sm md:text-sm ml-5">
          <li>
            Make and Model: Specifying your car’s make and model helps potential
            renters know exactly what they&apos;re getting.
          </li>
          <li>
            Year of Manufacture: Specify the manufacturing year of your car.
            Accurate details build trust.
          </li>
          <li>
            Vehicle type: Choose from categories like Sedan, SUV, or
            Convertible. Easy classification aids search.
          </li>
        </ul>
      </div>
      <div className="">
        <p className="text-base md:text-xl font-semibold">
          {" "}
          Be Accurate and Honest!
        </p>
        <p className="text-sm md:text-sm">
          Make sure you provide accurate and honest details about your vehicle.
          This helps build trust with potential renters and ensures a smooth
          experience for everyone.
        </p>
      </div>
    </>
  );
};

export default BasicInformationTips;
