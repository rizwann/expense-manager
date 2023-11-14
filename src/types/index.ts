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
}

export interface IUser {
  _id: string;
  email: string;
  username: string;
  active?: boolean;
  houseCodes: string[]; // Array of house codes the user belongs to
}
