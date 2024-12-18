export interface Auth {
    menssage: string;
    token: string;
    empresa: number;
    usuario: number;
}

interface Empresa {
    id: number;
    descricao: string;
    cnpj: string;
    telefone: string;
    logradouro: string;
    cidade: number;
    ativo: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Cargo {
    id: number;
    descricao: string;
    nivel: string;
    createdAt: string;
    updatedAt: string;
}

interface User {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    createdAt: string;
    updatedAt: string;
    empresa: Empresa;
    cargo: Cargo | null;
}
export interface Entrada {
    id: number;
    quantidade: number;
    createdAt: string;
    updatedAt: string;
    lote: Lote;
    produto: Produto;
    fornecedor: Fornecedor;
}

export interface Saida {
    id: number;
    produto: string;
    quantidade: number;
    createdAt: string;
    updatedAt: string;
}

export interface ListUserResponse {
    users: User[];
}
export interface UserResponse {
    user: User
}
export interface EmpresaResponse {
    companies: Empresa[];
}

export interface CargoResponse {
    cargos: Cargo[];
}

export interface CategoriaResponse {
    categorias: Categoria[];
}

export interface ProdutoResponse {
    products: Produto[];
}

export interface EstoqueResponse {
    estoques: Estoque[];
}

export interface EntradaResponse {
    entradas: Entrada[];
}

export interface SaidaResponse {
    saidas: Saida[];
}

export interface LoteResponse {
    lotes: Lote[];
}

export interface FornecedorResponse {
    fornecedores: Fornecedor[];
}

export interface Categoria {
    id: number;
    descricao: string;
    createdAt: string;
    updatedAt: string;
}

export interface Produto {
    id: number;
    descricao: string;
    custo: number;
    preco: number;
    quantidadeMinima: number;
    quantidadeMaxima: number;
    validade: string;
    createdAt: string;
    updatedAt: string;
    categoria: Categoria;
}

export interface Estoque {
    id: number;
    descricao: string;
    createdAt: string;
    updatedAt: string;
}

export interface Fornecedor {
    id: number;
    descricao: string;
    email: string;
    telefone: string;
    cnpj: string;
    logradouro: string;
    cidade: number;
    createdAt: string;
    updatedAt: string;
}

export interface Lote {
    id: number;
    codigoBarras: string;
    quantidade: number;
    dataFabricacao: string;
    dataVencimento: string;
    observacoes: string;
    produto: Produto;
}

export interface EntradaSaida {
    id: number;
    quantidade: number;
    createdAt: string;
    updatedAt: string;
    lote: Lote;
    fornecedor: Fornecedor;
    produto: Produto;
}