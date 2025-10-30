// app/components/tipsContent.ts
import { Lightbulb, FileText, Camera, ShieldCheck, Tag } from "lucide-react";

// Define the shape of each tip
export type TipContent = {
  icon: React.ElementType;
  title: string;
  points: {
    heading: string;
    details: string;
  }[];
};

// Define the tips for all 5 steps
// (Step 0 is a placeholder for a 1-based index)
export const allTips: TipContent[] = [
  // Placeholder for step 0 (index 0)
  { icon: Lightbulb, title: "", points: [] },

  // Step 1: Basic Details (index 1)
  {
    icon: Lightbulb,
    title: "Tips for Basic Details",
    points: [
      {
        heading: "Get your car ready",
        details:
          "Specifying your car's make, model, and year helps potential renters know exactly what they're getting.",
      },
      {
        heading: "Be Accurate and Honest!",
        details:
          "Make sure you provide accurate and honest details about your vehicle. This helps build trust with potential renters.",
      },
    ],
  },

  // Step 2: Additional Details (index 2)
  {
    icon: ShieldCheck,
    title: "Tips for Vehicle Details",
    points: [
      {
        heading: "License Plate & Registration",
        details:
          "Ensure your license plate number is correct. This is used for verification and renter safety.",
      },
      {
        heading: "Highlight Key Features",
        details:
          'Features like "Air Conditioning" and "Backup Camera" are major selling points. Be sure to select all that apply.',
      },
    ],
  },

  // Step 3: Documents (index 3)
  {
    icon: FileText,
    title: "Tips for Documents",
    points: [
      {
        heading: "Clear & Legible Uploads",
        details:
          "Make sure all documents are clear and readable. Use good lighting and avoid blurring.",
      },
      {
        heading: "Why are documents required?",
        details:
          "Vehicle Registration and Insurance are compulsory to ensure your vehicle is legally on the road and insured, protecting both you and the renter.",
      },
    ],
  },

  // Step 4: Photos (index 4)
  {
    icon: Camera,
    title: "Tips for Photos",
    points: [
      {
        heading: "First Impressions Count",
        details:
          'Your "Primary" photo is the first thing renters see. Make it a great shot of the vehicle\'s exterior.',
      },
      {
        heading: "Show Everything",
        details:
          "Upload at least 6 high-quality photos. Include the front, back, sides, interior (dashboard, seats), and the trunk.",
      },
      {
        heading: "Clean Your Car!",
        details:
          "A clean car looks more appealing and professional. Tidy up the interior and give the exterior a wash before taking photos.",
      },
    ],
  },

  // Step 5: Availability and Pricing (index 5)
  {
    icon: Tag,
    title: "Tips for Pricing",
    points: [
      {
        heading: "Competitive Pricing",
        details:
          "Check the prices of similar cars in your area. Setting a competitive price increases your booking chances.",
      },
      {
        heading: "Set Your Rules",
        details:
          "Advance notice and maximum trip duration give you control over your schedule and how your car is used.",
      },
      {
        heading: "Encourage Longer Trips",
        details:
          "Offering weekly or monthly discounts can attract renters looking for longer-term bookings, providing you with more consistent income.",
      },
    ],
  },
];
