
export const models = [
  { name: 'xAI: Grok 4.1 Fast', id: 'x-ai/grok-4.1-fast', inputCost: 0, outputCost: 0, contextTokens: 2000000 },
  { name: 'xAI: Grok 4.1 Fast (free)', id: 'x-ai/grok-4.1-fast:free', inputCost: 0, outputCost: 0, contextTokens: 2000000 },
  { name: 'Kwaipilot: KAT-Coder-Pro V1 (free)', id: 'kwaipilot/kat-coder-pro:free', inputCost: 0, outputCost: 0, contextTokens: 256000 },
  { name: 'NVIDIA: Nemotron Nano 12B 2 VL (free)', id: 'nvidia/nemotron-nano-12b-v2-vl:free', inputCost: 0, outputCost: 0, contextTokens: 128000 },
  { name: 'Tongyi DeepResearch 30B A3B (free)', id: 'alibaba/tongyi-deepresearch-30b-a3b:free', inputCost: 0, outputCost: 0, contextTokens: 131072 },
  { name: 'Meituan: LongCat Flash Chat (free)', id: 'meituan/longcat-flash-chat:free', inputCost: 0, outputCost: 0, contextTokens: 131072 },
  { name: 'NVIDIA: Nemotron Nano 9B V2 (free)', id: 'nvidia/nemotron-nano-9b-v2:free', inputCost: 0, outputCost: 0, contextTokens: 128000 },
  { name: 'OpenAI: gpt-oss-20b (free)', id: 'openai/gpt-oss-20b:free', inputCost: 0, outputCost: 0, contextTokens: 131072 },
  { name: 'Z.AI: GLM 4.5 Air (free)', id: 'z-ai/glm-4.5-air:free', inputCost: 0, outputCost: 0, contextTokens: 131072 },
  { name: 'Qwen: Qwen3 Coder 480B A35B (free)', id: 'qwen/qwen3-coder:free', inputCost: 0, outputCost: 0, contextTokens: 262000 },
  { name: 'MoonshotAI: Kimi K2 0711 (free)', id: 'moonshotai/kimi-k2:free', inputCost: 0, outputCost: 0, contextTokens: 32768 },
  { name: 'Venice: Uncensored (free)', id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', inputCost: 0, outputCost: 0, contextTokens: 32768 },
  { name: 'Google: Gemma 3n 2B (free)', id: 'google/gemma-3n-e2b-it:free', inputCost: 0, outputCost: 0, contextTokens: 8192 },
  { name: 'TNG: DeepSeek R1T2 Chimera (free)', id: 'tngtech/deepseek-r1t2-chimera:free', inputCost: 0, outputCost: 0, contextTokens: 163840 },
  { name: 'Mistral: Mistral Small 3.2 24B (free)', id: 'mistralai/mistral-small-3.2-24b-instruct:free', inputCost: 0, outputCost: 0, contextTokens: 131072 },
  { name: 'DeepSeek: DeepSeek R1 0528 Qwen3 8B (free)', id: 'deepseek/deepseek-r1-0528-qwen3-8b:free', inputCost: 0, outputCost: 0, contextTokens: 131072 },
  { name: 'DeepSeek: R1 0528 (free)', id: 'deepseek/deepseek-r1-0528:free', inputCost: 0, outputCost: 0, contextTokens: 163840 },
  { name: 'Google: Gemma 3n 4B (free)', id: 'google/gemma-3n-e4b-it:free', inputCost: 0, outputCost: 0, contextTokens: 8192 },
  { name: 'Qwen: Qwen3 4B (free)', id: 'qwen/qwen3-4b:free', inputCost: 0, outputCost: 0, contextTokens: 40960 },
  { name: 'Qwen: Qwen3 30B A3B (free)', id: 'qwen/qwen3-30b-a3b:free', inputCost: 0, outputCost: 0, contextTokens: 40960 },
  { name: 'Qwen: Qwen3 14B (free)', id: 'qwen/qwen3-14b:free', inputCost: 0, outputCost: 0, contextTokens: 40960 },
  { name: 'Qwen: Qwen3 235B A22B (free)', id: 'qwen/qwen3-235b-a22b:free', inputCost: 0, outputCost: 0, contextTokens: 40960 },
  { name: 'TNG: DeepSeek R1T Chimera (free)', id: 'tngtech/deepseek-r1t-chimera:free', inputCost: 0, outputCost: 0, contextTokens: 163840 },
  { name: 'Microsoft: MAI DS R1 (free)', id: 'microsoft/mai-ds-r1:free', inputCost: 0, outputCost: 0, contextTokens: 163840 },
  { name: 'ArliAI: QwQ 32B RpR v1 (free)', id: 'arliai/qwq-32b-arliai-rpr-v1:free', inputCost: 0, outputCost: 0, contextTokens: 32768 },
  { name: 'Qwen: Qwen2.5 VL 32B Instruct (free)', id: 'qwen/qwen2.5-vl-32b-instruct:free', inputCost: 0, outputCost: 0, contextTokens: 16384 },
  { name: 'DeepSeek: DeepSeek V3 0324 (free)', id: 'deepseek/deepseek-chat-v3-0324:free', inputCost: 0, outputCost: 0, contextTokens: 163840 },
  { name: 'Mistral: Mistral Small 3.1 24B (free)', id: 'mistralai/mistral-small-3.1-24b-instruct:free', inputCost: 0, outputCost: 0, contextTokens: 96000 },
  { name: 'Google: Gemma 3 4B (free)', id: 'google/gemma-3-4b-it:free', inputCost: 0, outputCost: 0, contextTokens: 32768 },
  { name: 'Google: Gemma 3 12B (free)', id: 'google/gemma-3-12b-it:free', inputCost: 0, outputCost: 0, contextTokens: 32768 },
  { name: 'Google: Gemma 3 27B (free)', id: 'google/gemma-3-27b-it:free', inputCost: 0, outputCost: 0, contextTokens: 131072 },
  { name: 'Mistral: Mistral Small 3 (free)', id: 'mistralai/mistral-small-24b-instruct-2501:free', inputCost: 0, outputCost: 0, contextTokens: 32768 },
  { name: 'DeepSeek: R1 Distill Llama 70B (free)', id: 'deepseek/deepseek-r1-distill-llama-70b:free', inputCost: 0, outputCost: 0, contextTokens: 8192 },
  { name: 'DeepSeek: R1 (free)', id: 'deepseek/deepseek-r1:free', inputCost: 0, outputCost: 0, contextTokens: 163840 },
  { name: 'Google: Gemini 2.0 Flash Experimental (free)', id: 'google/gemini-2.0-flash-exp:free', inputCost: 0, outputCost: 0, contextTokens: 1048576 },
  { name: 'Meta: Llama 3.3 70B Instruct (free)', id: 'meta-llama/llama-3.3-70b-instruct:free', inputCost: 0, outputCost: 0, contextTokens: 131072 },
  { name: 'Qwen2.5 Coder 32B Instruct (free)', id: 'qwen/qwen-2.5-coder-32b-instruct:free', inputCost: 0, outputCost: 0, contextTokens: 32768 },
  { name: 'Meta: Llama 3.2 3B Instruct (free)', id: 'meta-llama/llama-3.2-3b-instruct:free', inputCost: 0, outputCost: 0, contextTokens: 131072 },
  { name: 'Qwen2.5 72B Instruct (free)', id: 'qwen/qwen-2.5-72b-instruct:free', inputCost: 0, outputCost: 0, contextTokens: 32768 },
  { name: 'Nous: Hermes 3 405B Instruct (free)', id: 'nousresearch/hermes-3-llama-3.1-405b:free', inputCost: 0, outputCost: 0, contextTokens: 131072 },
  { name: 'Mistral: Mistral Nemo (free)', id: 'mistralai/mistral-nemo:free', inputCost: 0, outputCost: 0, contextTokens: 131072 },
  { name: 'Mistral: Mistral 7B Instruct (free)', id: 'mistralai/mistral-7b-instruct:free', inputCost: 0, outputCost: 0, contextTokens: 32768 },
];

export const getModel = (prompt: string) => {
  const promptLength = prompt.length;
  if (promptLength > 100000) {
    return models.find(m => m.id === 'x-ai/grok-4.1-fast:free') || models[0];
  } else if (promptLength > 30000) {
    return models.find(m => m.id === 'qwen/qwen3-coder:free') || models[0];
  } else {
    return models.find(m => m.id === 'google/gemini-2.0-flash-exp:free') || models[0];
  }
};

export const getFallbackModel = (currentModelId: string) => {
  const currentIndex = models.findIndex(m => m.id === currentModelId);
  return models[currentIndex + 1] || models[0];
};
