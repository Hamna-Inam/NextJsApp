"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import addLoan from "@/app/actions/addLoan";
import {toast} from 'react-toastify';

 const AddLoan = () => {

   const clientAction = async (formData: FormData) => {
    const {data,error} = await addLoan(formData);

    if (error){
       toast.error(error); 
    }
    else {
        toast.success('Loan Generated');
        console.log(data);
    }
    
   }

    return (
        <>
          <h1>Generate a Car Loan</h1>
          <form action={clientAction}>
            <div className="mb-4">
              <label htmlFor="carId">Car ID:</label>
              <input
                id="carId"
                type="number"
                name="carId"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="loanAmount">Loan Amount:</label>
              <input
                id="loanAmount"
                type="number"
                name="loanAmount"
                step='0.01' //to allow decimals
              />
            </div>
            <div className ="mb-4">
              <label htmlFor="interestRate">Yearly Interest Rate(like 50, 30):</label>
              <input
                id="interestRate"
                type="text"
                name="interestRate"
              />
            </div>
            <div>
            <label htmlFor="loanTerm">Loan Term (in years): 1,2,3,..</label>
            <input
              id="loanTerm"
              type="number"
              name="loanTerm"
            />
          </div>
            <div className="mb-4">
              <label htmlFor="fixed">Fixed Interest:</label>
              <input
                id="fixed"
                type="checkbox"
                name="fixed"
              />
            </div>
          <div className="mb-4">
            <label htmlFor="yearlyIncreaseRate">
              Yearly Interest Rate Increase (%) ONLY FOR DYNAMIC INTEREST RATE:
            </label>
            <input
              id="yearlyIncreaseRate"
              type="number"
              name="yearlyIncreaseRate"
              defaultValue="1"
              min="0"
              max="100"
            />
          </div>
            <button type="submit">Generate Loan</button>
          </form>
        </>
      );
}
export default AddLoan;