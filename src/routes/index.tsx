import { AddTodo } from "@/components/AddTodo";
import { Todos } from "@/components/Todos";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="mx-auto py-4 max-w-96 flex flex-col gap-y-4">
			<AddTodo />
			<Todos />
		</div>
	);
}
