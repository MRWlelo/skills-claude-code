import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const TIPO_LABELS: Record<string, string> = {
  arrendamento_rural: "Contrato de Arrendamento Rural",
  parceria_agricola: "Contrato de Parceria Agrícola",
  parceria_pecuaria: "Contrato de Parceria Pecuária",
  comodato_rural: "Contrato de Comodato Rural",
  compra_venda_imovel_rural: "Contrato de Compra e Venda de Imóvel Rural",
  cessao_uso: "Contrato de Cessão de Uso",
  aforamento_rural: "Contrato de Aforamento Rural",
  permuta_imoveis_rurais: "Contrato de Permuta de Imóveis Rurais",
  arrendamento_opcao_compra: "Contrato de Arrendamento com Opção de Compra",
  contrato_meacao: "Contrato de Meação Rural",
};

const FORMA_PAGAMENTO_LABELS: Record<string, string> = {
  anual: "pagamento anual",
  semestral: "pagamento semestral",
  mensal: "pagamento mensal",
  colheita: "pagamento na colheita",
  producao: "pagamento em produção (sacas)",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tipo_contrato,
      arrendador_nome,
      arrendador_cpf_cnpj,
      arrendatario_nome,
      arrendatario_cpf_cnpj,
      imovel_nome,
      imovel_municipio,
      imovel_estado,
      imovel_area,
      imovel_matricula,
      imovel_car,
      prazo_anos,
      valor_arrendamento,
      forma_pagamento,
      uso_destinado,
      observacoes,
    } = body;

    if (!tipo_contrato || !arrendador_nome || !arrendatario_nome || !imovel_nome || !imovel_municipio) {
      return NextResponse.json({ error: "Campos obrigatórios não preenchidos." }, { status: 400 });
    }

    const tipoLabel = TIPO_LABELS[tipo_contrato] ?? "Contrato Rural";
    const formaPagLabel = FORMA_PAGAMENTO_LABELS[forma_pagamento] ?? forma_pagamento;

    const prompt = `Você é um especialista em direito agrário brasileiro com vasta experiência na elaboração de contratos rurais conforme o Estatuto da Terra (Lei nº 4.504/1964), o Decreto nº 59.566/1966 (Regulamento do Estatuto da Terra), e demais normas aplicáveis ao direito agrário.

Elabore um ${tipoLabel} completo e tecnicamente correto, com as seguintes informações:

**PARTES:**
- Parte cedente (Arrendador/Proprietário): ${arrendador_nome}, CPF/CNPJ: ${arrendador_cpf_cnpj}
- Parte cessionária (Arrendatário/Parceiro): ${arrendatario_nome}, CPF/CNPJ: ${arrendatario_cpf_cnpj}

**IMÓVEL RURAL:**
- Denominação: ${imovel_nome}
- Localização: Município de ${imovel_municipio}, Estado de ${imovel_estado}
- Área total: ${imovel_area} hectares
${imovel_matricula ? `- Matrícula nº: ${imovel_matricula}` : ""}
${imovel_car ? `- Código CAR: ${imovel_car}` : ""}

**CONDIÇÕES:**
- Prazo: ${prazo_anos} anos
- Remuneração/Valor: ${valor_arrendamento}
- Forma de pagamento: ${formaPagLabel}
- Destinação do uso: ${uso_destinado}
${observacoes ? `\n**OBSERVAÇÕES E CLÁUSULAS ESPECIAIS:**\n${observacoes}` : ""}

**INSTRUÇÕES PARA O CONTRATO:**
1. Use linguagem jurídica formal e técnica
2. Inclua todas as cláusulas essenciais conforme a legislação agrária brasileira
3. Inclua cláusula de foro (Comarca de ${imovel_municipio}/${imovel_estado})
4. Inclua espaço para data, assinaturas e testemunhas
5. Mencione a legislação aplicável relevante
6. Para arrendamento rural, observe os limites mínimos do Decreto 59.566/66
7. Inclua cláusulas sobre benfeitorias, conservação do imóvel e responsabilidades
8. Para parceria, inclua cláusulas sobre divisão dos frutos conforme o uso destinado
9. Formate o contrato de forma clara com numeração de cláusulas

Gere o contrato completo em português brasileiro.`;

    const message = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const contrato = message.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text)
      .join("\n");

    return NextResponse.json({ contrato });
  } catch (err: unknown) {
    console.error("Erro ao gerar contrato:", err);
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
