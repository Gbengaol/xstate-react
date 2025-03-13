import type { ChangeEvent, FormEvent } from "react";
import { TodosMachineContext } from "./todo-machine.context";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const EditTodo = () => {
	const actorRef = TodosMachineContext.useActorRef();
	const { send } = actorRef;
	const todoToEdit = TodosMachineContext.useSelector(
		({ context }) => context?.todoToEdit ?? null,
	);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		send({
			type: "EDIT_TODO_CHANGE",
			title: e.currentTarget.value,
		});
	};
	const handleUpdateTodo = (e: FormEvent) => {
		e.preventDefault();
		send({
			type: "UPDATE_TODO",
		});
		send({
			type: "END_EDITING",
		});
	};
	return (
		<form className="flex flex-col gap-y-4" onSubmit={handleUpdateTodo}>
			<Input onChange={handleInputChange} value={todoToEdit?.title ?? ""} />
			<Button disabled={!todoToEdit?.title.trim()} type="submit">
				Update Todo
			</Button>
		</form>
	);
};
