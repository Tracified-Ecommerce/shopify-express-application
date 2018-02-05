import { Request } from "express";

export interface IRequest extends Request {
  session: ISession;
  body: IBody;
  params: IParams;
}

interface ISession {
  shop: IShop;
}

interface IShop {
  name: string;
  tracified_token: string;
}

interface IBody {
  tempToken: string;
}

interface IParams {
  orderID: string;
  itemID: string;
}
