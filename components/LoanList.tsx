import { Loan } from "@/app/types/Loan";
import getLoans from "@/app/actions/getLoans";
import getCarNameById from "@/app/actions/getCarName";


const LoanList = async () => {

    const {loans,error} = await getLoans();

    if (error || !loans) {
        return <p className='error'>{error}</p>
    }

    interface LoanWithCarName extends Loan {
        carName: string | null;
      }
      

    const loansWithCarNames: LoanWithCarName[] = await Promise.all(
        loans.map(async (loan: Loan) => {
          const carName = await getCarNameById(loan.carId);
          return { ...loan, carName };
        })
      );    


    return(
        <>
        <h3>Your Loans</h3>
        <ul className='loanlist'>
            {
                loansWithCarNames && loansWithCarNames.map((loan: LoanWithCarName) => (
                    <li key={loan.id} className="loanlist-item">
                    Loan Amount: {loan.loanAmount} against Car: {loan.carName} with Monthly Payment: {loan.monthlyPayment}
                  </li>
                  ))
                  
                  

                }


            
        </ul>
    </>
    
    );
}

export default LoanList;