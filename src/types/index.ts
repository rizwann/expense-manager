export enum CategoryName {
  Other = "Other",
  Grocery = "Grocery",
  Restaurant = "Restaurant",
  Clothing = "Clothing",
  Entertainment = "Entertainment",
  Butcher = "Butcher",
}

export interface House {
  _id: string;
  code: string;
  description: string;
  image: string;
  users: string[]; // Array of user ids
  userNames: string[]; // Array of user names
}

export interface IUser {
  _id: string;
  email: string;
  username: string;
  active?: boolean;
  houseCodes: string[]; // Array of house codes the user belongs to
  houseNames?: string[]; // Array of house names the user belongs to
  houses?: House[]; // Array of house objects the user belongs to
  name?: string;
  image?: string;
}

export type Store = {
  _id: string;
  name: string;
  image?: string;
};
export type Expense = {
  _id: string;
  storeName: string;
  storeImg: string;
  storeId: string;
  cost: number;
  category: string;
  description: string;
  user: string;
  userId: string;
  houseCode: string;
  houseName: string;
  involvedUsers: string[];
  date: string;
  __v: number;
}
// src/types/TransactionData.ts

export interface PaymentInstruction {
  from: string;
  to: string;
  amount: number;
}

export interface Transaction {
  from: string;
  to: string;
  amount: number;
}

export interface TransactionData {
  netChanges: Record<string, number>;
  givers: string[];
  receivers: string[];
  paymentInstructionsOptimized: PaymentInstruction[];
  balances: Record<string, number>;
  totalExpenseByUser: Record<string, number>;
  transactions: Transaction[];
}



// make a type by combinging all of the above types
export type General =  IUser | House | Store 