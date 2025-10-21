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

export const estiloLista = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    justifyContent: "flex-start",
    paddingHorizontal: "5%",
    paddingVertical: "3%",
    alignItems: "stretch",
  },

  button: {
    backgroundColor: cores.primario,
    paddingVertical: height * 0.02,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: height * 0.03,
  },

  buttonText: {
    color: cores.branco,
    fontSize: width * 0.06,
    fontWeight: "bold",
  },

  tituloTela: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: cores.primario,
    textAlign: "center",
    marginBottom: height * 0.03,
    marginTop: height * 0.02,
  },

  card: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: width * 0.04,
    width: "100%",
    borderWidth: 2,
    borderColor: cores.destaque,
    shadowColor: cores.sombra,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    marginBottom: height * 0.02,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: width * 0.06,
    fontWeight: "700",
    color: cores.preto,
    flexShrink: 1,
  },

  expandBtn: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: (width * 0.12) / 2,
    borderWidth: 1,
    borderColor: cores.destaque,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0f7fa",
    shadowColor: cores.sombra,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  expandBtnText: {
    fontSize: width * 0.07,
    fontWeight: "700",
    color: cores.destaque,
    lineHeight: width * 0.07,
  },

  details: {
    marginTop: height * 0.02,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: height * 0.015,
  },

  detailLabel: {
    fontSize: width * 0.045,
    fontWeight: "700",
    color: cores.preto,
  },

  detailText: {
    fontSize: width * 0.045,
    color: cores.preto,
    marginTop: height * 0.008,
  },

  timeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: height * 0.008,
  },

  timeBadge: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.008,
    backgroundColor: cores.fundo,
    borderRadius: 16,
    marginRight: width * 0.02,
    marginBottom: height * 0.01,
    borderWidth: 1,
    borderColor: cores.primario,
  },

  timeText: {
    color: cores.primario,
    fontWeight: "700",
    fontSize: width * 0.04,
  },

  fab: {
    position: "absolute",
    right: width * 0.05,
    bottom: height * 0.04,
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    backgroundColor: cores.primario,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});
