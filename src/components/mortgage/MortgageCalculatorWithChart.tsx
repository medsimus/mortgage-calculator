import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const MortgageCalculatorWithChart = () => {
  const [loanAmount, setLoanAmount] = useState(250000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [amortizationData, setAmortizationData] = useState([]);

  useEffect(() => {
    calculateMortgage();
  }, [loanAmount, interestRate, loanTerm]);

  const calculateMortgage = () => {
    // Convert interest rate to monthly decimal
    const monthlyRate = interestRate / 100 / 12;
    
    // Convert years to months
    const totalMonths = loanTerm * 12;
    
    // Calculate monthly payment
    let monthly = 0;
    if (monthlyRate === 0) {
      // Edge case: 0% interest
      monthly = loanAmount / totalMonths;
    } else {
      const x = Math.pow(1 + monthlyRate, totalMonths);
      monthly = (loanAmount * x * monthlyRate) / (x - 1);
    }
    
    setMonthlyPayment(monthly);
    setTotalPayment(monthly * totalMonths);
    setTotalInterest((monthly * totalMonths) - loanAmount);
    
    // Calculate amortization schedule
    calculateAmortizationSchedule(loanAmount, monthlyRate, monthly, totalMonths);
  };

  const calculateAmortizationSchedule = (principal, monthlyRate, monthlyPayment, totalMonths) => {
    let balance = principal;
    let totalInterestPaid = 0;
    let totalPrincipalPaid = 0;
    
    // For chart display, we'll sample the data instead of showing all months
    const schedule = [];
    const yearlyData = [];
    
    for (let month = 1; month <= totalMonths; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      
      balance -= principalPayment;
      totalInterestPaid += interestPayment;
      totalPrincipalPaid += principalPayment;
      
      // Only store data for visualization at yearly intervals
      if (month % 12 === 0 || month === 1 || month === totalMonths) {
        schedule.push({
          month,
          year: Math.ceil(month / 12),
          payment: monthlyPayment,
          principalPayment,
          interestPayment,
          totalInterestPaid,
          totalPrincipalPaid,
          balance: Math.max(0, balance)
        });
      }
      
      // Store yearly data for the chart
      if (month % 12 === 0) {
        yearlyData.push({
          year: month / 12,
          remainingBalance: Math.max(0, balance),
          totalInterestPaid,
          totalPrincipalPaid,
        });
      }
    }
    
    setAmortizationData(yearlyData);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleLoanAmountChange = (e) => {
    const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
    setLoanAmount(isNaN(value) ? 0 : value);
  };

  const handleInterestRateChange = (value) => {
    setInterestRate(value[0]);
  };

  const handleLoanTermChange = (value) => {
    setLoanTerm(value[0]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Mortgage Calculator</CardTitle>
          <CardDescription className="text-blue-100">Calculate your monthly mortgage payments and view amortization</CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
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
            </div>
            
            <div className="flex flex-col justify-between">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-1">Monthly Payment</p>
                <p className="text-3xl font-bold text-blue-700">{formatCurrency(monthlyPayment)}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Interest</p>
                  <p className="text-xl font-bold text-purple-700">{formatCurrency(totalInterest)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-green-700">{formatCurrency(totalPayment)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <Tabs defaultValue="chart">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="chart">Amortization Chart</TabsTrigger>
                <TabsTrigger value="breakdown">Payment Breakdown</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={amortizationData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="year" 
                      label={{ value: 'Years', position: 'insideBottom', offset: -5 }} 
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${Math.round(value / 1000)}K`}
                      label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="remainingBalance" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      name="Remaining Balance"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="totalInterestPaid" 
                      stackId="2"
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      name="Interest Paid"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="breakdown" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={amortizationData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="year" 
                      label={{ value: 'Years', position: 'insideBottom', offset: -5 }} 
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${Math.round(value / 1000)}K`}
                      label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="totalPrincipalPaid" 
                      stroke="#8884d8" 
                      name="Principal Paid" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalInterestPaid" 
                      stroke="#82ca9d" 
                      name="Interest Paid" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 p-4 text-center text-sm text-gray-500 rounded-b-lg">
          This is an estimate. Actual loan terms may vary based on lender, taxes, and other factors.
        </CardFooter>
      </Card>
    </div>
  );
};

export default MortgageCalculatorWithChart;