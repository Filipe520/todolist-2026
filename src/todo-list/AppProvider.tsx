import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useRef,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import { v4 as uuidv4 } from "uuid";

// Hook de Tempo isolado (fora do componente seguindo as regras do React)
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Tipagem da Prioridade da Tarefa
export interface PropArrPriority {
  key: "hight" | "middle" | "low";
  label: "Média (padrão)" | "Baixa" | "Alto";
}

// Tipagem das Tarefas
export interface PropTodoList {
  id: string;
  task: string;
  completed: boolean;
  active: boolean;
  priority: PropArrPriority;
  date: string;
}

// Tipagem do Filtro
export interface PropFilter {
  key: string;
  label: string;
}

// 1. Defina a tipagem de tudo o que estará disponível no Contexto
interface AppContextType {
  checkoutRecover: () => void;
  clearSelects: () => void;
  trashCan: (taskID: string) => void;
  addTask: () => void;
  btnSearch: () => void;
  handleSearch: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  arrPriority: readonly PropArrPriority[];

  // States principais
  todos: PropTodoList[];
  itensSelects: PropTodoList[];
  setTodos: Dispatch<SetStateAction<PropTodoList[]>>;
  trash: PropTodoList[];
  setTrash: Dispatch<SetStateAction<PropTodoList[]>>;
  resSearch: PropTodoList[];
  setResSearch: Dispatch<SetStateAction<PropTodoList[]>>;
  filterBtn: PropFilter;
  setFilterBtn: Dispatch<SetStateAction<PropFilter>>;

  // Outros States necessários para os inputs e modais
  task: string;
  setTask: Dispatch<SetStateAction<string>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  inputSearch: string;
  setKeyBtnPriority: Dispatch<SetStateAction<string>>;
  keyBtnPriority: string;
  setInputSearch: Dispatch<SetStateAction<string>>;

  editTask: boolean;
  setEditTask: Dispatch<SetStateAction<boolean>>;
  modalStatus: boolean;
  setModalStatus: Dispatch<SetStateAction<boolean>>;
  statusTrashCan: boolean;
  setStatusTrashCan: Dispatch<SetStateAction<boolean>>;
  btnMiddleTask: boolean;
  setBtnMiddleTask: Dispatch<SetStateAction<boolean>>;
  btnFilters: boolean;
  setBtnFilters: Dispatch<SetStateAction<boolean>>;
  btnEnterEditTask: boolean;
  setBtnEnterEditTask: Dispatch<SetStateAction<boolean>>;

  // Refs
  refInputTask: React.RefObject<HTMLInputElement>;
  refModalEdit: React.RefObject<HTMLDivElement>;

  // Numbers
  PercentageProgressBar: number;
  totItens: number;
  totCompleted: number;
  resControl: PropTodoList[];
}

// 2. Crie o Contexto com um valor inicial padrão
const AppContext = createContext<AppContextType | undefined>(undefined);

