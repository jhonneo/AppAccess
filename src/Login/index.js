import { StatusBar } from "expo-status-bar";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useState, useEffect } from "react";
import logo from "../Images/logo.png";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { consultaAPI } from "../Api/Api";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as Animatable from "react-native-animatable";

const StyledInput = styled.TextInput`
  width: 100%;
  height: 40px;
  border-bottom-width: 2px;
  border-bottom-color: #111;
  margin-bottom: 15px;
  font-size: 25px;
  padding: 5px;
  text-align: center;
`;

const StyledButton = styled.TouchableOpacity`
  background-color: #354799;
  width: 100%;
  height: 50px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 20px;
`;

const ErrorText = styled.Text`
  color: red;
  margin-top: 10px;
`;

const TermsLink = styled.Text`
  color: black;
  text-decoration-line: underline;
  margin-left: 65px;
  margin-bottom: 10px;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerLogo: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 4,
    resizeMode: "contain",
  },
  containerForm: {
    flex: 2,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingStart: "5%",
    paddingEnd: "5%",
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginBottom: 40,
    textAlign: "center",
    marginTop: 15,
  },
  infoText: {
    fontSize: 16,
    color: "black",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 10,
  },
});

function isValidCPF(cpf) {
  if (typeof cpf !== "string") return false;
  cpf = cpf.replace(/[\s.-]*/g, "");
  if (cpf.length !== 11) return false;

  if (
    cpf === "00000000000" ||
    cpf === "11111111111" ||
    cpf === "22222222222" ||
    cpf === "33333333333" ||
    cpf === "44444444444" ||
    cpf === "55555555555" ||
    cpf === "66666666666" ||
    cpf === "77777777777" ||
    cpf === "88888888888" ||
    cpf === "99999999999"
  ) {
    return false;
  }

  return true;
}

function isValidCNPJ(cnpj) {
  if (typeof cnpj !== "string") return false;
  cnpj = cnpj.replace(/[\s.-]*/g, "");
  if (cnpj.length !== 14) return false;

  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  const digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  if (result !== parseInt(digits.charAt(0), 10)) return false;

  length += 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  if (result !== parseInt(digits.charAt(1), 10)) return false;

  return true;
}

export default function Login() {
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const loadCpfCnpj = async () => {
      try {
        const storedCpfCnpj = await AsyncStorage.getItem("cpfCnpj");
        if (storedCpfCnpj) {
          setCpfCnpj(storedCpfCnpj);
        }
      } catch (error) { }
    };

    loadCpfCnpj();
  }, []);

  const handleLogin = async () => {

    if (!cpfCnpj) {
      setError("Por favor, insira o CPF ou CNPJ!");
      return;
    }

    const cleanedCpfCnpj = cpfCnpj.replace(/\D/g, "");

    const handleApiResponse = async (data) => {

      if (data && data.records > 0) {

        if (data.contracts.length === 1 && data.contracts[0].status === 'DESATIVADO') {
          navigation.navigate("Desativado");
          return;
        }

        navigation.navigate("SelecionarContrato", { userData: data });
        await AsyncStorage.setItem("cpfCnpj", cleanedCpfCnpj);

      } else {
        setError("Nenhum cadastro encontrado para este CPF/CNPJ!");
      }

    };

    const handleApiCall = async () => {
      try {
        const data = await consultaAPI(cleanedCpfCnpj);
        await handleApiResponse(data);
      } catch (apiError) {
        console.log(apiError);
        setError("Erro interno, tente mais tarde!");
      }
    };

    if (cleanedCpfCnpj.length === 11 && isValidCPF(cleanedCpfCnpj)) {
      await handleApiCall();
    } else if (cleanedCpfCnpj.length === 14) {
      await handleApiCall();
    } else {
      setError("CPF/CNPJ inválido!");
    }
  };

  /*  {"contracts": 
   [
     {"bairro": "Torquato Neto III", "booklet": [Array], "cidade": "Teresina", "data_cadastro": "2019-10-15T22:19:12.000Z", "data_cadastroF": "15/10/2019", "endereco": "Quadra Q Casa ", "estado": "PI", "id": 386, "nome": "Janderson Vieira e Silva", "numero": "29", "plano": "520 MEGAS", "referencia": "", "status": "DESATIVADO", "vencimento": "05"}, 
     {"bairro": "Torquato Neto III", "booklet": [Array], "cidade": "Teresina", "data_cadastro": "2023-07-03T18:22:24.415Z", "data_cadastroF": "03/07/2023", "endereco": "Quadra Q Casa ", "estado": "PI", "id": 2884, "nome": "Janderson Vieira e Silva", "numero": "29", "plano": "520 MEGAS", "referencia": null, "status": "ATIVO", "vencimento": "05"}
   ], 
   "cpfCnpj": "05072623360", "message": "Usuário encontrado!", "records": 2, "success": true, "userData": {"bairro": "Torquato Neto III", "cidade": "Teresina", "data_cadastroF": "15/10/2019", "endereco": "Quadra Q Casa ", "estado": "PI", "nome": "Janderson Vieira e Silva", "numero": "29", "plano": "520 MEGAS", "referencia": "", "status": "DESATIVADO", "vencimento": "05"}}
    */

  /* const handleLogin = async () => {

    if (cpfCnpj) {

      const cleanedCpfCnpj = cpfCnpj.replace(/\D/g, "");

      try {
        if (cleanedCpfCnpj.length === 11 && isValidCPF(cleanedCpfCnpj)) {
          const data = await consultaAPI(cleanedCpfCnpj);

          if (data && data.cpfCnpj && data.contracts && data.contracts.length > 0) {
            const firstContract = data.contracts[0];
            if (firstContract.status === "DESATIVADO") {
              navigation.navigate("Desativado");
              return;
            }
          }

          if (data && data.cpfCnpj) {
            if (data.records) {
              navigation.navigate("SelecionarContrato", { userData: data });
            } else {
              if (data.contracts && data.contracts.length === 0) {
                AsyncStorage.setItem("cpfCnpj", cleanedCpfCnpj)
                  .then(() => {
                    navigation.navigate("SelecionarContrato", {
                      cpfCnpj: cleanedCpfCnpj,
                    });
                  })
                  .catch((storageError) => { });
              } else {
                navigation.navigate("SemBoleto");
              }
            }
          } else {
            setError(data.message || "Erro nos nossos servidores");
          }

        } else if (cleanedCpfCnpj.length === 14 && isValidCNPJ(cleanedCpfCnpj)) {
          const data = await consultaAPI(cleanedCpfCnpj);
          if (data && data.cpfCnpj) {
            if (data.records) {
              navigation.navigate("SelecionarContrato", { userData: data });
            } else {
              if (data.contracts && data.contracts.length === 0) {
                AsyncStorage.setItem("cpfCnpj", cleanedCpfCnpj)
                  .then(() => {
                    navigation.navigate("SelecionarContrato", {
                      cpfCnpj: cleanedCpfCnpj,
                    });
                  })
                  .catch((storageError) => { });
              } else {
                navigation.navigate("SemBoleto");
              }
            }
          } else {
            setError(data.message || "Erro nos nossos servidores");
          }
        } else {
          setError("CPF/CNPJ inválido");
        }
      } catch (apiError) {
        navigation.navigate("SemBoleto");
        setError("Erro nos nossos servidores");
      }
    } else {
      setError("Por Favor, tente novamente");
    }
  }; */

  const handleTermsPress = () => {
    Linking.openURL(
      "https://accesssollutions.com.br/app/politica-privacidade.html"
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Animatable.View
        animation="fadeInDown"
        duration={2000}
        style={styles.containerLogo}
      >
        <Image source={logo} style={styles.image} />
      </Animatable.View>

      <Animatable.View
        animation="fadeInUp"
        duration={2000}
        style={styles.containerForm}
      >
        <Text style={styles.welcomeText}>Seja bem vindo(a)!</Text>
        <Text style={styles.infoText}>
          Informe seu CPF ou CNPJ para acessar
        </Text>

        <StyledInput
          placeholder="CPF/CNPJ"
          keyboardType="numeric"
          value={cpfCnpj}
          onChangeText={(text) => {
            setCpfCnpj(text);
            setError("");
          }}
        />

        <TouchableOpacity onPress={handleTermsPress}>
          <TermsLink>Nossos Termos de Política e Privacidade</TermsLink>
        </TouchableOpacity>

        <StyledButton onPress={handleLogin}>
          <ButtonText>Acessar</ButtonText>
        </StyledButton>
        {error !== "" && <ErrorText>{error}</ErrorText>}
      </Animatable.View>
    </SafeAreaView>
  );
}
