import { StyleSheet, Dimensions, Platform } from "react-native";

export const cores = {
  fundo: "#cffeff",
  branco: "#ffffff",
  preto: "#000000",
  primario: "#0097A7",
  destaque: "#00bcd4",
  sombra: "#00000033",
};

const { width, height } = Dimensions.get("window");

export const estilosGlobais = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "5%",
    paddingVertical: "3%",
  },

  logo: {
    width: "90%",
    height: height * 0.3,
    marginBottom: height * 0.03,
    resizeMode: "contain",
  },

  input: {
    width: "100%",
    backgroundColor: cores.branco,
    paddingVertical: Platform.OS === "ios" ? 18 : 16,
    paddingHorizontal: 14,
    marginBottom: height * 0.025,
    borderRadius: 8,
    fontSize: width * 0.05, 
    color: cores.preto,
    borderWidth: 2,
    borderColor: cores.destaque,
    shadowColor: cores.sombra,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  button: {
    backgroundColor: cores.primario,
    paddingVertical: height * 0.03, 
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginVertical: height * 0.03,
    borderWidth: 2,
    borderColor: cores.destaque,
    shadowColor: cores.sombra,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  buttonText: {
    color: cores.branco,
    fontSize: width * 0.055, 
    fontWeight: "bold",
    includeFontPadding: false,
  },

  tituloTela: {
    fontSize: width * 0.085, 
    fontWeight: "bold",
    color: cores.primario,
    textAlign: "center",
    marginBottom: height * 0.04,
    marginTop: -height * 0.04,
  },
});
