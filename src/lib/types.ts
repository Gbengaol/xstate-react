interface Todo {
	title: string;
	done: boolean;
	id: number;
}
type TodosFilter = "all" | "active" | "completed";

export type { Todo, TodosFilter };
