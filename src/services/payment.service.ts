import { OverduePayment } from "@/types/Overdue";
import {
  Payment,
  PaymentResponse,
  PaymentSubmitValues,
  Resident,
} from "@/types/Payment";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getPayments(
  token: string,
  year?: number,
  month?: number
): Promise<Payment[]> {
  const queryParams = new URLSearchParams();
  if (year) queryParams.append("year", year.toString());
  if (month) queryParams.append("month", month.toString());

  const url = `${API_URL}/payments/all${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch payments");
  }

  return response.json();
}

export async function getOverduePayments(
  token: string,
  year?: number,
  month?: number
): Promise<OverduePayment[]> {
  const queryParams = new URLSearchParams();
  if (year) queryParams.append("year", year.toString());
  if (month) queryParams.append("month", month.toString());

  const url = `${API_URL}/payments/overdue${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch overdue payments");
  }

  return response.json();
}

export async function getOverduePaymentByResidentId(
  residentId: number,
  token: string
): Promise<OverduePayment> {
  const response = await fetch(`${API_URL}/payments/overdue/${residentId}`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch overdue payment for resident ID ${residentId}`
    );
  }

  return response.json();
}

export async function getPaymentById(
  paymentId: number,
  token: string
): Promise<Payment> {
  const response = await fetch(`${API_URL}/payments/${paymentId}`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch payment with ID ${paymentId}`);
  }

  const data = await response.json();

  if (Array.isArray(data) && data.length > 0) {
    return data[0];
  }
  throw new Error(`Payment with ID ${paymentId} not found`);
}

export async function createPayment(
  data: PaymentSubmitValues,
  token: string
): Promise<PaymentResponse> {
  const response = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create payment");
  }

  return response.json();
}

export async function updatePayment(
  paymentId: number,
  data: { monthlyFee: number; paymentMethod: string },
  token: string
): Promise<Payment> {
  const response = await fetch(`${API_URL}/payments/${paymentId}`, {
    method: "PUT",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update payment with ID ${paymentId}`);
  }

  return response.json();
}

export async function uploadProof(
  paymentId: number,
  proofFile: File,
  token: string
): Promise<Payment> {
  const formData = new FormData();
  formData.append("proofFile", proofFile);

  const response = await fetch(`${API_URL}/payments/${paymentId}/proof`, {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload proof for payment ID ${paymentId}`);
  }

  return response.json();
}

export async function getResidents(token: string): Promise<Resident[]> {
  const response = await fetch(`${API_URL}/residents`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch residents");
  }

  return response.json();
}

export async function notifyOverduePayments(
  token: string,
  year?: number,
  month?: number
): Promise<string> {
  const queryParams = new URLSearchParams();
  if (year) queryParams.append("year", year.toString());
  if (month) queryParams.append("month", month.toString());

  const url = `${process.env.NEXT_PUBLIC_API_URL}/payments/notify-overdue${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to notify overdue payments: ${response.statusText}`
    );
  }

  return response.text(); // Retorna "Notificações enviadas com sucesso."
}

export async function notifyResident(
  token: string,
  residentId: number
): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/payments/notify-overdue/${residentId}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to notify resident: ${response.statusText}`);
  }

  return response.text(); // Retorna "Notificações enviadas com sucesso."
}

export async function getTotalPaid(token: string): Promise<number> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/payments/total-paid`;

  const response = await fetch(url, {
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch total paid: ${response.statusText}`);
  }

  const data = await response.json();
  return data.totalPaid;
}

export async function getTotalDebt(token: string): Promise<number> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/payments/total-debt`;

  const response = await fetch(url, {
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch total debt: ${response.statusText}`);
  }

  const data = await response.json();
  return data.totalDebt; // Retorna 35000, conforme o response
}

export async function getDebtorsSummary(
  token: string
): Promise<{ totalDebtors: number; debtorsPercentage: number }> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/payments/debtors-summary`;

  const response = await fetch(url, {
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch debtors summary: ${response.statusText}`);
  }

  return response.json();
}
