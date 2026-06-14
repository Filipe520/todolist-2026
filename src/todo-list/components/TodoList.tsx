import { Button, Checkbox, Input } from "@heroui/react";
import { useApp, type PropTodoList } from "../AppProvider";
import BoxAlarm from "./boxAlarm";
import Search from "./Search";
import ProgressBar from "./ProgressBar";

export default function TodoList() {
  const {
    setStatusTrashCan,
    setFilterBtn,
    setModalStatus,
    modalStatus,
    addTask,
    setTask,
    refInputTask,
    task,
    checkoutRecover,
    resControl,
    statusTrashCan,
    setTrash,
    itensSelects,
    filterBtn,
    trash,
    setTodos,
    todos,
    setEditTask,
    editTask,
    trashCan,
    refModalEdit,
    setBtnMiddleTask,
    btnMiddleTask,
    keyBtnPriority,
    arrPriority,
    setKeyBtnPriority,
  } = useApp();

  const handleLayout = (title: string, array: PropTodoList[]) => {
    return (
      <div>
        <h2>Chegou em {title}</h2>
        {array?.length === 0 && (
          <div className="w-100 h-50">
            <p>Não tem nenhum tarefa. {title}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-black/60  p-4 w-full rounded-2xl max-w-200 min-h-[90dvh] mx-auto relative">
      {/* Barra de Progresso */}
      <ProgressBar />
      {/* Modal de Avisos */}
      <BoxAlarm />

      <div className="flex max-w-150 mx-auto mb-5 gap-2 bg-white/5 p-5 rounded-xl">
        {[
          { key: "todos", label: "todos" },
          { key: "assets", label: "ativos" },
          { key: "completed", label: "completados" },
          { key: "trash", label: "lixo" },
        ].map((btn) => (
          <Button
            onPress={() => {
              if (btn.key === "trash") {
                setStatusTrashCan(true);
                setFilterBtn({ key: btn.key, label: btn.label });
              } else {
                setStatusTrashCan(false);
                setFilterBtn({ key: btn.key, label: btn.label });
              }
              setModalStatus(!modalStatus);
            }}
            key={btn.key}
            className="text-green-400 bg-white/5 w-full max-w-150 mx-auto"
          >
            {btn.label}
          </Button>
        ))}
      </div>

      <div className="w-full flex gap-2 justify-center my-2">
        <Input
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              addTask();
              setTask("");
            }
          }}
          ref={refInputTask}
          type="text"
          className=" h-10 bg-white w-full max-w-100"
          value={task}
          placeholder="Digite algo"
          onChange={(e) => setTask(e.target.value)}
        />
        {/* BTN ADD */}
        <Button
          className="max-w-30 w-full h-10 bg-gray-500"
          onKeyDown={(event) => console.log(event.key)}
          onClick={() => {
            if (!task) refInputTask.current?.focus();
            addTask();
            setTask("");
          }}
        >
          Add
        </Button>
        <Button
          className="max-w-30 w-full h-10 bg-red-200 text-black"
          onClick={() => {
            setTask("");
            refInputTask.current?.focus();
          }}
        >
          limpar
        </Button>
      </div>

      {/* Filtro Lixeira / Recuperar */}
      <div className="w-full flex items-center justify-around bg-white/5 rounded-full px-2 p-0.5 mt-5">
        <p className="text-left text-gray-500 text-xs">
          {resControl.length} itens
        </p>
        <Button
          onPress={() => {
            if (statusTrashCan) {
              setTrash([]);
            }
            checkoutRecover();
          }}
          className={`text-red-400 bg-transparent hover:bg-white/5 transition-all text-xs duration-200 ease-in ${itensSelects.length > 0 ? "opacity-100" : "opacity-0"}`}
        >
          {statusTrashCan ? "Limpar deletados" : `Enviar para lixeira`}
        </Button>

        {statusTrashCan && (
          <Button
            onPress={() => checkoutRecover()}
            className={`text-white bg-transparent hover:bg-white/5 transition-all text-xs duration-200 ease-in ${itensSelects.length > 0 ? "opacity-100" : "opacity-0"}`}
          >
            Recuperar selecionados
          </Button>
        )}
      </div>

      {/* Checkbox */}
      <div className="flex flex-col gap-2 max-h-100 overflow-y-auto">
        {handleLayout(filterBtn.label, resControl)}

        {resControl.map((taskMap) => (
          <div
            key={taskMap.id}
            className={`flex w-full max-w-200 mx-auto py-5 justify-between `}
          >
            <Checkbox
              isSelected={taskMap.completed}
              id="basic-terms"
              onClick={() => {
                if (statusTrashCan) {
                  setTrash(
                    trash.map((t) =>
                      taskMap.id === t.id
                        ? { ...t, completed: !t.completed }
                        : t,
                    ),
                  );
                }
                setTodos(
                  todos.map((t) =>
                    taskMap.id === t.id ? { ...t, completed: !t.completed } : t,
                  ),
                );
              }}
            >
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
            </Checkbox>

            <h2
              className={`${taskMap.completed && !statusTrashCan && "line-through !text-gray-700"} `}
            >
              {taskMap.task}
            </h2>
            <div>
              <h3>
                Status Ativos:
                <div
                  className={`w-10 h-10  ${taskMap.active ? "bg-green-400" : "bg-red-400"}`}
                ></div>
              </h3>
              <h3>
                completados Ativos:{" "}
                <div
                  className={`w-10 h-10  ${taskMap.completed ? "bg-green-400" : "bg-red-400"}`}
                ></div>
              </h3>
            </div>
            <div className="flex gap-2 flex-col">
              {!statusTrashCan && (
                <div className="flex gap-2">
                  <Button
                    className={"min-w-50"}
                    onPress={() => {
                      setEditTask(!editTask);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    onPress={() => {
                      trashCan(taskMap.id);
                    }}
                  >
                    Excluir
                  </Button>
                </div>
              )}

              {statusTrashCan && (
                <Button
                  onPress={() => {
                    const itemRecuperado = trash.map((item) =>
                      item.id === taskMap.id
                        ? { ...item, completed: false }
                        : item,
                    );

                    setTodos((prev) => [...prev, ...itemRecuperado]);
                    setTrash(trash.filter((f) => f.id !== taskMap.id));
                  }}
                >
                  Recuperar tarefa
                </Button>
              )}
              <div>
                <p>Prioridade: {taskMap.priority.label}</p>
              </div>
            </div>

            {!statusTrashCan && editTask && (
              <div
                ref={refModalEdit}
                className="w-200 min-h-70 bg-zinc-600 rounded-2xl p-2 flex flex-col gap-2 relative"
              >
                <Button
                  className={"absolute top-2 right-2"}
                  onPress={() => setEditTask(!editTask)}
                >
                  X
                </Button>

                <div>
                  <h3 className="text-xl">Titulo: {taskMap.task}</h3>

                  <p className="text-sm">Data da criação: {taskMap.date}</p>

                  <div className="py-3 flex gap-4 justify-center">
                    <Button
                      onPress={() => {
                        trashCan(taskMap.id);
                      }}
                    >
                      Excluír Tarefa
                    </Button>
                    <Button onPress={() => setBtnMiddleTask(!btnMiddleTask)}>
                      Mudar prioridade
                    </Button>
                  </div>

                  <div>
                    <div className="flex flex-col gap-2 items-center justify-center py-2">
                      <p className="text-gray-400 text-sm">
                        Prioridade:{" "}
                        <span className="text-white text-base">
                          {keyBtnPriority}
                        </span>
                      </p>
                    </div>

                    {btnMiddleTask && (
                      <div className="flex justify-center items-center gap-2 py-2 bg-white/10  mt-4 border-y border-red-400">
                        {arrPriority.map((btn) => (
                          <div key={btn.key}>
                            <Button
                              onPress={() => {
                                setTodos(
                                  todos.map((m) =>
                                    m.priority.key
                                      ? {
                                          ...m,
                                          priority: {
                                            key: btn.key,
                                            label: btn.label,
                                          },
                                        }
                                      : m,
                                  ),
                                );

                                setKeyBtnPriority(btn.label);
                                setBtnMiddleTask(false);
                              }}
                            >
                              {btn.label}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center w-full">
                  <Button>Salvar</Button>
                  <Button>Cancelar</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input de pesquisa */}
      <Search />
    </div>
  );
}
