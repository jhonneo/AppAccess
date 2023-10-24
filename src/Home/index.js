import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Linking,
  Modal,
} from "react-native";
import logo from "../Images/logo.png";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { consultaAPI } from "../Api/Api";

import * as Clipboard from "expo-clipboard";
import * as Animatable from "react-native-animatable";

export default function Home({ route }) {
  const selectedContract = route.params.selectedContract;
  const [contractStatus, setContractStatus] = useState("");
  const [contractDueStatus, setDueStatus] = useState("");
  const [boletoLink, setBoletoLink] = useState("");
  const [Pix, setPix] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  useEffect(() => {
    if (selectedContract) {
      const status = selectedContract.booklet[0].payment || "Em dia";
      const dueDate = selectedContract.booklet[0].dueDate || " ";
      const link = selectedContract.booklet[0].billetCurrent || "";
      const pix_copy_paste = selectedContract.booklet[0].pix_copy_paste || "";

      setContractStatus(status);

      const formattedDueDate = formatDueDate(dueDate);
      setDueStatus(formattedDueDate);

      setBoletoLink(link);
      setPix(pix_copy_paste);
    }
  }, [selectedContract]);

  const formatDueDate = (date) => {
    const parts = date.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    }
    return date;
  };

  const handlePrintPress = () => {
    if (boletoLink) {
      Linking.openURL(boletoLink)
        .then(() => {})
        .catch((err) => {});
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await Clipboard.setString(Pix);
    } catch (error) {}
  };

  const handlePixPaymentPress = () => {
    if (Pix) {
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.tabContainer}>
      <Animatable.View
        animation="fadeInDown"
        duration={2000}
        style={styles.imageContainer}
      >
        <Image source={logo} style={styles.image} />
      </Animatable.View>

      <Animatable.View
        animation="fadeInUp"
        duration={2000}
        style={styles.centeredView}
      >
        <Animatable.View animation="fadeIn" duration={3000}>
          <Text style={styles.statusText3}>
            Confira como está o seu contrato agora:
          </Text>
        </Animatable.View>

        <Animatable.View animation="fadeIn" duration={3000}style={styles.card}>
          <Text style={styles.statusText}>Situação: {contractStatus}</Text>

          <Text style={styles.statusText2}>
            Vencimento: {contractDueStatus}
          </Text>
          </Animatable.View>

        <Text style={styles.statusText3}>
          Os dados necessários para acessar ou imprimir o boleto estão logo
          abaixo:
        </Text>

        <Animatable.View animation="fadeIn" duration={3000} style={styles.card2}>
          <TouchableOpacity
            style={styles.printButton}
            onPress={handlePrintPress}
          >
            <Text style={styles.buttonText}>Imprimir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pixButton}
            onPress={handlePixPaymentPress}
          >
            <Text style={styles.buttonText}>Pagar boleto via Pix</Text>
          </TouchableOpacity>
          
          </Animatable.View>
      </Animatable.View>

      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Para realizar o pagamento via PIX, copie e cole a chave fornecida
              no seu aplicativo do banco
            </Text>

            <TouchableOpacity
              onPress={() => {
                handleCopyToClipboard(Pix);
                setPixCopied(true);
              }}
              style={[
                styles.copyButton,
                { backgroundColor: pixCopied ? "green" : "#007AFF" },
              ]}
            >
              <Text style={styles.copyText}>Copiar Pix</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    alignItems: "center",
    paddingTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#0077bd",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingStart: "5%",
    paddingEnd: "5%",
    paddingTop: 40,
  },
  image: {
    width: 200,
    height: 150,
  },
  imageProfile: {
    width: 150,
    marginTop: 50,
    height: 150,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusText: {
    color: "#354799",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  statusText2: {
    color: "#FF7F50",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  statusText3: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    width: "98%",
    padding: 20,
    borderRadius: 20,
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
    width: "98%",
    padding: 20,
    borderRadius: 20,
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
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    backgroundColor: "#354799",
  },
  pixButton: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    backgroundColor: "#FF9500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    alignSelf: "center",
  },
  copyButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 20,
    marginTop: 10, // Espaço superior
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  copyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
