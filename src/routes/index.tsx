import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { useMachine } from "@xstate/react";
import type { ChangeEvent, FormEvent } from "react";
import { assign, setup } from "xstate";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

interface Todo {
	title: string;
	done: boolean;
	id: number;
}
export type TodosFilter = "all" | "active" | "completed";

const todoMachine = setup({
	types: {} as {
		context: {
			todo: string;
			todos: Todo[];
			filter: TodosFilter;
		};
		events:
			| { type: "ADD_TODO" }
			| { type: "NEW_TODO_CHANGE"; title: string }
			| { type: "DELETE_TODO"; id: number }
			| { type: "TOGGLE_TODO_STATUS"; id: number }
			| { type: "FILTER_TODOS"; filter: TodosFilter };
	},
}).createMachine({
	id: "todoMachine",
	initial: "editing",
	context: {
		todos: [],
		todo: "",
		filter: "all",
	},
	states: {
		editing: {
			on: {
				NEW_TODO_CHANGE: {
					actions: assign({
						todo: ({ event }) => event.title,
					}),
				},
				ADD_TODO: {
					guard: ({ context }) => !!context.todo.trim().length,
					actions: assign({
						todos: ({ context: { todos, todo } }) => {
							return [
								{
									title: todo,
									done: false,
									id: Date.now(),
								},
								...todos,
							];
						},
						todo: "",
					}),
				},
				DELETE_TODO: {
					actions: assign({
						todos: ({ context: { todos }, event }) =>
							todos.filter((currTodo) => currTodo.id !== event.id),
					}),
				},
				TOGGLE_TODO_STATUS: {
					actions: assign({
						todos: ({ context: { todos }, event }) =>
							todos.map((currTodo) =>
								currTodo.id === event.id
									? {
											...currTodo,
											done: !currTodo.done,
										}
									: currTodo,
							),
					}),
				},
				FILTER_TODOS: {
					actions: assign({
						filter: ({ event }) => event.filter,
					}),
				},
			},
		},
		working: {},
	},
});

function RouteComponent() {
	const [snapshot, send] = useMachine(todoMachine);
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

	const handleTodosFilter = (filter: TodosFilter) => {
		send({
			type: "FILTER_TODOS",
			filter,
		});
	};

	const filteredTodos = snapshot.context.todos.filter((todo) => {
		// Handle active filter
		if (snapshot.context.filter === "active") return !todo.done;
		// Handle completed filter
		if (snapshot.context.filter === "completed") return todo.done;
		// Handle all filter
		return todo;
	});

	return (
		<div className="mx-auto py-4 max-w-96 flex flex-col gap-y-4">
			<form className="flex flex-col gap-y-4" onSubmit={handleAddNewTodo}>
				<Input onChange={handleInputChange} value={snapshot.context.todo} />
				<Button disabled={!snapshot.context.todo.trim()} type="submit">
					Add Todo
				</Button>
			</form>

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
					<ul>
						{filteredTodos.map((todo) => {
							return (
								<li
									key={todo.id}
									className="flex items-center justify-between gap-x-2 py-1 not-last:border-b-2"
								>
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
						})}
					</ul>
				</div>
			)}
		</div>
	);
}
