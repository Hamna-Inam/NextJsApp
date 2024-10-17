'use server';

import { db } from '@/lib/db';

async function getCarNameById(carId: number): Promise<string | null> {
  try {
    const car = await db.car.findUnique({
      where: { id: carId },
    });

    return car?.name || 'Unknown Car';
  } catch (error) {
    console.error("Error fetching car name:", error);
    return 'Unknown Car';
  }
}

export default getCarNameById;