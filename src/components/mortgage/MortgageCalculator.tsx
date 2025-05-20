"use client"
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const MortgageCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(250000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    calculateMortgage();
  }, [loanAmount, interestRate, loanTerm]);

  const calculateMortgage = () => {
    // Convert interest rate to monthly decimal
    const monthlyRate = interestRate / 100 / 12;
    
    // Convert years to months
    const totalMonths = loanTerm * 12;
    
    // Calculate monthly payment using the formula: M = P[r(1+r)^n]/[(1+r)^n-1]
    if (monthlyRate === 0) {
      // Edge case: 0% interest
      const monthly = loanAmount / totalMonths;
      setMonthlyPayment(monthly);
      setTotalPayment(monthly * totalMonths);
      setTotalInterest(0);
    } else {
      const x = Math.pow(1 + monthlyRate, totalMonths);
      const monthly = (loanAmount * x * monthlyRate) / (x - 1);
      
      setMonthlyPayment(monthly);
      setTotalPayment(monthly * totalMonths);
      setTotalInterest((monthly * totalMonths) - loanAmount);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
    setLoanAmount(isNaN(value) ? 0 : value);
  };
  
  const handleInterestRateChange = (value: number[]): void => {
    setInterestRate(value[0]);
  };
  
  const handleLoanTermChange = (value: number[]): void => {
    setLoanTerm(value[0]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Mortgage Calculator</CardTitle>
          <CardDescription className="text-blue-100">Calculate your monthly mortgage payments</CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Loan Amount</label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">$</span>
              <Input 
                type="text" 
                value={loanAmount.toLocaleString()}
                onChange={handleLoanAmountChange}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Interest Rate</label>
              <span className="text-lg font-semibold">{interestRate.toFixed(2)}%</span>
            </div>
            <Slider
              defaultValue={[interestRate]}
              min={0}
              max={10}
              step={0.05}
              onValueChange={handleInterestRateChange}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>5%</span>
              <span>10%</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Loan Term (Years)</label>
              <span className="text-lg font-semibold">{loanTerm} years</span>
            </div>
            <Slider
              defaultValue={[loanTerm]}
              min={5}
              max={30}
              step={5}
              onValueChange={handleLoanTermChange}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5 yrs</span>
              <span>15 yrs</span>
              <span>30 yrs</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Monthly Payment</p>
                <p className="text-xl font-bold text-blue-700">{formatCurrency(monthlyPayment)}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Interest</p>
                <p className="text-xl font-bold text-purple-700">{formatCurrency(totalInterest)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Payment</p>
                <p className="text-xl font-bold text-green-700">{formatCurrency(totalPayment)}</p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 p-4 text-center text-sm text-gray-500 rounded-b-lg">
          This is an estimate. Actual loan terms may vary.
        </CardFooter>
      </Card>
    </div>
  );
};

export default MortgageCalculator;