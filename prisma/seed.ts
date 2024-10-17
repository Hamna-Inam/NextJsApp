//prsima executes after migrations, resets and updates in the database

// this has the default settings/data

//read from csv, make an array of cars and read that array into the database

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';

const prisma = new PrismaClient();

async function main() {
    const cars: Array<{name: string, year: number, price: number}> = [];
    let count = 0;

    fs. createReadStream('./public/cars.csv').pipe(csv()).on('data',(row) => {
        if (count < 10) {
        cars.push({
            name: row.name,
            year: parseInt(row.year, 10), // Convert year to number
            price: parseInt(row.selling_price.replace(/[^\d]/g, ''), 10), // Convert price to number after cleaning
        });
        count++; }
    })

    .on ('end',async()=> {
        for (const car of cars) {
            await prisma.car.create ({
                    data: {
                        name: car.name,
                        year: car.year,
                        price: car.price
                    },
                });
            }

            console.log('Seeded 10 cars into database')
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
