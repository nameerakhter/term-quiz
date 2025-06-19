import * as p from "@clack/prompts";
import color from "picocolors";
import { quizQuestions } from "./constants";

interface MultipleChoiceQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}
let score = 0;

class Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;

  constructor(data: MultipleChoiceQuestion) {
    this.question = data.question;
    this.options = data.options;
    this.correctAnswerIndex = data.correctAnswerIndex;
  }

  checkAnswer(selectedIndex: number) {
    return selectedIndex === this.correctAnswerIndex;
  }
}

async function askQuestions(quizQuestions: Question[]) {
  for (const question of quizQuestions) {
    const answer = await p.select({
      message: question.question,
      options: question.options.map((option) => ({
        value: option,
        label: option,
      })),
    });

    if (p.isCancel(answer)) {
      p.cancel("You cancelled the quiz.");
      return process.exit(0);
    }

    const s = p.spinner();
    s.start();
    await new Promise((resolve) => setTimeout(resolve, 1500));
    s.stop();

    if (answer === question.options[question.correctAnswerIndex]) {
      p.note(color.green("Correct!"), "Result");
      score++;
    } else {
      p.note(
        color.red("Incorrect! ") +
          `The correct answer was: ${color.cyan(
            question.options[question.correctAnswerIndex]
          )}`,
        "Result"
      );
    }
  }
}

async function main() {
  console.log(
    color.cyan(`
		████████╗███████╗██████╗ ███╗   ███╗      ██████╗ ██╗   ██╗██╗███████╗
		╚══██╔══╝██╔════╝██╔══██╗████╗ ████║     ██╔═══██╗██║   ██║██║╚══███╔╝
		   ██║   █████╗  ██████╔╝██╔████╔██║     ██║   ██║██║   ██║██║  ███╔╝ 
		   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║     ██║▄▄ ██║██║   ██║██║ ███╔╝  
		   ██║   ███████╗██║  ██║██║ ╚═╝ ██║     ╚██████╔╝╚██████╔╝██║███████╗
		   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝      ╚══▀▀═╝  ╚═════╝ ╚═╝╚══════╝
		`)
  );

  p.intro(`${color.bgMagenta(color.black("Welcome to term-quiz"))}`);

  const questions: Question[] = quizQuestions.map(
    (question) => new Question(question)
  );
  await askQuestions(questions);

  p.outro(
    `${color.bgMagenta(
      color.black(`Quiz finished! Your score: ${score}/${quizQuestions.length}`)
    )}`
  );
}
main().catch(console.error);
