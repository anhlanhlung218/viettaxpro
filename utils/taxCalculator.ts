
import { 
  BASE_SALARY, 
  DEDUCTIONS, 
  EMPLOYEE_RATES, 
  EMPLOYER_RATES,
  REGIONAL_MIN_WAGE, 
  TAX_BRACKETS 
} from '../constants';
import { TaxResult, CalculationInputs, PolicyYear } from '../types';

export const calculateGrossToNet = (inputs: CalculationInputs): TaxResult => {
  const { salary, dependents, region, insuranceSalary, policyYear } = inputs;
  
  const insSalary = insuranceSalary === 'full' ? salary : Math.min(salary, insuranceSalary);
  const insuranceCap = BASE_SALARY * 20;
  const uiCap = REGIONAL_MIN_WAGE[region] * 20;

  // Employee parts
  const socialInsurance = Math.min(insSalary, insuranceCap) * EMPLOYEE_RATES.SOCIAL;
  const healthInsurance = Math.min(insSalary, insuranceCap) * EMPLOYEE_RATES.HEALTH;
  const unemploymentInsurance = Math.min(insSalary, uiCap) * EMPLOYEE_RATES.UNEMPLOYMENT;

  // Employer parts
  const employerSocialIns = Math.min(insSalary, insuranceCap) * EMPLOYER_RATES.SOCIAL;
  const employerHealthIns = Math.min(insSalary, insuranceCap) * EMPLOYER_RATES.HEALTH;
  const employerUnemploymentIns = Math.min(insSalary, uiCap) * EMPLOYER_RATES.UNEMPLOYMENT;
  const employerTradeUnion = salary * EMPLOYER_RATES.TRADE_UNION;

  const incomeBeforeTax = salary - socialInsurance - healthInsurance - unemploymentInsurance;
  
  // Lấy mức giảm trừ theo chính sách năm đã chọn
  const policyDeductions = DEDUCTIONS[policyYear];
  const selfDeduction = policyDeductions.SELF;
  const dependentDeduction = dependents * policyDeductions.DEPENDENT;
  
  const totalDeduction = selfDeduction + dependentDeduction;
  const taxableIncome = Math.max(0, incomeBeforeTax - totalDeduction);

  let personalIncomeTax = 0;
  const taxSteps = [];

  if (taxableIncome > 0) {
    for (let i = 0; i < TAX_BRACKETS.length; i++) {
      const current = TAX_BRACKETS[i];
      const prevLimit = i === 0 ? 0 : TAX_BRACKETS[i - 1].limit;
      
      if (taxableIncome > prevLimit) {
        const taxableInThisBracket = Math.min(taxableIncome, current.limit) - prevLimit;
        const amount = taxableInThisBracket * current.rate;
        personalIncomeTax += amount;
        
        taxSteps.push({
          level: current.level,
          range: current.limit === Infinity ? `Trên ${prevLimit.toLocaleString()} đ` : `Từ ${prevLimit.toLocaleString()} đến ${current.limit.toLocaleString()} đ`,
          rate: current.rate * 100,
          amount
        });
      }
    }
  }

  const netSalary = incomeBeforeTax - personalIncomeTax;
  const totalEmployerCost = salary + employerSocialIns + employerHealthIns + employerUnemploymentIns + employerTradeUnion;

  return {
    grossSalary: salary,
    socialInsurance,
    healthInsurance,
    unemploymentInsurance,
    incomeBeforeTax,
    selfDeduction,
    dependentDeduction,
    taxableIncome,
    personalIncomeTax,
    netSalary,
    taxSteps,
    employerSocialIns,
    employerHealthIns,
    employerUnemploymentIns,
    employerTradeUnion,
    totalEmployerCost
  };
};

export const calculateNetToGross = (inputs: CalculationInputs): TaxResult => {
  let low = inputs.salary;
  let high = inputs.salary * 3; 
  let mid = 0;
  let result: TaxResult | null = null;

  for (let i = 0; i < 40; i++) {
    mid = (low + high) / 2;
    const tempInputs = { ...inputs, salary: mid };
    const tempResult = calculateGrossToNet(tempInputs);
    
    if (Math.abs(tempResult.netSalary - inputs.salary) < 1) {
      result = tempResult;
      break;
    }
    
    if (tempResult.netSalary < inputs.salary) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return result || calculateGrossToNet({ ...inputs, salary: mid });
};
