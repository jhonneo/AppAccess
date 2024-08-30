import axios from "axios";

const baseURL = "https://mkaccess.com.br:8088/api/v1/application";

const headers = {
  "Content-Type": "application/json",
  token: "fd7c91d13c57be8d7d8f5f2a2e4cfb28",
};

const createAPIInstance = () => {
  return axios.create({
    baseURL: baseURL,
    headers: headers,
  });
};

const api = createAPIInstance();
const apiTemporaryRelease = createAPIInstance();

export const consultaAPI = async (cpfCnpj) => {
  try {
    const response = await api.post("/autentication", { cpfCnpj });

    return response.data;

  } catch (error) {
    throw error;
  }
};

export const liberaTemporariamenteAPI = async (boleto, refreshCallback) => {
  try {
    const segundaResposta = await apiTemporaryRelease.post(
      "/temporaryRelease",
      {
        idClient: boleto.idClient,
        code: boleto.code,
      }
    );
    return segundaResposta.data;
  } catch (error) {}
};

export default api;
