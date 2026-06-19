"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { checkoutSchema, type CheckoutFormValues, CANADIAN_PROVINCES } from "@/lib/checkoutSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { cn } from "@/lib/utils";

const STEPS = ["Shipping", "Payment", "Review"] as const;
const SHIPPING_FIELDS = ["fullName", "email", "address", "city", "province", "postalCode"] as const;
const PAYMENT_FIELDS = ["cardName", "cardNumber", "cardExpiry", "cardCvc"] as const;

export function CheckoutClient() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({ resolver: zodResolver(checkoutSchema), mode: "onBlur" });

  const next = async () => {
    const fields = step === 0 ? SHIPPING_FIELDS : PAYMENT_FIELDS;
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = (data: CheckoutFormValues) => {
    const orderNumber = `ABC-${Math.floor(100000 + Math.random() * 900000)}`;
    sessionStorage.setItem(
      "aba-last-order",
      JSON.stringify({ orderNumber, name: data.fullName, email: data.email, items, subtotal })
    );
    clearCart();
    router.push("/checkout/confirmation");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
      <div>
        <ol className="mb-8 flex items-center gap-4">
          {STEPS.map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
                  i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                {i + 1}
              </span>
              <span className={cn("text-sm", i === step ? "font-semibold" : "text-muted-foreground")}>{label}</span>
            </li>
          ))}
        </ol>

        {step === 0 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...register("fullName")} />
              {errors.fullName && <p className="mt-1 text-sm text-destructive">{errors.fullName.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input id="address" {...register("address")} />
              {errors.address && <p className="mt-1 text-sm text-destructive">{errors.address.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city")} />
                {errors.city && <p className="mt-1 text-sm text-destructive">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" placeholder="A1A 1A1" {...register("postalCode")} />
                {errors.postalCode && <p className="mt-1 text-sm text-destructive">{errors.postalCode.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="province">Province</Label>
              <Select value={watch("province")} onValueChange={(v) => setValue("province", v, { shouldValidate: true })}>
                <SelectTrigger id="province" className="w-full">
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
            <Button type="button" onClick={next} className="w-full">
              Continue to Payment
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
              This is a demo checkout — no real payment will be processed.
            </p>
            <div>
              <Label htmlFor="cardName">Name on Card</Label>
              <Input id="cardName" {...register("cardName")} />
              {errors.cardName && <p className="mt-1 text-sm text-destructive">{errors.cardName.message}</p>}
            </div>
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="4242 4242 4242 4242" {...register("cardNumber")} />
              {errors.cardNumber && <p className="mt-1 text-sm text-destructive">{errors.cardNumber.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cardExpiry">Expiry (MM/YY)</Label>
                <Input id="cardExpiry" placeholder="08/27" {...register("cardExpiry")} />
                {errors.cardExpiry && <p className="mt-1 text-sm text-destructive">{errors.cardExpiry.message}</p>}
              </div>
              <div>
                <Label htmlFor="cardCvc">CVC</Label>
                <Input id="cardCvc" placeholder="123" {...register("cardCvc")} />
                {errors.cardCvc && <p className="mt-1 text-sm text-destructive">{errors.cardCvc.message}</p>}
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={back} className="w-full">
                Back
              </Button>
              <Button type="button" onClick={next} className="w-full">
                Review Order
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Shipping to {watch("fullName")}, {watch("address")}, {watch("city")}, {watch("province")}{" "}
              {watch("postalCode")}
            </div>
            <p className="text-sm text-muted-foreground">
              Card ending in {watch("cardNumber")?.slice(-4) || "----"}
            </p>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={back} className="w-full">
                Back
              </Button>
              <Button type="submit" className="w-full" disabled={items.length === 0}>
                Place Order
              </Button>
            </div>
          </div>
        )}
      </div>

      <div>
        <OrderSummary subtotal={subtotal} />
      </div>
    </form>
  );
}
