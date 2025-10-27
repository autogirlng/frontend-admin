// From GET /banks
export interface Bank {
  name: string;
  code: string;
}

// From GET /banks/resolve
export interface BankResolveResponse {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName: string;
}

// From POST /admin/company-bank-accounts response
export interface CompanyAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  default: boolean;
}

// For POST /admin/company-bank-accounts payload
export interface CompanyAccountPayload {
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
}
