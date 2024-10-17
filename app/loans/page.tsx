// app/loans/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function LoanPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [carId, setCarId] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [fixed, setFixed] = useState(false);

  // Redirect unauthenticated users to the sign-in page
  if (!isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/loans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carId,
          loanAmount: parseFloat(loanAmount),
          interestRate: parseFloat(interestRate),
          fixed,
        }),
      });

      if (response.ok) {
        alert("Loan saved successfully!");
      } else {
        alert("Failed to save the loan.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Generate a Car Loan</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="carId">Car ID:</label>
          <input
            id="carId"
            type="text"
            value={carId}
            onChange={(e) => setCarId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="loanAmount">Loan Amount:</label>
          <input
            id="loanAmount"
            type="text"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="interestRate">Interest Rate:</label>
          <input
            id="interestRate"
            type="text"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="fixed">Fixed Interest:</label>
          <input
            id="fixed"
            type="checkbox"
            checked={fixed}
            onChange={(e) => setFixed(e.target.checked)}
          />
        </div>
        <button type="submit">Generate Loan</button>
      </form>
    </div>
  );
}
