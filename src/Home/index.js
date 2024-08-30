import React, { useState, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
  Modal,
  RefreshControl,
} from "react-native";
import logo from "../Images/logo.png";
import { liberaTemporariamenteAPI } from "../Api/Api";
import { FontAwesome, Ionicons, AntDesign, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

import * as Clipboard from "expo-clipboard";
import * as Animatable from "react-native-animatable";

import { consultaAPI } from "../Api/Api";

export default function Home({ route }) {
  const navigation = useNavigation();

  const [selectedContract, setSelectedContract] = useState(
    route.params.selectedContract
  );
  const [refreshing, setRefreshing] = useState(false);

  const [contractStatus, setContractStatus] = useState("");
  const [contractDueStatus, setDueStatus] = useState("");
  const [boletos, setBoletos] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [pixBarCodeCopied, setBarcodeCopied] = useState(false);
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
  const selectedBoletoRef = useRef(null);

  const fetchData = async () => {
    try {
      const updatedSelectedContract = await fetchUpdatedSelectedContract();
      setSelectedContract((prevContract) => {
        return updatedSelectedContract;
      });
    } catch (error) { }
  };

  const fetchUpdatedSelectedContract = async () => {
    const data = await consultaAPI();
    return data;
  };

  useEffect(() => {
    fetchData();
  }, [selectedContract]);

  useEffect(() => {
    const fetchDataOnInit = async () => {
      await fetchData();
    };

    fetchDataOnInit();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchData();
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchData();
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedContract) {
        const status = selectedContract.booklet[0].payment || "Em dia";
        const dueDate = selectedContract.booklet[0].dueDate || " ";
        setContractStatus(status);
        const formattedDueDate = formatDueDate(dueDate);
        setDueStatus(formattedDueDate);
        const boletosData = selectedContract.booklet.map((boleto) => ({
          id: boleto.id || "",
          idClient: boleto.idClient || "",
          temporary_released: boleto.temporary_released || "",
          code: boleto.code || "",
          link: boleto.billetCurrent || "",
          pix: boleto.pix_copy_paste || "",
          barcode: boleto.barcode || "",
          status: boleto.payment || "Em dia",
          dueDate: formatDueDate(boleto.dueDate) || "",
          value: formatCurrency(boleto.value)
        }));

        setBoletos(boletosData);
      }
    };

    fetchData();
  }, [selectedContract]);

  const formatCurrency = (value) => {
    if (value !== undefined && value !== null) {
      return  parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return "";
  };

  const formatDueDate = (date) => {
    const parts = date.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    }
    return date;
  };

  const handlePrintPress = (boleto) => {
    if (boleto.link) {
      Linking.openURL(boleto.link)
        .then(() => { })
        .catch((err) => { });
    }
  };

  const handlePixPaymentPress = (boleto) => {
    if (boleto.pix) {
      setModalVisible(true);
      selectedBoletoRef.current = boleto;
    }
  };

  const handleBarCodePress = async (boleto) => {
    if (boleto.barcode) {
      setModalVisible2(true);
      selectedBoletoRef.current = boleto;
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const selectedBoleto = selectedBoletoRef.current;
      if (selectedBoleto) {
        await Clipboard.setString(selectedBoleto.pix);
        setPixCopied(true);  // Marcar como copiado
      } else {
        console.error("Boleto não selecionado");
      }
    } catch (error) {
      console.error("Erro ao copiar o PIX: ", error);
    }
  };


  const handleCopyToClipboardBarCode = async () => {
    try {
      const selectedBoleto = selectedBoletoRef.current;
      if (selectedBoleto) {
        await Clipboard.setString(selectedBoleto.barcode);
      } else {
      }
    } catch (error) { }
  };

  const handleLiberarPress = async (boleto) => {
    try {
      if (boleto) {
        const boletoData = {
          idClient: boleto.idClient,
          code: boleto.code,
        };

        liberaTemporariamenteAPI(boletoData)
          .then((response) => {
            if (response.status === "success") {
              setModalSuccessVisible(true);
              handleRefresh();
            } else {
              setModalErrorVisible(true);
            }
          })
          .catch(() => {
            setModalErrorVisible(true);
          });
      } else {
      }
    } catch (error) {
      setModalErrorVisible(true);
    }
  };

  const handlePress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.tabContainer}>
      <TouchableOpacity
        onPress={handlePress}
        style={{
          margin: 10,
          fontSize: 40,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Ionicons name="chevron-back" size={18} color="black" />
        <Text> Voltar</Text>
      </TouchableOpacity>
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
          <Text style={styles.statusText3}>Confira os boletos abaixo:</Text>
        </Animatable.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={styles.contractList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >

          {boletos.map((boleto, index) => (

            <Animatable.View key={index} style={styles.card}>
              <Text style={styles.statusText}>Situação: {boleto.status}</Text>
              <Text style={styles.statusText2}>Vencimento: {boleto.dueDate}</Text>
              <Text style={styles.statusText5}>Valor: {boleto.value}</Text>

              <View style={styles.cardText}>
                <Text style={styles.statusText4}>
                  Escolha uma opção abaixo:
                </Text>
              </View>

              <Animatable.View
                animation="fadeIn"
                duration={3000}
                style={styles.card2}
              >
                <TouchableOpacity
                  style={styles.printButton}
                  onPress={() => handlePrintPress(boleto)}
                >
                  <FontAwesome
                    name="print"
                    size={24}
                    color="white"
                    style={styles.icon}
                  />
                  <Text style={styles.buttonText}>Imprimir</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.printButton2}
                  onPress={() => {
                    handleBarCodePress(boleto);
                  }}
                >
                  <AntDesign
                    name="barcode"
                    size={24}
                    color="white"
                    style={styles.icon}
                  />
                  <Text style={styles.buttonText}>
                    Pagar via código de barras
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.pixButton}
                  onPress={() => {
                    handlePixPaymentPress(boleto);
                  }}
                >
                  <FontAwesome
                    name="money"
                    size={24}
                    color="white"
                    style={styles.icon}
                  />
                  <Text style={styles.buttonText}>Pagar boleto via Pix</Text>
                </TouchableOpacity>
              </Animatable.View>
            </Animatable.View>
          ))}
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
                handleCopyToClipboard();
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
                handleCopyToClipboardBarCode();
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
              A velocidade da sua conexão foi restabelecida temporariamente ate
              a próxima data útil enquanto confirmamos o seu pagamento.
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
    </SafeAreaView>
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
    backgroundColor: "#fff",
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
    color: "#111",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statusText4: {
    color: "#111",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  statusText5: {
    color: "#5a5858",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  card: {
    width: "98%",
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#FFFFEC",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.35,
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

  hiddenContainer: {
    display: "none",
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
  icon: {
    justifyContent: "flex-start",
  },
});
