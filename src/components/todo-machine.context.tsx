import { todosMachine } from "@/lib/todosMachine";
import { createActorContext } from "@xstate/react";

export const TodosMachineContext = createActorContext(todosMachine, {
	snapshot: JSON.parse(localStorage.getItem("todos") || "null"),
});
