/*
  Warnings:

  - Added the required column `loanTerm` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "loanTerm" INTEGER NOT NULL;
