export interface OverdueMonth {
  year: number;
  month: string;
  monthlyFee: number;
}

export interface OverduePayment {
  residentId: number;
  residentName: string;
  residentEmail: string;
  residentPhone: string;
  residentBi: string;
  overdueMonths: OverdueMonth[];
  totalDebt: number;
  status: string;
  overdueMonthsByYear: {
    [year: string]: number;
  };
}
