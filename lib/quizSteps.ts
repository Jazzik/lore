export type QuizStep = {
  id: "niche" | "audience" | "engagement" | "budget";
  /** Ключ в messages: quiz.steps.<id>.question и quiz.steps.<id>.options.<option> */
  options: readonly string[];
};

export const QUIZ_STEPS: readonly QuizStep[] = [
  { id: "niche", options: ["beauty", "lifestyle", "gaming", "education", "other"] },
  { id: "audience", options: ["lt50k", "50k-200k", "200k-1m", "gt1m"] },
  { id: "engagement", options: ["low", "medium", "high"] },
  { id: "budget", options: ["none", "some", "ready"] },
] as const;
