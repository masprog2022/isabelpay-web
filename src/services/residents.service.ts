import { Resident } from "@/types/Resident";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export async function createResident(
  data: Omit<Resident, "id" | "createdAt" | "updatedAt">,
  token: string
): Promise<Resident> {
  const response = await fetch(`${API_URL}/residents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.error || "Falha ao criar morador";
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function getResidentsSummary(
  token: string,
  year?: number
): Promise<{ totalRegisteredActive: number; registeredPercentage: number }> {
  const queryParams = new URLSearchParams();
  if (year) queryParams.append("year", year.toString());

  const url = `${process.env.NEXT_PUBLIC_API_URL}/residents/summary${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await fetch(url, {
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch residents summary: ${response.statusText}`
    );
  }

  return response.json();
}

export async function updateResident(
  token: string,
  residentId: number,
  data: {
    name: string;
    contact: string;
    bi: string;
    email: string;
    active: boolean;
    roles: string[];
  }
): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/residents/${residentId}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update resident: ${response.statusText}`);
  }
}

export async function deleteResident(
  token: string,
  residentId: number
): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/residents/${residentId}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to delete resident: ${response.statusText} - ${errorText}`
    );
  }
}

export async function inactivateResident(
  token: string,
  data: {
    id: number;
    active: boolean;
    reasonForInactivation: string;
  }
): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/residents/inactivate`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to inactivate resident: ${response.statusText} - ${errorText}`
    );
  }
}
