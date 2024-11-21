import { useFetch } from "@/src/hooks/useFetch";
import Select from "../../common/Select/Select";
import { useAuth } from "@/src/hooks/useAuth";
import { Fornecedor, FornecedorResponse } from "@/src/interfaces/api";
import { useEffect } from "react";

type Params = {
  onChange: (data: Fornecedor) => any;
  placeholder?: string;
  label?: string;
};

export default function SupplierSelect({
  label = "Fornecedor",
  placeholder = "Selecione um fornecedor",
  onChange,
}: Params) {
  const auth = useAuth();
  const [response, dataFetch] = useFetch<FornecedorResponse>();

  const onSearch = async (text?: string) => {
    let url = `${process.env.EXPO_PUBLIC_API_URL}/fornecedor?empresa=${auth.empresa?.id}`;

    if (text) {
      url += `&descricao=${text}`;
    }

    const headers = { "Content-Type": "application/json" };
    await dataFetch(url, { headers, method: "GET" });
  };

  useEffect(() => {
    onSearch();
  }, []);

  return (
    <Select
      options={response.data?.fornecedores || []}
      onSearch={onSearch}
      onChange={onChange}
      placeholder={placeholder}
      labelKey="descricao"
      label={label}
    />
  );
}