// 3. Crie o componente Provider
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // States / Refs
  const [todos, setTodos] = useState<PropTodoList[]>([]);
  const [trash, setTrash] = useState<PropTodoList[]>([]);
  const [resSearch, setResSearch] = useState<PropTodoList[]>([]);

  const [filterBtn, setFilterBtn] = useState<PropFilter>({
    key: "todos",
    label: "Todos",
  });
  const refInputTask = useRef<HTMLInputElement>(null);
  const refModalEdit = useRef<HTMLDivElement>(null);

  const [modalStatus, setModalStatus] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [statusTrashCan, setStatusTrashCan] = useState(false);
  const [btnMiddleTask, setBtnMiddleTask] = useState(false);
  const [btnFilters, setBtnFilters] = useState(false);
  const [btnEnterEditTask, setBtnEnterEditTask] = useState(false);

  const [task, setTask] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [search, setSearch] = useState("");
  const [keyBtnPriority, setKeyBtnPriority] = useState("Média (padrão)");

  // Pegando data atual
  const dataBR = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date());

  // Adicionando nova tarefa
  const addTask = () => {
    if (!task) return;

    const key = uuidv4();
    setTodos((prev) => [
      ...prev,
      {
        task: task,
        id: key,
        completed: false,
        active: false,
        priority: { key: "middle", label: "Média (padrão)" },
        date: dataBR,
      },
    ]);
    setTask(""); // Limpa o input após adicionar
  };

  // Filtros de tarefas
  const taskCompleted = todos.filter((f) => f.completed);
  const taskActive = todos.filter((f) => !f.active && !f.completed);

  // Controle de arrays
  const controlTODO = () => {
    if (filterBtn.key === "todos") return todos;
    if (filterBtn.key === "assets") return taskActive;
    if (filterBtn.key === "completed") return taskCompleted;
    if (filterBtn.key === "trash") return trash;

    return todos;
  };

  // Tempo para modal de alertas
  useEffect(() => {
    if (modalStatus) {
      const timer = setTimeout(() => setModalStatus(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [modalStatus]);

  // Array de Prioridades com 'as const' para fixar os valores literais
  const arrPriority = [
    { key: "low", label: "Baixa" },
    { key: "middle", label: "Média (padrão)" },
    { key: "hight", label: "Alto" },
  ] as const;

  // Controle que vai trocar o array entre a pesquisa e os outros
  const resControl = inputSearch ? resSearch : controlTODO();

  // Dados da barra de progresso
  const totItens = todos.length;
  const totCompleted = todos.filter((item) => item.completed).length;
  const PercentageProgressBar =
    totItens > 0 ? (totCompleted / totItens) * 100 : 0;

  // Fecha o modal de Editar Tarefa ao clicar fora
  useEffect(() => {
    const clickDOM = (event: MouseEvent) => {
      if (
        refModalEdit.current &&
        !refModalEdit.current.contains(event.target as Node)
      ) {
        setEditTask(false);
      }
    };

    if (editTask) {
      document.addEventListener("mousedown", clickDOM);
    }

    return () => document.removeEventListener("mousedown", clickDOM);
  }, [editTask]);

  // Manipulação da pesquisa por teclado
  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;

    if (event.key === "Enter") {
      setInputSearch(target.value);
    }

    if (event.key === "Backspace" && target.value === "") {
      setInputSearch("");
    }
  };

  const btnSearch = () => {
    if (!search) return;
    setInputSearch(search);
  };

  // Efeito da Pesquisa com Debounce aplicado internamente
  const debouncedSearch = useDebounce(inputSearch, 300);
  useEffect(() => {
    if (debouncedSearch) {
      setResSearch(
        controlTODO().filter((f) =>
          f.task.toLowerCase().includes(debouncedSearch.toLowerCase()),
        ),
      );
    } else {
      setResSearch([]);
    }
  }, [debouncedSearch, todos, filterBtn.key]);

  // Enviar item para a lixeira
  const trashCan = (taskID: string) => {
    const newTrash = todos.filter((f) => f.id === taskID);
    setTrash((prev) => [...prev, ...newTrash]);
    setTodos(todos.filter((f) => f.id !== taskID));
  };

  // Recuperar ou mover em lote
  const itensSelects = resControl.filter((itens) => itens.completed);

  // Remove itens selecionados
  const clearSelects = () => {
    setTodos((prev) => prev.map((m) => ({ ...m, completed: false })));
  };

  // Adicionar os itens selecionados para a lixeira ou para o array principal
  const checkoutRecover = () => {
    const restoreItens = itensSelects.map((i) => ({
      ...i,
      completed: !i.completed,
    }));

    if (statusTrashCan) {
      setTodos((prev) => [...prev, ...restoreItens]);
      setTrash((prev) =>
        prev.filter((r) => !itensSelects.some((item) => item.id === r.id)),
      );
    } else {
      setTrash((prev) => [...prev, ...restoreItens]);
      setTodos((prev) =>
        prev.filter((r) => !itensSelects.some((item) => item.id === r.id)),
      );
    }
  };

  return (
    <AppContext.Provider
      value={{
        checkoutRecover,
        trashCan,
        btnSearch,
        handleSearch,
        arrPriority,
        addTask,
        todos,
        setTodos,
        trash,
        setTrash,
        resSearch,
        setResSearch,
        filterBtn,
        setFilterBtn,
        task,
        setTask,
        search,
        setSearch,
        inputSearch,
        setInputSearch,
        editTask,
        setEditTask,
        modalStatus,
        setModalStatus,
        refInputTask,
        refModalEdit,
        totItens,
        totCompleted,
        PercentageProgressBar,
        itensSelects,
        setStatusTrashCan,
        statusTrashCan,
        resControl,
        btnMiddleTask,
        setBtnMiddleTask,
        keyBtnPriority,
        setKeyBtnPriority,
        btnFilters,
        setBtnFilters,
        btnEnterEditTask,
        setBtnEnterEditTask,
        clearSelects,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// 4. Custom Hook para consumo
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp deve ser usado dentro de um AppProvider");
  }
  return context;
};
