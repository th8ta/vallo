declare module "@limestonefi/api" {
  interface PriceData {
    price: number;
    updated: Date;
  }
  export function getPrice(token: string): Promise<PriceData>;
}
