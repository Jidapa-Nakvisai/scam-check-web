export type AIResponse = {
  prediction: "SCAM" | "NOT_SCAM";
  confidence: number;
  reason: string;
}
export type Message = {
  id: number;
  role: string;
  text: string;
  timestamp: number;
}

