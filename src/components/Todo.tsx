import type { Todo } from "@/lib/types";
import { TodosMachineContext } from "./todo-machine.context";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

interface TodoProps {
	todo: Todo;
}

export const TodoItem: React.FC<TodoProps> = ({ todo }) => {
	const actorRef = TodosMachineContext.useActorRef();
	const { send } = actorRef;

	const handleToggleDone = (id: number) => {
		send({
			type: "TOGGLE_TODO_STATUS",
			id,
		});
	};

	const handleTodoDelete = (id: number) => {
		send({
			type: "DELETE_TODO",
			id,
		});
	};

	return (
		<li className="flex items-center justify-between gap-x-2 py-1 not-last:border-b-2">
			<span className="flex items-center gap-2">
				<Checkbox
					checked={todo.done}
					onCheckedChange={() => handleToggleDone(todo.id)}
					className="size-6"
				/>
				{todo.title}
			</span>
			<Button
				variant="destructive"
				size="sm"
				onClick={() => handleTodoDelete(todo.id)}
			>
				Delete
			</Button>
		</li>
	);
};
