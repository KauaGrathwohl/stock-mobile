import { useFetch } from "@/src/hooks/useFetch";
import Select from "../../common/Select/Select";
import { useAuth } from "@/src/hooks/useAuth";
import { Produto, ProdutoResponse } from "@/src/interfaces/api";
import { useEffect } from "react";

type Params = {
  onChange: (produto: Produto) => any;
  placeholder?: string;
  label?: string;
};

export default function ProductSelect({
  label = "Produto",
  placeholder = "Selecione um produto",
  onChange,
}: Params) {
  const auth = useAuth();
  const [productResponse, productFetch] = useFetch<ProdutoResponse>();

  const onSearch = async (text?: string) => {
    let url = `${process.env.EXPO_PUBLIC_API_URL}/produto?empresa=${auth.empresa?.id}`;

    if (text) {
      url += `&descricao=${text}`;
    }

    const headers = { "Content-Type": "application/json" };
    await productFetch(url, { headers, method: "GET" });
  };

  useEffect(() => {
    onSearch();
  }, []);

  return (
    <Select
      options={productResponse.data?.products || []}
      onSearch={onSearch}
      onChange={onChange}
      placeholder={placeholder}
      labelKey="descricao"
      label={label}
    />
  );
}
