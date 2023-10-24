import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from "../Images/logo.png";

import * as Animatable from "react-native-animatable";

export default function SelecionarContrato({ route, navigation }) {
  const userData = route.params.userData;

  const handleSelectContract = (contract) => {
    AsyncStorage.setItem("contractId", contract.id.toString())
      .then(() => {
        navigation.navigate("Home", {
          userData: userData,
          selectedContract: contract,
        });
      })
      .catch((error) => {
        console.error("Erro ao selecionar contrato:", error);
      });
  };

  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeInDown"
        duration={3000}
        style={styles.imageContainer}
      >
        <Image source={logo} style={styles.image} />
      </Animatable.View>

      <Animatable.View animation="fadeIn" duration={3000}>
      <Text style={styles.title}>Selecione um contrato:</Text>

      </Animatable.View>

      <ScrollView
        showsVerticalScrollIndicator={false} 
        showsHorizontalScrollIndicator={false} 
        style={styles.contractList}
      >
        {userData.contracts.map((contract, index) => (
          <Animatable.View
            animation="fadeInUp"
            duration={3000}
            key={index}
            style={styles.contractItem}
          >
            <Text style={styles.contractName}>Contrato {index + 1}</Text>
            <Text style={styles.contractInfo}>Nome: {contract.nome}</Text>
            <Text style={styles.contractInfo}>Plano: {contract.plano}</Text>
            <Text style={styles.contractInfo}>
              Endereço: {contract.endereco}
            </Text>
            <Text style={styles.contractInfo}>Bairro: {contract.bairro}</Text>
            <Text style={styles.contractInfo}>Cidade: {contract.cidade}</Text>
            <Text style={styles.contractInfo}>Estado: {contract.estado}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSelectContract(contract)}
            >
              <Text style={styles.buttonText}>Selecionar</Text>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    alignItems: "center",
    paddingTop: 20,
  },
  image: {
    width: 200,
    height: 150,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  contractList: {
    flex: 1,
    padding: 10,
    backgroundColor: "#0077bd",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingStart: "5%",
    paddingEnd: "5%",
  },
  contractItem: {
    padding: 20,
    marginBottom: 2,
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    shadowColor: "#000",
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  contractName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  contractInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#354799",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
