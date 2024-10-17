import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export const checkUser = async () => {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    const loggedInUser = await db.user.findUnique({
        where: {
            clerkUserId : user.id
        }
    });

    if (loggedInUser) {
        return loggedInUser;
    }

    const newUser = await db.user.create({
        data: {
            clerkUserId: user.id, // Store Clerk's user ID
            name: user.fullName || 'Default' , // Get name from user if available
            email: user.emailAddresses[0].emailAddress  // Get email from user
        },
    });

    return newUser;
};