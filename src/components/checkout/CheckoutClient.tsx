"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingBag, CreditCard, Wallet } from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  checkoutSchema,
  type CheckoutFormValues,
  type FulfillmentType,
  type PaymentMethod,
  CANADIAN_PROVINCES,
} from "@/lib/checkoutSchema";
import { STORE_INFO } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { CheckoutItemsSummary } from "@/components/checkout/CheckoutItemsSummary";
import { CheckoutSidebar } from "@/components/checkout/CheckoutSidebar";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-11 w-full rounded-none border-0 border-b-2 border-input bg-transparent px-0 text-base shadow-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-0 dark:bg-transparent";
const labelClass = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";
const sectionClass = "space-y-5 rounded-3xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur-sm sm:p-8";

const FULFILLMENT_OPTIONS: { value: FulfillmentType; title: string; hint: string }[] = [
  { value: "pickup-in-store", title: "Pickup (In-Store)", hint: STORE_INFO.pickupHours },
  { value: "pickup-curbside", title: "Pickup (Curbside)", hint: STORE_INFO.pickupHours },
  { value: "delivery", title: "Delivery", hint: STORE_INFO.deliveryHours },
];

export function CheckoutClient() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
    defaultValues: {
      fulfillmentType: "pickup-in-store",
      paymentMethod: "pay-now",
      saveInfo: false,
      agreeToTerms: false,
    },
  });

  const fulfillmentType = watch("fulfillmentType");
  const paymentMethod = watch("paymentMethod");

  const onSubmit = (data: CheckoutFormValues) => {
    setSubmitting(true);
    const orderNumber = `ABA-${Math.floor(100000 + Math.random() * 900000)}`;
    sessionStorage.setItem(
      "aba-last-order",
      JSON.stringify({
        orderNumber,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        fulfillmentType: data.fulfillmentType,
        paymentMethod: data.paymentMethod,
        address:
          data.fulfillmentType === "delivery"
            ? `${data.address}${data.unit ? ` #${data.unit}` : ""}, ${data.city}, ${data.province} ${data.postalCode}`
            : null,
        items,
        subtotal: subtotal - promoDiscount,
      })
    );
    clearCart();
    router.push("/checkout/confirmation");
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Add something to your cart before checking out."
        actionLabel="Start Shopping"
        actionHref="/shop"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className={sectionClass}>
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold">Account</h2>
              <p className="text-sm text-muted-foreground">
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Log in
                </Link>
                {" · "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            <GoogleSignInButton redirectTo="/checkout" />

            <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or checkout as a guest
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className={labelClass}>
                  First Name
                </Label>
                <Input id="firstName" className={fieldClass} {...register("firstName")} />
                {errors.firstName && <p className="mt-1 text-sm text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className={labelClass}>
                  Last Name
                </Label>
                <Input id="lastName" className={fieldClass} {...register("lastName")} />
                {errors.lastName && <p className="mt-1 text-sm text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className={labelClass}>
                Email
              </Label>
              <Input id="email" type="email" className={fieldClass} {...register("email")} />
              {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className={labelClass}>
                  Mobile Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(604) 555-0123"
                  className={fieldClass}
                  {...register("phone")}
                />
                {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="birthdate" className={labelClass}>
                  Date of Birth
                </Label>
                <Input id="birthdate" type="date" className={fieldClass} {...register("birthdate")} />
                {errors.birthdate && <p className="mt-1 text-sm text-destructive">{errors.birthdate.message}</p>}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox onCheckedChange={(v) => setValue("saveInfo", v === true)} />
              Save my info for faster checkout next time
            </label>
          </section>

          <section className={sectionClass}>
            <h2 className="font-heading text-lg font-semibold">Pickup or Delivery</h2>
            <RadioGroup
              value={fulfillmentType}
              onValueChange={(v) => setValue("fulfillmentType", v as FulfillmentType, { shouldValidate: true })}
            >
              {FULFILLMENT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  htmlFor={option.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition-colors",
                    fulfillmentType === option.value && "border-primary bg-primary/5"
                  )}
                >
                  <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                  <div>
                    <p className="font-medium">{option.title}</p>
                    <p className="text-sm text-muted-foreground">{option.hint}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>

            {fulfillmentType === "delivery" && (
              <div className="space-y-5 border-t border-border pt-5">
                <div className="space-y-1.5">
                  <Label htmlFor="address" className={labelClass}>
                    Street Address
                  </Label>
                  <Input id="address" className={fieldClass} {...register("address")} />
                  {errors.address && <p className="mt-1 text-sm text-destructive">{errors.address.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="unit" className={labelClass}>
                      Apt / Unit (optional)
                    </Label>
                    <Input id="unit" className={fieldClass} {...register("unit")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="city" className={labelClass}>
                      City
                    </Label>
                    <Input id="city" className={fieldClass} {...register("city")} />
                    {errors.city && <p className="mt-1 text-sm text-destructive">{errors.city.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="province" className={labelClass}>
                      Province
                    </Label>
                    <Select
                      value={watch("province")}
                      onValueChange={(v) => setValue("province", v, { shouldValidate: true })}
                    >
                      <SelectTrigger
                        id="province"
                        className="h-11 w-full rounded-none border-0 border-b-2 border-input bg-transparent px-0 shadow-none focus-visible:border-primary focus-visible:ring-0 dark:bg-transparent"
                      >
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {CANADIAN_PROVINCES.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.province && <p className="mt-1 text-sm text-destructive">{errors.province.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="postalCode" className={labelClass}>
                      Postal Code
                    </Label>
                    <Input id="postalCode" placeholder="A1A 1A1" className={fieldClass} {...register("postalCode")} />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-destructive">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="deliveryInstructions" className={labelClass}>
                    Delivery Instructions (optional)
                  </Label>
                  <Textarea
                    id="deliveryInstructions"
                    placeholder="Gate code, leave at door, etc."
                    {...register("deliveryInstructions")}
                  />
                </div>
              </div>
            )}

            {fulfillmentType === "pickup-curbside" && (
              <div className="space-y-1.5 border-t border-border pt-5">
                <Label htmlFor="vehicleDescription" className={labelClass}>
                  Vehicle Description
                </Label>
                <Input
                  id="vehicleDescription"
                  placeholder="e.g. Blue Honda Civic"
                  className={fieldClass}
                  {...register("vehicleDescription")}
                />
                {errors.vehicleDescription && (
                  <p className="mt-1 text-sm text-destructive">{errors.vehicleDescription.message}</p>
                )}
              </div>
            )}

            {fulfillmentType === "pickup-in-store" && (
              <p className="border-t border-border pt-5 text-sm text-muted-foreground">
                Pickup at {STORE_INFO.name}, {STORE_INFO.address}. Please bring valid government-issued photo ID.
              </p>
            )}
          </section>

          <section className={sectionClass}>
            <h2 className="font-heading text-lg font-semibold">Order Summary</h2>
            <CheckoutItemsSummary
              itemNotes={itemNotes}
              onNotesChange={(slug, value) => setItemNotes((prev) => ({ ...prev, [slug]: value }))}
            />
          </section>

          <section className={sectionClass}>
            <h2 className="font-heading text-lg font-semibold">Payment Method</h2>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(v) => setValue("paymentMethod", v as PaymentMethod, { shouldValidate: true })}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              <label
                htmlFor="pay-now"
                className={cn(
                  "flex cursor-pointer flex-col gap-2 rounded-xl border border-border p-4",
                  paymentMethod === "pay-now" && "border-primary bg-primary/5"
                )}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="pay-now" id="pay-now" />
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium">Pay Now</span>
                </div>
                <span className="w-fit rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">$0 Fee</span>
              </label>
              <label
                htmlFor="pay-in-store"
                className={cn(
                  "flex cursor-pointer flex-col gap-2 rounded-xl border border-border p-4",
                  paymentMethod === "pay-in-store" && "border-primary bg-primary/5"
                )}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="pay-in-store" id="pay-in-store" />
                  <Wallet className="h-4 w-4" />
                  <span className="font-medium">Pay In-Store</span>
                </div>
                <span className="w-fit rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  Cash Only
                </span>
              </label>
            </RadioGroup>

            {paymentMethod === "pay-now" ? (
              <div className="space-y-5 border-t border-border pt-5">
                <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                  You may be asked to show ID and this card at {fulfillmentType === "delivery" ? "delivery" : "pickup"}.
                </p>
                <div className="space-y-1.5">
                  <Label htmlFor="cardName" className={labelClass}>
                    Name on Card
                  </Label>
                  <Input id="cardName" className={fieldClass} {...register("cardName")} />
                  {errors.cardName && <p className="mt-1 text-sm text-destructive">{errors.cardName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cardNumber" className={labelClass}>
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    className={fieldClass}
                    {...register("cardNumber")}
                  />
                  {errors.cardNumber && <p className="mt-1 text-sm text-destructive">{errors.cardNumber.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="cardExpiry" className={labelClass}>
                      Expiry (MM/YY)
                    </Label>
                    <Input id="cardExpiry" placeholder="08/27" className={fieldClass} {...register("cardExpiry")} />
                    {errors.cardExpiry && (
                      <p className="mt-1 text-sm text-destructive">{errors.cardExpiry.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cardCvc" className={labelClass}>
                      CVC
                    </Label>
                    <Input id="cardCvc" placeholder="123" className={fieldClass} {...register("cardCvc")} />
                    {errors.cardCvc && <p className="mt-1 text-sm text-destructive">{errors.cardCvc.message}</p>}
                  </div>
                </div>
              </div>
            ) : (
              <p className="border-t border-border pt-5 text-sm text-muted-foreground">
                Pay by cash at {fulfillmentType === "delivery" ? "delivery" : "pickup"}. Exact change is appreciated.
              </p>
            )}
          </section>

          <section className={sectionClass}>
            <label className="flex items-start gap-2 text-sm">
              <Checkbox
                className="mt-0.5"
                onCheckedChange={(v) => setValue("agreeToTerms", v === true, { shouldValidate: true })}
              />
              <span>
                I confirm I am 19 years of age or older and agree to the{" "}
                <Link href="/terms" className="font-medium text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="font-medium text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.agreeToTerms && <p className="text-sm text-destructive">{errors.agreeToTerms.message}</p>}
          </section>
        </div>

        <div className="lg:sticky lg:top-24">
          <CheckoutSidebar
            subtotal={subtotal}
            itemCount={items.reduce((sum, i) => sum + i.quantity, 0)}
            fulfillmentType={fulfillmentType}
            submitting={submitting}
            onPromoApplied={setPromoDiscount}
          />
        </div>
      </div>
    </form>
  );
}
