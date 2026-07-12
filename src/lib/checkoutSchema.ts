import { z } from "zod";

export const CANADIAN_PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Northwest Territories",
  "Nunavut",
  "Yukon",
];

export const FULFILLMENT_TYPES = ["pickup-in-store", "pickup-curbside", "delivery"] as const;
export type FulfillmentType = (typeof FULFILLMENT_TYPES)[number];

export const PAYMENT_METHODS = ["pay-now", "pay-in-store"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

function isAtLeast19(birthdate: string) {
  const dob = new Date(birthdate);
  if (Number.isNaN(dob.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const hadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hadBirthdayThisYear) age -= 1;
  return age >= 19;
}

export const checkoutSchema = z
  .object({
    firstName: z.string().min(1, "Please enter your first name"),
    lastName: z.string().min(1, "Please enter your last name"),
    email: z.string().email("Enter a valid email address"),
    phone: z.string().regex(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, "Enter a valid phone number"),
    birthdate: z
      .string()
      .min(1, "Please enter your date of birth")
      .refine(isAtLeast19, "You must be 19 or older to order cannabis products"),
    saveInfo: z.boolean().optional(),

    fulfillmentType: z.enum(FULFILLMENT_TYPES),

    address: z.string().optional(),
    unit: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    postalCode: z.string().optional(),
    deliveryInstructions: z.string().optional(),
    vehicleDescription: z.string().optional(),

    paymentMethod: z.enum(PAYMENT_METHODS),
    cardName: z.string().optional(),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvc: z.string().optional(),

    agreeToTerms: z.boolean().refine((v) => v === true, {
      message: "You must agree to the Terms of Service to continue",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.fulfillmentType === "delivery") {
      if (!data.address || data.address.trim().length < 5) {
        ctx.addIssue({ code: "custom", message: "Please enter your street address", path: ["address"] });
      }
      if (!data.city || data.city.trim().length < 2) {
        ctx.addIssue({ code: "custom", message: "Please enter your city", path: ["city"] });
      }
      if (!data.province || data.province.trim().length < 2) {
        ctx.addIssue({ code: "custom", message: "Please select your province", path: ["province"] });
      }
      if (!data.postalCode || !/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(data.postalCode)) {
        ctx.addIssue({ code: "custom", message: "Enter a valid postal code", path: ["postalCode"] });
      }
    }

    if (data.fulfillmentType === "pickup-curbside") {
      if (!data.vehicleDescription || data.vehicleDescription.trim().length < 3) {
        ctx.addIssue({
          code: "custom",
          message: "Let us know your vehicle make, model, and colour",
          path: ["vehicleDescription"],
        });
      }
    }

    if (data.paymentMethod === "pay-now") {
      if (!data.cardName || data.cardName.trim().length < 2) {
        ctx.addIssue({ code: "custom", message: "Please enter the name on card", path: ["cardName"] });
      }
      if (!data.cardNumber || !/^\d{4} ?\d{4} ?\d{4} ?\d{4}$/.test(data.cardNumber)) {
        ctx.addIssue({ code: "custom", message: "Enter a valid 16-digit card number", path: ["cardNumber"] });
      }
      if (!data.cardExpiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.cardExpiry)) {
        ctx.addIssue({ code: "custom", message: "Use MM/YY format", path: ["cardExpiry"] });
      }
      if (!data.cardCvc || !/^\d{3,4}$/.test(data.cardCvc)) {
        ctx.addIssue({ code: "custom", message: "Enter a valid CVC", path: ["cardCvc"] });
      }
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
