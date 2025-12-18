
import { Region } from './types';

export const BASE_SALARY = 2340000;
export const DEDUCTION_SELF = 11000000;
export const DEDUCTION_DEPENDENT = 4400000;

export const EMPLOYEE_RATES = {
  SOCIAL: 0.08,
  HEALTH: 0.015,
  UNEMPLOYMENT: 0.01
};

export const EMPLOYER_RATES = {
  SOCIAL: 0.175,
  HEALTH: 0.03,
  UNEMPLOYMENT: 0.01,
  TRADE_UNION: 0.02 // Kinh phí công đoàn
};

export const REGIONAL_MIN_WAGE = {
  [Region.REGION_1]: 4960000,
  [Region.REGION_2]: 4410000,
  [Region.REGION_3]: 3860000,
  [Region.REGION_4]: 3450000
};

export const TAX_BRACKETS = [
  { level: 1, limit: 5000000, rate: 0.05 },
  { level: 2, limit: 10000000, rate: 0.10 },
  { level: 3, limit: 18000000, rate: 0.15 },
  { level: 4, limit: 32000000, rate: 0.20 },
  { level: 5, limit: 52000000, rate: 0.25 },
  { level: 6, limit: 80000000, rate: 0.30 },
  { level: 7, limit: Infinity, rate: 0.35 }
];
