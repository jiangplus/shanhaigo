import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";
import { useMUD } from "./MUDContext";
import { MonsterCatchResult } from "./monsterCatchResult";

type Props = {
  monsterName: string;
  monsterEmoji: string;
};

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
        "flex flex-col gap-10 items-center justify-center bg-black text-white transition-opacity duration-1000",
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
            const toastId = toast.loading("Throwing emojiball…");
            const result = await throwBall();
            let yourname = prompt("何时何地让你感觉到最快乐")
            console.log('yourname', yourname)

// 1. 你最珍惜的财产是什么
// 2. 何时何地让你感觉到最快乐
// 3. 你的座右铭是什么

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
