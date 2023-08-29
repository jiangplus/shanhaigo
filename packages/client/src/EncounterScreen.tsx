import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";
import { useMUD } from "./MUDContext";
import { MonsterCatchResult } from "./monsterCatchResult";

type Props = {
  monsterName: string;
  monsterEmoji: string;
};

const questions = [
  "你最珍惜的财产是什么",
  "何时何地让你感觉到最快乐",
  "你的座右铭是什么",
]

let index = 0

export const EncounterScreen = ({ monsterName, monsterEmoji }: Props) => {
  const {
    systemCalls: { throwBall, fleeEncounter },
  } = useMUD();

  const [appear, setAppear] = useState(false);
  useEffect(() => {
    // sometimes the fade-in transition doesn't play, so a timeout is a hacky fix
    const timer = setTimeout(() => setAppear(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={twMerge(
        appear ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="text-8xl animate-bounce"><img width="200" src="https://go.shanhaiwoo.com/jelly.svg" /></div>
      <div>出现一块水母碎片!</div>

      <div className="flex gap-2">
        <button
          type="button"
          className="bg-stone-600 hover:ring rounded-lg px-4 py-2"
          onClick={async () => {
            if (index === 3) {
              // open the final scene
              let answer = `
在人生的征途中，请牢记世上无难事，只要心怀决心和坚定毅力。踏着这信念，你定能战胜一切困境。而当你感到疲惫时，不妨去亲近大自然的怀抱，那里有宁静的湖泊、欢乐的鸟语，能为你带来无限的快乐与宁静，让心灵重新充盈，继续前行的脚步。
              `
              alert(answer)
              return
            }

            const toastId = toast.loading("Throwing emojiball…");
            const result = await throwBall();
            let yourname = prompt(questions[index++])
            console.log('yourname', yourname)


            if (result === MonsterCatchResult.Caught) {
              toast.update(toastId, {
                isLoading: false,
                type: "success",
                render: `你收集了水母碎片!`,
                autoClose: 5000,
                closeButton: true,
              });
            } else if (result === MonsterCatchResult.Fled) {
              toast.update(toastId, {
                isLoading: false,
                type: "default",
                render: `水母碎片游走了！`,
                autoClose: 5000,
                closeButton: true,
              });
            } else if (result === MonsterCatchResult.Missed) {
              toast.update(toastId, {
                isLoading: false,
                type: "error",
                render: "你错过了!",
                autoClose: 5000,
                closeButton: true,
              });
            } else {
              throw new Error(
                `Unexpected catch attempt result: ${MonsterCatchResult[result]}`
              );
            }
          }}
        >
          ☄️ 收集碎片
        </button>
        <button
          type="button"
          className="bg-stone-800 hover:ring rounded-lg px-4 py-2"
          onClick={async () => {
            const toastId = toast.loading("Running away…");
            await fleeEncounter();
            toast.update(toastId, {
              isLoading: false,
              type: "default",
              render: `你离开了!`,
              autoClose: 5000,
              closeButton: true,
            });
          }}
        >
          🏃‍♂️ 不需要
        </button>
      </div>
    </div>
  );
};
