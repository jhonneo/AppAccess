import { StatusBar } from "expo-status-bar";
import { View, Image, Text, StyleSheet, } from "react-native";
import React, { useState, useEffect } from "react";
import logo from "../Images/logo.png";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { consultaAPI } from "../Api/Api";
import { useNavigation } from "@react-navigation/native";

import * as Animatable from 'react-native-animatable';


const StyledInput = styled.TextInput`
  width: 100%;
  height: 40px;
  border-bottom-width: 2px;
  border-bottom-color: #fff;
  margin-bottom: 15px;
  font-size: 25px;
  padding: 5px;
  text-align: center ;
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLogo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  containerForm: {
    flex: 1,
    backgroundColor: "#0077bd",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingStart: "5%",
    paddingEnd: "5%",
  },
  image: {
    width: 400,
    height: 400,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 40,
    textAlign: "center",
    marginTop: 80,
  },
  infoText: {
    fontSize: 16,
    color: "white",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 10,
  },
});

function isValidCPF(cpf) {
  if (typeof cpf !== "string") return false;
  cpf = cpf.replace(/[\s.-]*/g, ""); // Remove pontos, traços e espaços em branco
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

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;

  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

function isValidCNPJ(cnpj) {
  if (typeof cnpj !== "string") return false;
  cnpj = cnpj.replace(/[\s.-]*/g, ""); // Remove pontos, traços e espaços em branco
  if (cnpj.length !== 14) return false;

  // Validação básica
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
      } catch (error) {
        console.error("Erro ao recuperar CPF/CNPJ:", error);
      }
    };

    loadCpfCnpj();
  }, []);

  const handleLogin = async () => {
    if (cpfCnpj) {
      const cleanedCpfCnpj = cpfCnpj.replace(/\D/g, "");
      try {
        if (cleanedCpfCnpj.length === 11 && isValidCPF(cleanedCpfCnpj)) {
          const data = await consultaAPI(cleanedCpfCnpj);

          if (data && data.cpfCnpj) {
            if (data.records > 1) {
              console.log('Navegando para a tela "SelecionarContrato"');
              navigation.navigate("SelecionarContrato", { userData: data });
            } else {
              AsyncStorage.setItem("cpfCnpj", cleanedCpfCnpj)
                .then(() => {
                  console.log('Navegando para a tela "Tab2"');
                  navigation.navigate("SelecionarContrato", {
                    cpfCnpj: cleanedCpfCnpj,
                  });
                })
                .catch((storageError) => {});
            }
          } else {
            setError(data.message || "Erro desconhecido na API");
          }
        } else if (
          cleanedCpfCnpj.length === 14 &&
          isValidCNPJ(cleanedCpfCnpj)
        ) {
          const data = await consultaAPI(cleanedCpfCnpj);

          if (data && data.cpfCnpj) {
            if (data.records > 1) {
            
              navigation.navigate("SelecionarContrato", { userData: data });
            } else {
              AsyncStorage.setItem("cpfCnpj", cleanedCpfCnpj)
                .then(() => {
                  navigation.navigate("SelecionarContrato", {
                    cpfCnpj: cleanedCpfCnpj,
                  });
                })
                .catch((storageError) => {
                });
            }
          } else {
            setError(data.message || "Erro desconhecido na API");
          }
        } else {
          setError("CPF/CNPJ inválido");
        }
      } catch (apiError) {
        setError("Erro na chamada à API");
      }
    } else {
      setError("ERRO 3");
    }
  };



  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Animatable.View animation="fadeInDown" duration={2000} style={styles.containerLogo}>
        <Image source={logo} style={styles.image} />
        </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={2000}  style={styles.containerForm}>
        <Text style={styles.welcomeText}>Seja bem vindo(a)!</Text>
        <Text style={styles.infoText}>
          Informe seu CPF ou CNPJ para acessar
        </Text>

        <StyledInput
          placeholder="CPF/CNPJ"
          keyboardType="numeric"
          value={cpfCnpj}
          onChangeText={(text) => {
            console.log("Valor digitado:", text);
            setCpfCnpj(text);
            setError("");
          }}
        />

        <StyledButton onPress={handleLogin}>
          <ButtonText>Acessar</ButtonText>
        </StyledButton>
        {error !== "" && <ErrorText>{error}</ErrorText>}

        </Animatable.View>



    </View>
  );
}
