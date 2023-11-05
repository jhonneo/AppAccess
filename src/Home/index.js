import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
  Button,
  Modal,
} from "react-native";
import logo from "../Images/logo.png";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { consultaAPI, liberaTemporariamenteAPI } from "../Api/Api";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import * as Clipboard from "expo-clipboard";
import * as Animatable from "react-native-animatable";

export default function Home({ route }) {
  const selectedContract = route.params.selectedContract;
  const [contractStatus, setContractStatus] = useState("");
  const [contractDueStatus, setDueStatus] = useState("");
  const [boletoLink, setBoletoLink] = useState("");
  const [Pix, setPix] = useState("");
  const [barcode, setBarcode] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [pixBarCodeCopied, setBarcodeCopied] = useState(false);
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);

  useEffect(() => {
    if (selectedContract) {
      const status = selectedContract.booklet[0].payment || "Em dia";
      const dueDate = selectedContract.booklet[0].dueDate || " ";
      const link = selectedContract.booklet[0].billetCurrent || "";
      const pix_copy_paste = selectedContract.booklet[0].pix_copy_paste || "";
      const barcode = selectedContract.booklet[0].barcode || "";

      setContractStatus(status);

      const formattedDueDate = formatDueDate(dueDate);
      setDueStatus(formattedDueDate);
      setBoletoLink(link);
      setPix(pix_copy_paste);
      setBarcode(barcode);
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

  const handleCopyToClipboardBarCode = async () => {
    try {
      await Clipboard.setString(barcode);
    } catch (error) {}
  };

  const handlePixPaymentPress = () => {
    if (Pix) {
      setModalVisible(true);
    }
  };

  const handleBarCodePress = () => {
    if (barcode) {
      setModalVisible2(true);
    }
  };

  const handleLiberarPress = async () => {
    try {
      //os dados do cliente e do boleto
      const cliente = { id: "id-do-cliente", status: "REDUZIDO" };
      const boleto = { code: "codigo-do-boleto", temporary_released: false };

      // Chama a função para liberar temporariamente
      await liberaTemporariamenteAPI(cliente, boleto);

      setModalSuccessVisible(true);
    } catch (error) {
      setModalErrorVisible(true);
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
            Confira como está o seu boleto agora:
          </Text>
        </Animatable.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={styles.contractList}
        >
          <Animatable.View style={styles.card}>
            <Text style={styles.statusText}>Situação: {contractStatus}</Text>

            <Text style={styles.statusText2}>
              Vencimento: {contractDueStatus}{" "}
            </Text>

            <View style={styles.cardText}>
              <Text style={styles.statusText4}>
                Os dados necessários para acessar ou imprimir o boleto estão
                logo abaixo:
              </Text>
            </View>

            <Animatable.View
              animation="fadeIn"
              duration={3000}
              style={styles.card2}
            >
              <TouchableOpacity
                style={styles.printButton}
                onPress={handlePrintPress}
              >
                <FontAwesome name="print" size={24} color="white" />
                <Text style={styles.buttonText}>Imprimir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.printButton2}
                onPress={handleBarCodePress}
              >
                <AntDesign name="barcode" size={24} color="white" />
                <Text style={styles.buttonText}>
                  Pagar boleto via código de barras
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pixButton}
                onPress={handlePixPaymentPress}
              >
                <FontAwesome name="money" size={24} color="white" />
                <Text style={styles.buttonText}>Pagar boleto via Pix</Text>
              </TouchableOpacity>
            </Animatable.View>
          </Animatable.View>

          <View style={styles.liberarContainer}>
            <TouchableOpacity
              style={styles.liberarButtom}
              onPress={handleLiberarPress}
            >
              <MaterialIcons name="payments" size={24} color="white" />
              <Text style={styles.buttonText}>Promessa de pagamento</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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

      <Modal animationType="slide" transparent={true} visible={isModalVisible2}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Para realizar o pagamento via código de barras, copie e cole o
              código de barras no seu aplicativo do banco
            </Text>

            <TouchableOpacity
              onPress={() => {
                handleCopyToClipboardBarCode(barcode);
                setBarcodeCopied(true);
              }}
              style={[
                styles.copyButton,
                { backgroundColor: pixBarCodeCopied ? "#00FF7F" : "#90EE90" },
              ]}
            >
              <Text style={styles.copyText}>Copiar código de barras</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible2(false)}
            >
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalErrorVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Erro ao liberar temporariamente,por favor entre em contato via
              WhatsApp
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalErrorVisible(false)}
            >
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalSuccessVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Sucesso! Você tem 24 horas para realizar o pagamento
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalSuccessVisible(false)}
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
    fontSize: 15,
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
  statusText4: {
    color: "#111",
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
    width: "100%",
    marginBottom: 20,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  liberarContainer: {
    width: "100%",
    marginBottom: 20,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    width: "100%",
    marginBottom: 5,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    alignSelf: "center",
  },
  printButton: {
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
    justifyContent: "center",
    width: "90%",
    backgroundColor: "#354799",
  },
  liberarButtom: {
    marginVertical: 10,
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    backgroundColor: "#3CB371",
  },
  printButton2: {
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 10,
    flexDirection: "row",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    backgroundColor: "#4682B4",
  },
  pixButton: {
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 10,
    flexDirection: "row",
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
    marginTop: 10,
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
