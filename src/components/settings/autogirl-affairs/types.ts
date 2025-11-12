// app/dashboard/autogirl/types.ts

// --- Department Types ---
export interface Department {
  id: string;
  name: string;
  parentDepartmentId?: string;
}

export interface DepartmentPayload {
  name: string;
  parentDepartmentId?: string;
}
