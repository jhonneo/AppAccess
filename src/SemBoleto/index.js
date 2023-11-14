import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import ImageBoleto from "../Images/ImageBoleto.png";
import logo from "../Images/logo.png";

export default function SemBoleto() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer1}>
        <Image source={logo} style={styles.image} />
      </View>

      <Image source={ImageBoleto} style={styles.imagePrincipal} />
      <Text style={styles.text}>Você não tem boleto vencido!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer1: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer2: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  image: {
    width: 300,
    height: 150,
    marginBottom: 10
  },
  imagePrincipal: {
    width: 250,
    height: 250,
    marginBottom: 15
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
});
