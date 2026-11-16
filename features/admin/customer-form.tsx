"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { isCustomerPlan, plans, statuses, type Customer } from "./customers";

export function CustomerForm({
  customer,
  onSave,
}: {
  customer?: Customer;
  onSave: (customer: Customer) => void;
}) {
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const company = String(data.get("company")).trim();
    const email = String(data.get("email")).trim();
    const plan = String(data.get("plan"));
    const status = statuses.find((value) => value === data.get("status"));
    const seats = Number(data.get("seats"));
    if (
      !company ||
      !email ||
      !isCustomerPlan(plan) ||
      !status ||
      !Number.isInteger(seats) ||
      seats < 1 ||
      seats > 10000
    ) {
      setError(
        "Enter a customer name, email, plan, status, and a seat count between 1 and 10,000.",
      );
      return;
    }
    onSave({
      id: customer?.id ?? crypto.randomUUID(),
      company,
      email,
      plan,
      status,
      seats,
      since: customer?.since ?? new Date().toISOString().slice(0, 10),
      notes: String(data.get("notes")).trim(),
    });
  }
  return (
    <form className="grid gap-4 px-4 pb-6" onSubmit={submit}>
      <label className="grid gap-2 text-sm font-medium">
        Customer name
        <Input
          name="company"
          required
          maxLength={80}
          defaultValue={customer?.company}
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Billing email
        <Input
          type="email"
          name="email"
          required
          maxLength={120}
          defaultValue={customer?.email}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2 text-sm font-medium">
          <label htmlFor="owner-plan">Plan</label>
          <Select name="plan" defaultValue={customer?.plan ?? "Starter"}>
            <SelectTrigger id="owner-plan" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(plans).map((plan) => (
                <SelectItem key={plan} value={plan}>
                  {plan}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2 text-sm font-medium">
          <label htmlFor="owner-status">Status</label>
          <Select name="status" defaultValue={customer?.status ?? "Trial"}>
            <SelectTrigger id="owner-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <label className="grid gap-2 text-sm font-medium">
        Seats
        <Input
          type="number"
          name="seats"
          min={1}
          max={10000}
          required
          defaultValue={customer?.seats ?? 1}
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Internal notes
        <Textarea
          name="notes"
          rows={4}
          maxLength={400}
          defaultValue={customer?.notes}
        />
      </label>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button className="justify-self-start" type="submit">
        Save customer
      </Button>
    </form>
  );
}
