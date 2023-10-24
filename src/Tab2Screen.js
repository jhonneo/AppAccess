import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import logo from "./Images/logo.png";
import { Ionicons } from "@expo/vector-icons";
import { consultaAPI } from "./Api/Api";

export default function Tab2Screen({ route }) {
  const userData = route.params.userData;
  const selectedContract = route.params.selectedContract;
  const [contractData, setContractData] = useState(null);

  useEffect(() => {
    if (selectedContract) {
      consultaAPI(selectedContract.id)
        .then((response) => {
          if (response && response.success) {
            if (response.contracts && response.contracts.length > 0) {
              // Se contratos forem encontrados na resposta
              const contract = response.contracts[0];
              setContractData({
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
              });
            } else {
              console.error("Nenhum contrato encontrado na resposta da API.");
              // Trate a situação em que nenhum contrato é encontrado
            }
          } else {
            console.error("Falha na consulta do contrato:", response);
            // Trate a falha na consulta
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar dados do contrato:", error);
          // Trate o erro ao buscar dados do contrato
        });
    }
  }, [selectedContract]);
  

  return (
    <View style={styles.profileContainer}>
      <Image source={logo} style={styles.imageProfile} />

      {userData ? (
        <>
          <Text style={styles.profileName}>{userData.nome}</Text>
          <Text style={styles.profileBio}>
            Plano: {contractData ? contractData.plano : "Selecione um contrato"}
            {"\n"}
            Vencimento:{" "}
            {contractData ? contractData.vencimento : "Selecione um contrato"}
            {"\n"}
            Endereço:{" "}
            {contractData
              ? `${contractData.endereco}, ${contractData.numero}, ${contractData.referencia}`
              : "Selecione um contrato"}
            {"\n"}
            Bairro:{" "}
            {contractData ? contractData.bairro : "Selecione um contrato"}
            {"\n"}
            Cidade:{" "}
            {contractData
              ? `${contractData.cidade}, ${contractData.estado}`
              : "Selecione um contrato"}
            {"\n"}
            Status:{" "}
            {contractData ? contractData.status : "Selecione um contrato"}
            {"\n"}
            Data de Cadastro:{" "}
            {contractData
              ? contractData.data_cadastroF
              : "Selecione um contrato"}
          </Text>
        </>
      ) : (
        <Text>Carregando dados do usuário...</Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={() => {
            console.log("Botão sair clicado");
          }}
        >
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    paddingTop: 90,
    backgroundColor: "#fff",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
  },
  imageProfile: {
    width: 150,
    marginTop: 50,
    height: 150,
  },
  profileContainer: {
    flex: 1,
    padding: 15,
    marginTop: 0,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  profilePicture: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 40,
  },
  profileName: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileBio: {
    fontSize: 15,
    textAlign: "center",
    marginVertical: 20,
  },
  button: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#007AFF",
  },
  logoutButton: {
    backgroundColor: "red",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  statusText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    width: "95%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  card2: {
    width: "95%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  printButton: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    backgroundColor: "#007AFF",
  },
  pixButton: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    backgroundColor: "#FF9500",
  },
  card3: {
    width: "95%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  paymentHistory: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 15,
    textDecorationLine: "underline",
    textAlign: "left",
  },
  monthPayment: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "left",
    paddingLeft: 10,
  },

  cardSupport: {
    flexDirection: "row",
    width: "95%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 40,
    justifyContent: "space-between",
    alignItems: "center",
  },
  supportTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 0,
    textDecorationLine: "underline",
    textAlign: "left",
  },
  supportOption: {
    fontSize: 16,
    lineHeight: 24,
    color: "#007AFF",
  },
});
