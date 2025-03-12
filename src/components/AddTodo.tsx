import type { ChangeEvent, FormEvent } from "react";
import { TodosMachineContext } from "./todo-machine.context";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const AddTodo = () => {
	const actorRef = TodosMachineContext.useActorRef();
	const { send } = actorRef;
	const todo = TodosMachineContext.useSelector(({ context }) => context.todo);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		send({
			type: "NEW_TODO_CHANGE",
			title: e.currentTarget.value,
		});
	};
	const handleAddNewTodo = (e: FormEvent) => {
		e.preventDefault();
		send({
			type: "ADD_TODO",
		});
	};
	return (
		<form className="flex flex-col gap-y-4" onSubmit={handleAddNewTodo}>
			<Input onChange={handleInputChange} value={todo} />
			<Button disabled={!todo.trim()} type="submit">
				Add Todo
			</Button>
		</form>
	);
};
