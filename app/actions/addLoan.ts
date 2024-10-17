'use server';

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface LoanData{
    carId: number,
    loanAmount: number,
    interestRate: number,
    fixed: boolean
}

interface LoanResult {
    data?: LoanData;
    error?: string;
}

function calculateLoan(loanAmount: number, interestRate: number, loanTerm: number, fixed: boolean, yearlyIncreaseRate:number): number {
    const numberOfPayments = loanTerm * 12;

    if (fixed) {
        const monthlyRate = interestRate / 100 / 12;
        return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
               (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
        const increase = yearlyIncreaseRate ;
        const adjustedAnnualRate = interestRate + increase;
        const adjustedMonthlyRate = adjustedAnnualRate / 100 / 12;
        
        return (loanAmount * adjustedMonthlyRate * Math.pow(1 + adjustedMonthlyRate, numberOfPayments)) /
               (Math.pow(1 + adjustedMonthlyRate, numberOfPayments) - 1);
    }
  }


async function addLoan(formData: FormData): Promise<LoanResult> {
    const carIdVal = formData.get('carId');
    const loanAmountVal = formData.get('loanAmount');
    const interestRateVal = formData.get('interestRate');
    const fixedVal = formData.get('fixed');
    const loanTermVal = formData.get('loanTerm'); 
    const yearlyIncVal = formData.get('yearlyIncreaseRate') 


    if (!carIdVal|| !loanAmountVal || !interestRateVal ||!loanTermVal ){
        return {error: 'One or more input fields is missing'};
    }

    if (!fixedVal && !yearlyIncVal) {
        return {error: 'Yearly increase rate is missing'};
    }


    const carId = parseInt(carIdVal.toString());
    if (isNaN(carId) || carId <= 0) {
        return { error: 'Car ID must be a positive number' };
    }

    const loanAmount = parseFloat(loanAmountVal.toString());
    if (isNaN(loanAmount) || loanAmount <= 0) {
        return { error: 'Loan amount must be a positive number' };
    }

    const interestRate = parseFloat(interestRateVal.toString());
    if (isNaN(interestRate) || interestRate < 0) {
        return { error: 'Interest rate must be a non-negative number' };
    }

    const loanTerm = parseInt(loanTermVal.toString());
    if (isNaN(loanTerm) || loanTerm < 0) {
        return { error: 'Interest rate must be a non-negative number' };
    }

    
    const fixed = fixedVal === 'on'; // Determines if the checkbox was checked

    let yearlyIncreaseRate = 1;
    if(!fixed && yearlyIncVal){
        yearlyIncreaseRate = parseInt(yearlyIncVal.toString());
        if (isNaN(yearlyIncreaseRate) || yearlyIncreaseRate < 0) {
            return { error: ' Yearly increase rate must be a non-negative number' };
        }
        }



    //get logged in user 

    const { userId } = auth();
     
    if(!userId) {
        return { error: 'User not found'};
    }

    const carExists = await db.car.findUnique({ where: { id: carId } });

    if (!carExists) {
        return { error: 'Car does not exist'};
    }

    const monthlyPayment = calculateLoan(loanAmount, interestRate, loanTerm, fixed, yearlyIncreaseRate);


    const loanData: LoanData = await db.loan.create({
        data:{
            user: {
                connect: { clerkUserId: userId } // Connect the loan to the existing user by their ID
            },
            car: {
                connect: { id: carId }  // Connect the loan to the existing car by its ID
            },
            loanAmount,
            interestRate,
            fixed,
            loanTerm,
            monthlyPayment
        },
    });

    revalidatePath('/');

    return { data: loanData };

}

export default addLoan;