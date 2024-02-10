
export interface IProduct {
  category?: string;
  description?: string;
  id: string;
  image: string;
  price: number | null;
  title: string;
}  

export interface IAppState {
  catalog: IProduct[];
  basket: string[];
  preview: string | null;
  order: IOrder | null;
}

export interface IOrderForm {
  payment: string;
  address: string;
}

export interface IContactsForm {
  email: string;
  phone: string;
}

export interface IOrder extends IOrderForm, IContactsForm {
  items: string[];
  total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
  id: string;
}