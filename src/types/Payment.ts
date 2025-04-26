export interface PaidMonth {
  year: number;
  month: string;
}

export interface Payment {
  id: number;
  residentId: number;
  bi: string;
  residentName: string;
  paidMonths: PaidMonth[];
  monthlyFee: number;
  totalAmount: number;
  statusPayment: string;
  paymentMethod: string;
  paymentDate: string;
  hasProof?: boolean;
}

export interface PaidMonth {
  year: number;
  month: string;
}

export interface PaymentSubmitValues {
  residentId: number;
  paidMonths: {
    year: number;
    month: string;
  }[];
  monthlyFee: number;
  paymentMethod: string;
}

export interface PaymentResponse {
  id: number;
  residentName: string;
  bi: string;
  paidMonths: PaidMonth[];
  monthlyFee: number;
  totalAmount: number;
  statusPayment: string;
  paymentMethod: string;
  paymentDate: string;
}

export interface Resident {
  id: number;
  name: string;
}
