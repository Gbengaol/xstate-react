import type { Todo, TodosFilter } from "./types";

export const filterTodos = (todos: Todo[], filter: TodosFilter) =>
	todos.filter((todo) => {
		// Handle active filter
		if (filter === "active") return !todo.done;
		// Handle completed filter
		if (filter === "completed") return todo.done;
		// Handle all filter
		return todo;
	});
