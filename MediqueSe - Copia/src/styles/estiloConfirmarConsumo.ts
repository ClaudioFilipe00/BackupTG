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

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  logo: {
    width: width * 1.2,
    height: height * 0.5,
    marginBottom: height * 0.01,
    resizeMode: "contain",
  },

  nomeMedicamento: {
    color: cores.preto,
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  dose: {
    color: cores.preto,
    fontSize: 25,
    textAlign: "center",
    marginBottom: 10,
  },
  horario: {
    color: cores.preto,
    fontSize: 25,
    textAlign: "center",
    marginBottom: 30,
  },
  botao: {
    backgroundColor: cores.primario,
    paddingVertical: height * 0.02,
    borderRadius: 8,
    width: "110%",
    alignItems: "center",
    marginVertical: height * 0.04,
    borderWidth: 2,
    borderColor: cores.destaque,
    shadowColor: cores.sombra,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  textoBotao: {
    color: cores.branco,
    fontSize: width * 0.06,
    fontWeight: "bold",
  },
  lembrete: {
    color: cores.branco,
    fontSize: 20,
    textAlign: "center",
  },
});
