import { StockStatusEnum } from '../enums/stock-status.enum';

export class Product {
  readonly id: number;
  readonly name: string;
  readonly category: string;
  readonly price: number;
  readonly stock_status: StockStatusEnum;
}
