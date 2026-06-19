import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email address"),
  address: z.string().min(5, "Please enter your street address"),
  city: z.string().min(2, "Please enter your city"),
  province: z.string().min(2, "Please select your province"),
  postalCode: z
    .string()
    .regex(/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/, "Enter a valid postal code"),
  cardName: z.string().min(2, "Please enter the name on card"),
  cardNumber: z
    .string()
    .regex(/^\d{4} ?\d{4} ?\d{4} ?\d{4}$/, "Enter a valid 16-digit card number"),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format"),
  cardCvc: z.string().regex(/^\d{3,4}$/, "Enter a valid CVC"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

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
