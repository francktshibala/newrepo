import React, { useState, useEffect } from 'react';

const FinancingCalculator = ({ vehiclePrice = 0 }) => {
  const [price, setPrice] = useState(vehiclePrice);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(60); // 60 months (5 years)
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  
  // Update price when vehiclePrice prop changes
  useEffect(() => {
    setPrice(vehiclePrice);
  }, [vehiclePrice]);
  
  // Calculate financing
  useEffect(() => {
    // Ensure values are valid numbers
    const validPrice = Number(price) || 0;
    const validDownPayment = Number(downPayment) || 0;
    const validInterestRate = Number(interestRate) || 0;
    const validLoanTerm = Number(loanTerm) || 1;
    
    // Calculate loan amount
    const loanAmount = validPrice - validDownPayment;
    
    if (loanAmount <= 0 || validLoanTerm <= 0) {
      setMonthlyPayment(0);
      setTotalInterest(0);
      setTotalCost(validPrice);
      return;
    }
    
    // Convert annual interest rate to monthly
    const monthlyRate = validInterestRate / 100 / 12;
    
    // Calculate monthly payment using formula:
    // P = L[i(1+i)^n]/[(1+i)^n-1]
    // Where:
    // P = Monthly payment
    // L = Loan amount
    // i = Monthly interest rate
    // n = Number of payments (loan term in months)
    
    if (monthlyRate === 0) {
      // No interest case
      setMonthlyPayment(loanAmount / validLoanTerm);
      setTotalInterest(0);
      setTotalCost(validPrice);
    } else {
      const numerator = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, validLoanTerm);
      const denominator = Math.pow(1 + monthlyRate, validLoanTerm) - 1;
      const payment = numerator / denominator;
      
      setMonthlyPayment(payment);
      
      // Calculate total interest
      const totalPayments = payment * validLoanTerm;
      setTotalInterest(totalPayments - loanAmount);
      setTotalCost(validDownPayment + totalPayments);
    }
  }, [price, downPayment, interestRate, loanTerm]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Financing Calculator</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Price ($)
          </label>
          <input
            type="number"
            id="price"
            min="0"
            step="100"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink"
          />
        </div>
        
        <div>
          <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 mb-1">
            Down Payment ($)
          </label>
          <input
            type="number"
            id="downPayment"
            min="0"
            step="100"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink"
          />
        </div>
        
        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
            Interest Rate (%)
          </label>
          <input
            type="number"
            id="interestRate"
            min="0"
            step="0.1"
            max="20"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink"
          />
        </div>
        
        <div>
          <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">
            Loan Term
          </label>
          <select
            id="loanTerm"
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-navHoverLink focus:border-navHoverLink"
          >
            <option value={24}>24 months (2 years)</option>
            <option value={36}>36 months (3 years)</option>
            <option value={48}>48 months (4 years)</option>
            <option value={60}>60 months (5 years)</option>
            <option value={72}>72 months (6 years)</option>
            <option value={84}>84 months (7 years)</option>
          </select>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Monthly Payment:</span>
            <span className="text-lg font-semibold">
              ${monthlyPayment.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Total Interest:</span>
            <span className="text-gray-900">
              ${totalInterest.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total Cost:</span>
            <span className="text-gray-900">
              ${totalCost.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancingCalculator;