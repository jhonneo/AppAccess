import axios from "axios";

const api = axios.create({
  baseURL: "https://mkaccess.com.br:8088/api/v1/application",
  headers: {
    "Content-Type": "application/json",
    token: "fd7c91d13c57be8d7d8f5f2a2e4cfb28",
  },
});

// Configuração da segunda API
const apiTemporaryRelease = axios.create({
  baseURL: "https://mkaccess.com.br:8088/api/v1/application/temporaryRelease",
  headers: {
    "Content-Type": "application/json",
    token: "fd7c91d13c57be8d7d8f5f2a2e4cfb28",
  },
});


export const consultaAPI = async (cpfCnpj) => {
  try {
    const response = await api.post("/autentication", { cpfCnpj });

    if (response.data && response.data.success) {
      const contracts = response.data.contracts;

      if (contracts && contracts.length > 0) {
        const contract = contracts[0]; 

        const userData = {
          nome: contract.nome,
          plano: contract.plano,
          vencimento: contract.vencimento,
          endereco: contract.endereco,
          numero: contract.numero,
          referencia: contract.referencia,
          bairro: contract.bairro,
          cidade: contract.cidade,
          estado: contract.estado,
          status: contract.status,
          data_cadastroF: contract.data_cadastroF,
        };

        const cpfCnpj = response.data.cpfCnpj;
        const records = response.data.records;

        return {
          userData: userData,
          ...response.data,
          cpfCnpj: cpfCnpj,
          records: records,
        };
      } else {
        console.error("Nenhum contrato encontrado na resposta da API.");
        throw new Error("Nenhum contrato encontrado na resposta da API.");
      }
    } else {
      console.error("A resposta da API não indica sucesso:", response.data);
      throw new Error("Falha na autenticação ou dados da API inválidos");
    }
  } catch (error) {
    throw error;
  }
};


export const liberaTemporariamenteAPI = async (cliente, boleto) => {
  try {
    const segundaResposta = await apiTemporaryRelease.post("/liberation", {
      idClient: cliente.id,
      code: boleto.code,
    });

    console.log("Segunda API - Liberação Temporária:", segundaResposta.data);
  } catch (error) {
    console.error('Erro ao liberar temporariamente a API:', error.response ? error.response.data : error.message);
  }
};



export default api;
