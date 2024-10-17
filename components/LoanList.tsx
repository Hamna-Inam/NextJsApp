import { Loan } from "@/app/types/Loan";
import getLoans from "@/app/actions/getLoans";


const LoanList = async () => {

    const {loans,error} = await getLoans();

    if (error) {
        return <p className='error'>{error}</p>
    }

    return(
        <>
        <h3>Your Loans</h3>
        <ul className='loanlist'>
            {
                loans && loans.map((loan: Loan) => (
                    <li key={loan.id} className="loanlist-item">
                        {loan.loanAmount}
                    </li>
                    
                ))            
                }
            
        </ul>
    </>
    
    );
}

export default LoanList;