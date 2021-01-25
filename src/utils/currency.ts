import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../stores/reducers";
import { getPrice } from "@limestonefi/api";
import { convert } from "exchange-rates-api";

export default function useCurrency() {
  const [multiplier, setMultiplier] = useState(1),
    currency = useSelector((state: RootState) => state.currency);

  useEffect(() => {
    if (!currency.status) setMultiplier(1);
    else adjustMultiplier();
    // eslint-disable-next-line
  }, [currency]);

  async function adjustMultiplier() {
    const arPrice = await getPrice("AR");
    if (currency.currency === "USD") return setMultiplier(arPrice.price);
    setMultiplier(await convert(arPrice.price, "USD", currency.currency));
  }

  return multiplier;
}
