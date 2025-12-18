
export enum Region {
  REGION_1 = 'Vùng 1',
  REGION_2 = 'Vùng 2',
  REGION_3 = 'Vùng 3',
  REGION_4 = 'Vùng 4'
}

export interface TaxStep {
  level: number;
  range: string;
  rate: number;
  amount: number;
}

export interface TaxResult {
  grossSalary: number;
  socialInsurance: number;
  healthInsurance: number;
  unemploymentInsurance: number;
  incomeBeforeTax: number;
  selfDeduction: number;
  dependentDeduction: number;
  taxableIncome: number;
  personalIncomeTax: number;
  netSalary: number;
  taxSteps: TaxStep[];
  // Employer part
  employerSocialIns: number;
  employerHealthIns: number;
  employerUnemploymentIns: number;
  employerTradeUnion: number;
  totalEmployerCost: number;
}

export interface CalculationInputs {
  salary: number;
  dependents: number;
  region: Region;
  isGrossToNet: boolean;
  insuranceSalary: number | 'full';
  bonus?: number;
}
