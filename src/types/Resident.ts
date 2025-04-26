export interface Resident {
  id: number;
  name: string;
  otherName?: string;
  houseNumber: string;
  contact: string;
  email: string;
  bi: string;
  password: string;
  active: boolean;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}
