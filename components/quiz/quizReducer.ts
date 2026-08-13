import { QUIZ_STEPS } from "@/lib/quizSteps";

export type QuizState = {
  stepIndex: number;
  answers: Record<string, string>;
  done: boolean;
};

export type QuizAction =
  | { type: "answer"; stepId: string; value: string }
  | { type: "back" }
  | { type: "reset" };

export const initialQuizState: QuizState = {
  stepIndex: 0,
  answers: {},
  done: false,
};

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "answer": {
      const answers = { ...state.answers, [action.stepId]: action.value };
      const next = state.stepIndex + 1;
      return {
        answers,
        stepIndex: Math.min(next, QUIZ_STEPS.length - 1),
        done: next >= QUIZ_STEPS.length,
      };
    }
    case "back":
      // From the result screen, "back" returns to the LAST question rather
      // than the one before it: on the final step `stepIndex` already points
      // at the last question, so decrementing here would silently skip it.
      if (state.done) return { ...state, done: false };
      return { ...state, stepIndex: Math.max(0, state.stepIndex - 1) };
    case "reset":
      return initialQuizState;
  }
}
