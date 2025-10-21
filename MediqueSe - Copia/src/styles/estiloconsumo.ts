import { StyleSheet, Dimensions } from "react-native";

export const cores = {
  fundo: "#cffeff",
  branco: "#ffffff",
  preto: "#000000",
  primario: "#0097A7",
  destaque: "#00bcd4",
  sombra: "#00000033",
};

const { width, height } = Dimensions.get("window");

export const estiloHistorico = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingHorizontal: "5%",
    paddingVertical: "3%",
  },

  tituloTela: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    color: cores.primario,
    textAlign: "center",
    marginBottom: height * 0.03,
  },

  subtitulo: {
    fontSize: width * 0.045,
    textAlign: "center",
    color: cores.preto,
    fontWeight: "600",
    marginBottom: height * 0.02,
  },

  pickerContainer: {
    width: "100%",
    height: 55,
    backgroundColor: cores.branco,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: cores.destaque,
    marginBottom: height * 0.025,
    paddingHorizontal: width * 0.025,
    justifyContent: "center",
    shadowColor: cores.sombra,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  picker: {
    width: "100%",
    height: "100%",
    color: cores.preto,
    fontSize: width * 0.045,
  },

  cabecalhoTabela: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginTop: height * 0.01,
    marginBottom: height * 0.005,
  },

  cabecalhoTexto: {
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    fontSize: width * 0.04,
  },

  linhaTabela: {
    backgroundColor: cores.branco,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: height * 0.012,
    marginBottom: height * 0.006,
    elevation: 2,
  },

  textoTabela: {
    flex: 1,
    textAlign: "center",
    color: cores.preto,
    fontSize: width * 0.045,
  },

  button: {
    backgroundColor: cores.primario,
    paddingVertical: height * 0.025,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: height * 0.03,
    marginBottom: height * 0.05,
    borderWidth: 2,
    borderColor: cores.destaque,
    shadowColor: cores.sombra,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  buttonText: {
    color: cores.branco,
    fontSize: width * 0.065,
    fontWeight: "bold",
  },
});
