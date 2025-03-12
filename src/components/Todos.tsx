import { filterTodos } from "@/lib/filter-todos";
import type { TodosFilter } from "@/lib/types";
import { useEffect } from "react";
import { TodoItem } from "./Todo";
import { TodosMachineContext } from "./todo-machine.context";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export const Todos = () => {
	const actorRef = TodosMachineContext.useActorRef();
	const { send } = actorRef;
	const todos = TodosMachineContext.useSelector(({ context }) => context.todos);
	const filter = TodosMachineContext.useSelector(
		({ context }) => context.filter,
	);
	// Persist todos
	useEffect(() => {
		actorRef.subscribe(() => {
			localStorage.setItem(
				"todos",
				JSON.stringify(actorRef.getPersistedSnapshot?.()),
			);
		});
	}, [actorRef]);

	const handleTodosFilter = (filter: TodosFilter) => {
		send({
			type: "FILTER_TODOS",
			filter,
		});
	};

	const filteredTodos = filterTodos(todos, filter);
	const numActiveTodos = todos.filter((todo) => !todo.done).length;
	const showTodosResetButton =
		filter !== "active" && todos.length > numActiveTodos;
	const allCompleted = todos.length > 0 && numActiveTodos === 0;
	const markFilter = !allCompleted ? "completed" : "active";

	const handleMarkAllTodos = () => {
		send({
			type: "MARK_ALL",
			filter: markFilter,
		});
	};

	const handleTodosReset = () => {
		send({
			type: "CLEAR_COMPLETED",
		});
	};
	return (
		<>
			<Tabs defaultValue="all" className="w-full">
				<TabsList className="w-full">
					<TabsTrigger value="all" onClick={() => handleTodosFilter("all")}>
						All
					</TabsTrigger>
					<TabsTrigger
						value="active"
						onClick={() => handleTodosFilter("active")}
					>
						Active
					</TabsTrigger>
					<TabsTrigger
						value="completed"
						onClick={() => handleTodosFilter("completed")}
					>
						Completed
					</TabsTrigger>
				</TabsList>
			</Tabs>

			{!!filteredTodos.length && (
				<div className="flex flex-col gap-y-2">
					<div className="flex items-center justify-between">
						<span className="flex items-center gap-x-1.5 h-8">
							<Checkbox
								checked={false}
								onCheckedChange={handleMarkAllTodos}
								className="size-6"
							/>
							<small className="text-gray-700">
								{markFilter === "completed" ? "Check all" : "Uncheck all"}
							</small>
						</span>
						{showTodosResetButton && (
							<Button
								size="sm"
								className="h-full"
								variant={"outline"}
								onClick={handleTodosReset}
							>
								Reset
							</Button>
						)}
					</div>
					<ul>
						{filteredTodos.map((todo) => {
							return <TodoItem todo={todo} key={todo.id} />;
						})}
					</ul>
				</div>
			)}
		</>
	);
};
