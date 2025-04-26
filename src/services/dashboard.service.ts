export interface ResidentPaymentStatus {
  name: string;
  paymentStatusByMonth: {
    Janeiro: string;
    Fevereiro: string;
    Março: string;
    Abril: string;
    Maio: string;
    Junho: string;
    Julho: string;
    Agosto: string;
    Setembro: string;
    Outubro: string;
    Novembro: string;
    Dezembro: string;
  };
}

export async function getResidentsPaymentStatus(
  token: string,
  year?: number
): Promise<ResidentPaymentStatus[]> {
  const queryParams = new URLSearchParams();
  if (year) queryParams.append("year", year.toString());

  const url = `${
    process.env.NEXT_PUBLIC_API_URL
  }/dashboard/residents-payment-status${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch residents payment status: ${response.statusText}`
    );
  }

  return response.json();
}
