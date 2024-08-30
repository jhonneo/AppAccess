import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import chat from "../Images/chat.png";

import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import "react-native-gesture-handler";

export default function SelecionarContrato({ route, navigation }) {
  const [userData, setUserData] = useState(route.params.userData);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const updatedUserData = await fetchUpdatedUserData();
        setUserData(updatedUserData);
      } catch (error) { }
    };
    fetchData();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const updatedUserData = await fetchUpdatedUserData();
      setUserData(updatedUserData);
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
    }
  };

  const fetchUpdatedUserData = async () => {
    return route.params.userData;
  };

  const handleSelectContract = async (contract) => {
    try {
      if (contract && contract.id) {
        const hasValidPayment = contract.booklet.some(
          (item) => "payment" in item && item.payment !== null
        );
        const overdueBoletos = contract.booklet.filter(
          (boleto) => boleto.payment === "VENCIDO" || "BLOQUEADO"
        );
        if (overdueBoletos.length > 3) {
          navigation.navigate("Contato");
        } else if (hasValidPayment) {
          await AsyncStorage.setItem("contractId", contract.id.toString());
          navigation.navigate("Home", {
            userData: userData,
            selectedContract: contract,
          });
        } else {
          navigation.navigate("SemBoleto");
        }
      } else {
        navigation.navigate("SemBoleto");
      }
    } catch (error) {
      navigation.navigate("SemBoleto");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View
        animation="fadeInDown"
        duration={1000}
        style={styles.imageContainer}
      >
        <View style={styles.contetButtons}>
          <TouchableOpacity
            style={styles.buttonsOptions}
            onPress={() => navigation.navigate("Chat")}
          >
            <Image source={chat} style={styles.image} />
            <Text style={{ margin: 10 }}>Fale Conosco</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>

      <Animatable.View animation="fadeIn" duration={3000}>
        <Text style={styles.title}>Selecione um contrato:</Text>
      </Animatable.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={styles.contractList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {userData.contracts
          .filter(contract => contract.status !== "DESATIVADO")
          .map((contract, index) => (
            <Animatable.View
              animation="fadeInUp"
              duration={1000}
              key={index}
              style={styles.contractItem}
            >
              <Text style={styles.contractName}>Contrato {index + 1}</Text>
              <Text style={styles.contractInfo2}>
                Situação: {contract.status}
              </Text>
              <Text style={styles.contractInfo}>Nome: {contract.nome}</Text>
              <Text style={styles.contractInfo}>Plano: {contract.plano}</Text>
              <Text style={styles.contractInfo}>
                Endereço: {contract.endereco} {contract.numero}
              </Text>
              <Text style={styles.contractInfo}>Bairro: {contract.bairro}</Text>
              <Text style={styles.contractInfo}>Cidade: {contract.cidade}</Text>
              <Text style={styles.contractInfo}>Estado: {contract.estado}</Text>
              {/* {contract.status !== "DESATIVADO" && ( */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleSelectContract(contract)}
                >
                  <Text style={styles.buttonText}>Selecionar</Text>
                </TouchableOpacity>
              
            </Animatable.View>
          ))}
      </ScrollView>
    </SafeAreaView>
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
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  contetButtons: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 10,
    gap: 30,
  },
  buttonsOptions: {
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#DCF2F1",
    borderRadius: 20,
    padding: 10,
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
    backgroundColor: "#fff",
  },
  contractItem: {
    padding: 20,
    marginBottom: 2,
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#0B60B0",
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
  contractName1: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 15,
  },
  contractInfo2: {
    fontSize: 18,
    marginBottom: 5,
    color: "white",
  },
  contractInfo: {
    fontSize: 16,
    marginBottom: 5,
    color: "white",
  },
  button: {
    backgroundColor: "#F5EEE6",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});
