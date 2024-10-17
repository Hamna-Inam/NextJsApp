import Image from "next/image";
import Guest from "@/components/guest";
import { currentUser} from "@clerk/nextjs/server";
import AddLoan from "@/components/AddLoan";
import LoanList from "@/components/LoanList";


export default async function Home() {

  const user = await currentUser();

  if (!user){
    return <Guest/>;
  }

  return (
    <main>
    <h1>Welcome, {user.firstName}</h1>
    <AddLoan/>
    <LoanList/>
    </main>
  );
};
