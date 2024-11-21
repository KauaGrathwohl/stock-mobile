import { useFetch } from "@/src/hooks/useFetch";
import Select from "../../common/Select/Select";
import { useAuth } from "@/src/hooks/useAuth";
import { Lote, LoteResponse } from "@/src/interfaces/api";
import { useEffect } from "react";

type Params = {
  onChange: (data: Lote) => any;
  placeholder?: string;
  label?: string;
};

export default function LoteSelect({
  label = "Lote",
  placeholder = "Selecione um lote",
  onChange,
}: Params) {
  const auth = useAuth();
  const [response, dataFetch] = useFetch<LoteResponse>();

  const onSearch = async (text?: string) => {
    let url = `${process.env.EXPO_PUBLIC_API_URL}/lote?empresa=${auth.empresa?.id}`;

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
      options={response.data?.lotes || []}
      onSearch={onSearch}
      onChange={onChange}
      placeholder={placeholder}
      labelKey="observacoes"
      label={label}
    />
  );
}
