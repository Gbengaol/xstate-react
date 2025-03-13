import type { Todo } from "@/lib/types";
import { FilePenLineIcon, TrashIcon } from "lucide-react";
import { TodosMachineContext } from "./todo-machine.context";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

interface TodoProps {
	todo: Todo;
}

export const TodoItem: React.FC<TodoProps> = ({ todo }) => {
	const actorRef = TodosMachineContext.useActorRef();
	const { send } = actorRef;

	const handleToggleDone = (id: Todo["id"]) => {
		send({
			type: "TOGGLE_TODO_STATUS",
			id,
		});
	};

	const handleTodoDelete = (id: Todo["id"]) => {
		send({
			type: "DELETE_TODO",
			id,
		});
	};

	const handleEditTodo = (id: Todo["id"]) => {
		send({
			type: "START_EDITING",
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
			<span className="flex items-center space-x-1">
				<Button
					variant="secondary"
					size="icon"
					onClick={() => handleEditTodo(todo.id)}
				>
					<FilePenLineIcon />
				</Button>
				<Button
					variant="destructive"
					size="icon"
					onClick={() => handleTodoDelete(todo.id)}
				>
					<TrashIcon />
				</Button>
			</span>
		</li>
	);
};
