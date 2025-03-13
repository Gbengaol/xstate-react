import { todosMachine } from "@/lib/todosMachine";
import { createActorContext } from "@xstate/react";

const persistedTodosMachine = localStorage.getItem("todos");
export const TodosMachineContext = createActorContext(todosMachine, {
	snapshot: persistedTodosMachine
		? JSON.parse(persistedTodosMachine)
		: undefined,
});
