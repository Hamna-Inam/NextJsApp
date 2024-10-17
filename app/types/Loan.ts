export interface Loan {
    id: number;
    userId: string;
    carId: number;
    loanAmount: number;        
    interestRate: number;      
    fixed: boolean;            
    loanTerm: number;      
    createdAt: Date;           
    monthlyPayment: number;    
  }
  