'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Loan } from '../types/Loan';

async function getLoans(): Promise<{
    loans?: Loan[];
    error?: string;
}> {
    const {userId} = auth();
    if(!userId) {
        return { error: 'User not found'};
    }

    try {
        const loans = await db.loan.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return {loans};
    }
   
    catch(error){
        return { error: 'Database error'};

    }


}

export default getLoans;
