const AGENT_TOOLS = [
  {
    type: "function",
    name: "create_follow_up_task",
    description:
      "Tworzy w CRM konkretne zadanie kontaktowe dla klienta.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          description:
            "Konkretne zadanie, które powinien wykonać handlowiec.",
        },
      },
      required: ["action"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "update_client_status",
    description:
      "Aktualizuje status klienta w CRM.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: [
            "NOWY",
            "KONTAKT",
            "ZAINTERESOWANY",
            "ZAMKNIĘTY",
          ],
          description: "Nowy status klienta.",
        },
      },
      required: ["status"],
      additionalProperties: false,
    },
  },
];

async function executeAgentTool(
  toolCall,
  clientId,
  pool
) {
  const argumentsData = JSON.parse(
    toolCall.arguments
  );

  if (toolCall.name === "create_follow_up_task") {
    const result = await pool.query(
      `INSERT INTO agent_tasks (
        client_id,
        action,
        status
      )
      VALUES ($1, $2, $3)
      RETURNING *`,
      [
        clientId,
        argumentsData.action,
        "OPEN",
      ]
    );

    return {
      success: true,
      tool: toolCall.name,
      task: result.rows[0],
    };
  }

  if (toolCall.name === "update_client_status") {
    const allowedStatuses = [
      "NOWY",
      "KONTAKT",
      "ZAINTERESOWANY",
      "ZAMKNIĘTY",
    ];

    if (!allowedStatuses.includes(argumentsData.status)) {
      return {
        success: false,
        error: "Nieprawidłowy status klienta",
      };
    }

    const result = await pool.query(
      `UPDATE clients
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [
        argumentsData.status,
        clientId,
      ]
    );

    return {
      success: true,
      tool: toolCall.name,
      client: result.rows[0],
    };
  }

  return {
    success: false,
    error: "Nieznane narzędzie agenta",
  };
}

async function runClientAgent(
  client,
  pool,
  openai
) {
  const input = [
    {
      role: "user",
      content: `
Przeanalizuj klienta i wykonaj potrzebne działania w CRM.

Dane klienta:
Nazwa: ${client.name}
E-mail: ${client.email}
Notatka: ${client.note || "Brak"}
Status: ${client.status || "NOWY"}
Priorytet: ${client.priority || "ŚREDNI"}
AI Summary: ${client.summary || "Brak"}
Next action: ${client.next_action || "Brak"}

Zasady:
1. Utwórz jedno konkretne zadanie kontaktowe.
2. Jeżeli status to NOWY, zmień go na KONTAKT.
3. Po wykonaniu działań zakończ pracę krótkim podsumowaniem.
`,
    },
  ];

  const completedActions = [];

  for (let step = 1; step <= 4; step += 1) {
    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      reasoning: {
        effort: "none",
      },

      instructions:
        "Jesteś agentem sprzedażowym działającym w CRM. " +
        "Korzystaj z dostępnych narzędzi, wykonuj działania " +
        "i sprawdzaj ich wyniki przed zakończeniem.",

      tools: AGENT_TOOLS,
      input,
    });

    input.push(...response.output);

    const toolCalls = response.output.filter(
      (item) => item.type === "function_call"
    );

    if (toolCalls.length === 0) {
      return {
        success: true,
        steps: step,
        completedActions,
        finalMessage:
          response.output_text ||
          "Agent zakończył pracę.",
      };
    }

    for (const toolCall of toolCalls) {
      const toolResult = await executeAgentTool(
        toolCall,
        client.id,
        pool
      );

      completedActions.push(toolResult);

      input.push({
        type: "function_call_output",
        call_id: toolCall.call_id,
        output: JSON.stringify(toolResult),
      });
    }
  }

  return {
    success: true,
    steps: 4,
    completedActions,
    finalMessage:
      "Agent osiągnął maksymalną liczbę kroków.",
  };
}

module.exports = {
  runClientAgent,
};