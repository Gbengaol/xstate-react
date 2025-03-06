import { createFileRoute } from "@tanstack/react-router";
import { createActorContext } from "@xstate/react";
import { todosMachine } from "@/lib/todosMachine";
import { Todos } from "@/components/Todos";

export const TodosContext = createActorContext(todosMachine, {
  state: JSON.parse(localStorage.getItem("todos") || "null"),
});

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="flex mx-auto flex-col max-w-[600px] py-5">
      <TodosContext.Provider>
        <Todos />
      </TodosContext.Provider>
    </div>
  );
}
