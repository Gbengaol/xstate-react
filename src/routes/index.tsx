import { AddTodo } from "@/components/AddTodo";
import { EditTodo } from "@/components/EditTodo";
import { Todos } from "@/components/Todos";
import { TodosMachineContext } from "@/components/todo-machine.context";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const isEditing = TodosMachineContext.useSelector((state) =>
		state.matches("editing"),
	);
	return (
		<div className="mx-auto py-4 max-w-[480px] flex flex-col gap-y-4">
			{isEditing ? (
				<EditTodo />
			) : (
				<>
					<AddTodo />
					<Todos />
				</>
			)}
		</div>
	);
}
