import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { estilosGlobais, cores } from "../styles/estilos";

export default function Instrucoes({ navigation, route }: any) {
    const telefone = route.params?.telefone || "";

    return (
        <View style={estilosGlobais.container}>
            <View style={{
                flex: 0.95,
                width: "100%",
                backgroundColor: cores.branco,
                borderRadius: 16,
                padding: 20,
                marginVertical: 10,
                shadowColor: cores.sombra,
                shadowOpacity: 0.3,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 4 },
            }}>

                <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 30 }}>
                    <Text style={{ fontSize: 22, fontWeight: "bold", color: cores.primario, marginBottom: 15, textAlign: "center" }}>
                        Bem-vindo ao Medique-se
                    </Text>

                    <Text style={{ fontSize: 17, fontWeight: "bold", marginBottom: 10, textAlign: "center" }}>
                        Manual de Avisos e Instruções de Uso do Aplicativo
                    </Text>

                    <Text style={{ fontSize: 15, marginBottom: 15 }}>
                        AVISO: Você está utilizando um protótipo de testes do aplicativo. Podem ocorrer erros inesperados ou perda de conexão com o servidor. Caso aconteça algum problema, informe-o no formulário enviado junto ao instalador.
                        
                    </Text>

                    <Text style={{ fontSize: 15,fontWeight: "bold", marginBottom: 15 }}>
                        Leia atentamente as intruções abaixo sobre a utilização do aplicativo.
                    </Text>
                    {[
                        {
                            titulo: "1 – Adicionando Medicamentos",
                            texto: `• Todos os campos são obrigatórios. Preencha corretamente para evitar problemas com horários, doses ou tipos de medicação.
• Ao definir o horário da medicação, digite um horário válido, por exemplo, 12:30; caso contrário, a notificação não funcionará.
• Informe o nome do médico responsável, com ou sem os prefixos Dr. ou Dra., conforme sua preferência.
• Após digitar o horário, pressione o botão de confirmação do teclado (“OK”, “Concluído”, “✓”, “Continuar”, “Confirmar” etc.). O horário só será validado e a notificação agendada após essa confirmação. É possível adicionar mais horários se necessário.
• Selecione o tipo da dose: Gotas, ml ou Comprimidos.
• Ao escolher Contínuo, o alarme disparará todos os dias sem prazo determinado. Para definir duração, informe o tempo e selecione entre Dias ou Meses.
• Na seleção de dias, escolha os dias corretos ou clique em Todos os Dias para notificações diárias.
• Clique em Salvar para registrar corretamente seu medicamento e horários.`
                        },
                        {
                            titulo: "2 – Alterar Medicamentos",
                            texto: `• Todos os dados podem ser alterados, exceto o nome do medicamento.
• Siga as mesmas regras descritas em “Adicionando Medicamentos”.
• Os dados que não forem alterados permanecerão como estavam no momento em que foram adicionados.
• Clique em Salvar para confirmar alterações ou em Voltar para cancelar.`
                        },
                        {
                            titulo: "3 – Excluir Medicamentos",
                            texto: `• Selecione os medicamentos que deseja excluir e clique em Excluir.
• Uma mensagem de confirmação aparecerá; confirme ou cancele a exclusão.
• Medicamentos excluídos são removidos permanentemente.`
                        },
                        {
                            titulo: "4 – Notificações (Alarmes)",
                            texto: `• Os horários de notificação são definidos automaticamente ao salvar o medicamento.
• Alterações em dias ou horários atualizam o alarme automaticamente.
• Ao receber a notificação, abra primeiro o aplicativo e depois clique na notificação para ser redirecionado à tela de confirmação do consumo. Caso clique sem abrir o app, a notificação será perdida naquele dia.
• Mantenha o aplicativo aberto em segundo plano. É possível usar o celular normalmente, mas não feche o app completamente.`
                        },
                        {
                            titulo: "5 – Histórico de Consumo",
                            texto: `• Ao clicar na notificação, será aberta uma tela de confirmação com as opções: Consumido e Lembrar Novamente.
• Selecionando Consumido, a medicação será registrada como tomada no horário correto.
• Selecionando Lembrar Novamente, a notificação será disparada novamente após um período definido. Se a opção for escolhida três vezes seguidas, o horário será registrado como Não Consumido.
• É possível consultar o histórico de cada medicamento na tela Histórico de Consumo.`
                        },
                        {
                            titulo: "6 – Lista de Medicamentos",
                            texto: `• Medicamentos salvos aparecem na tela Lista de Medicamentos.
• Clique no botão “+” ao lado do nome do medicamento para ver detalhes. Clique novamente para fechar os detalhes.`
                        },
                        {
                            titulo: "7 – Usuários",
                            texto: `• Alterar dados: Permite modificar nome e data de nascimento. O telefone permanece o mesmo.
• Excluir usuário: Remove todos os dados relacionados, incluindo medicamentos e histórico de consumo.`
                        },
                        {
                            titulo: "8 – Sair",
                            texto: `• Retorna à tela principal do celular, saindo do aplicativo.`
                        },
                        {
                            titulo: "Para ler as instruções e avisos novamente, acesse o menu de usuário e clique em MANUAL DE INSTRUÇÕES" 
                        }
                    ].map((sec, index) => (
                        <View key={index} style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold", color: cores.primario, marginBottom: 5 }}>
                                {sec.titulo}
                            </Text>
                            <Text style={{ fontSize: 14, lineHeight: 22 }}>{sec.texto}</Text>
                        </View>
                    ))}

                    <TouchableOpacity
                        style={[estilosGlobais.button, { marginTop: 10 }]}
                        onPress={() =>
                            navigation.reset({ index: 0, routes: [{ name: "MenuPrincipal", params: { telefone } }] })
                        }
                    >
                        <Text style={estilosGlobais.buttonText}>FECHAR</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
}
