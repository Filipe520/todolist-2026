import { AppProvider } from "./AppProvider";
import TodoList from "./components/TodoList";

export default function AppTodoList() {
  return (
    <AppProvider>
      <TodoList />
    </AppProvider>
  );
}
