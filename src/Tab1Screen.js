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
import logo from "./Images/logo.png";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { consultaAPI } from "./Api/Api";

import * as Clipboard from "expo-clipboard";

export default function Tab1Screen({ route }) {
  const selectedContract = route.params.selectedContract;
  const [contractStatus, setContractStatus] = useState("");
  const [boletoLink, setBoletoLink] = useState("");
  const [Pix, setPix] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (selectedContract) {
      const status = selectedContract.booklet[0].payment || "Em dia";
      const link = selectedContract.booklet[0].linkPdf || "";
      const pix_copy_paste = selectedContract.booklet[0].pix_copy_paste || "";

      setContractStatus(status);
      setBoletoLink(link);
      setPix(pix_copy_paste);
    }
  }, [selectedContract]);

  const handlePrintPress = () => {
    if (boletoLink) {
      Linking.openURL(boletoLink)
        .then(() => {
          console.log("Link de impressão aberto com sucesso.");
        })
        .catch((err) => {
          console.error("Erro ao abrir o link de impressão:", err);
        });
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await Clipboard.setString(Pix);
      console.log("Texto copiado para a área de transferência.");
    } catch (error) {
      console.error("Erro ao copiar para a área de transferência:", error);
    }
  };

  const handlePixPaymentPress = () => {
    if (Pix) {
      console.log("Abrindo link para pagamento via Pix: " + Pix);
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.tabContainer}>
      <View style={styles.centeredView}>
        <Image source={logo} style={styles.image} />

        <View style={styles.card}>
          <Text style={styles.statusText}>Sua situação: {contractStatus}</Text>
        </View>

        <View style={styles.card2}>
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
        </View>
      </View>

      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Realizar pagamento via Pix</Text>

            <TouchableOpacity onPress={() => handleCopyToClipboard(Pix)}>
              <Text style={styles.copyText}>Copiar link do Pix</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.payPixButton}
              onPress={() => {
                // Implemente a lógica de pagamento via Pix
              }}
            ></TouchableOpacity>
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
  button: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
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
    width: "95%",
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
    width: "80%",
    backgroundColor: "#007AFF",
  },
  pixButton: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    backgroundColor: "#FF9500",
  },  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 20, 
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
