import { assign, setup } from "xstate";
import { filterTodos } from "./filter-todos";
import type { Todo, TodosFilter } from "./types";

export const todosMachine = setup({
	types: {} as {
		context: {
			todo: string;
			todos: Todo[];
			filter: TodosFilter;
			todoToEdit: Todo | null;
		};
		events:
			| { type: "START_EDITING"; id: Todo["id"] }
			| { type: "UPDATE_TODO" }
			| { type: "END_EDITING" }
			| { type: "ADD_TODO" }
			| { type: "NEW_TODO_CHANGE"; title: string }
			| { type: "EDIT_TODO_CHANGE"; title: string }
			| { type: "DELETE_TODO"; id: Todo["id"] }
			| { type: "TOGGLE_TODO_STATUS"; id: Todo["id"] }
			| { type: "FILTER_TODOS"; filter: TodosFilter }
			| { type: "MARK_ALL"; filter: "active" | "completed" }
			| { type: "CLEAR_COMPLETED" };
	},
}).createMachine({
	id: "todoMachine",
	initial: "working",
	context: {
		todos: [],
		todo: "",
		filter: "all",
		todoToEdit: null,
	},
	states: {
		working: {
			on: {
				START_EDITING: {
					target: "editing",
					actions: assign({
						todoToEdit: ({ context, event }) =>
							context.todos.find(({ id }) => id === event.id) ?? null,
					}),
				},
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
				MARK_ALL: {
					actions: assign({
						todos: ({ context, event }) =>
							filterTodos(context.todos, context.filter).map((todoItem) => ({
								...todoItem,
								done: event.filter === "completed",
							})),
					}),
				},
				CLEAR_COMPLETED: {
					guard: ({ context }) =>
						!!context.todos.filter((todoItem) => todoItem.done).length,
					actions: assign({
						todos: ({ context }) =>
							context.todos.map((todoItem) => ({ ...todoItem, done: false })),
					}),
				},
			},
		},
		editing: {
			exit: assign({
				todoToEdit: () => null,
			}),
			on: {
				END_EDITING: {
					target: "working",
				},
				EDIT_TODO_CHANGE: {
					guard: ({ context }) => !!context?.todoToEdit,
					actions: assign({
						todoToEdit: ({ event, context }) => {
							if (!context.todoToEdit) return null;
							return {
								...context.todoToEdit,
								title: event.title,
							};
						},
					}),
				},
				UPDATE_TODO: {
					guard: ({ context }) => !!context?.todoToEdit,
					actions: assign({
						todos: ({ context }) =>
							context.todos.map((todo) => {
								const todoToEdit = context.todoToEdit;
								if (todo.id === todoToEdit?.id) {
									return {
										...todo,
										title: todoToEdit.title,
										done: false,
									};
								}
								return todo;
							}),
					}),
				},
			},
		},
	},
});
