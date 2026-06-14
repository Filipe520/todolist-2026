import { Button, Checkbox, Input, TextArea } from "@heroui/react";
import { useApp, type PropTodoList } from "../AppProvider";
import BoxAlarm from "./boxAlarm";
import Search from "./Search";
import ProgressBar from "./ProgressBar";
import { IoAdd } from "react-icons/io5";
import { GoArrowLeft } from "react-icons/go";

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
    btnFilters,
    setBtnFilters,
    btnEnterEditTask,
    setBtnEnterEditTask,
    clearSelects,
  } = useApp();

  const handleLayout = (title: string, taskArray: PropTodoList[]) => {
    return (
      !taskArray.length && (
        <div className="max-w-150 w-full mx-auto relative min-h-30 bg-linear-to-l from-violet-400 via-violet-500 to-purple-600   rounded-2xl mt-5">
          <div className="inset-0.5 rounded-2xl absolute  bg-white flex items-center justify-center flex-col py-2">
            <h2 className="!text-gray-500">Que pena!</h2>
            <p className="!text-gray-400">não há nenhuma tarefa em {title}.</p>
          </div>
        </div>
      )
    );
  };

  return (
    <div className="222222222overflow-y-hidden bg-black/60 bg-radial-[at_50%_0%] from-70% via-blue-950/30 via-100% to-100% from-zinc-950 to-blue-900/30  p-4  rounded-2xl min-h-[90dvh] mx-auto relative h-dvh w-dvw">
      {/* Barra de Progresso */}
      <ProgressBar />
      {/* Modal de Avisos */}
      <BoxAlarm />
      {/* Modal para Adicionar mais tarefas */}
      <div className="absolute bottom-25 right-5 size-15 bg-gray-700/20 backdrop-blur-lg z-10 rounded-2xl group">
        <Button
          className={"w-full h-full rounded-2xl"}
          variant="ghost"
          onPress={() => setBtnFilters(!btnFilters)}
        >
          <IoAdd className="size-full text-white group-hover:text-black" />
        </Button>
      </div>
      {btnFilters && (
        <div className="absolute bottom-42 z-30 right-5 max-w-50 w-full min-h-70 bg-white/90 backdrop-blur-lg rounded-2xl flex items-center justify-around flex-col p-2">
          {[
            { key: "todos", label: "Início" },
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
              className=" w-full mx-auto"
            >
              {btn.label}
            </Button>
          ))}
        </div>
      )}

      {/* Modal de Tela inteira para add tarefas */}
      {btnEnterEditTask && (
        <div className="inset-0 absolute bg-gray-100 md:rounded-2xl z-30 flex flex-col p-3">
          <div className="py-5 shrink-0 flex items-center justify-start">
            <Button onPress={() => setBtnEnterEditTask(!btnEnterEditTask)}>
              <GoArrowLeft />
            </Button>
          </div>
          <div className="flex-2 shrink-0">
            <div className="flex items-center justify-center w-full">
              <div className="flex-2">
                <Input
                  placeholder="Título"
                  className="w-full h-10 rounded-none border-none  p-0 shadow-none outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      addTask();
                      setTask("");
                    }
                  }}
                  ref={refInputTask}
                  type="text"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
              </div>
            </div>
            <TextArea
              aria-label="Detailed notes"
              id="textarea-rows-6"
              placeholder="Digite alguma tarefa"
              rows={6}
              className={
                "w-full h-full rounded-none bg-transparent border-none shadow-none outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              }
            />
          </div>
          <div className="shrink-0 flex items-center justify-between">
            <div className="bg-amber-100">Colocar cor na tarefa?</div>
            <div className="bg-amber-300">
              Mudar fonte? Tamanho da letra? Alinhamento do texto?
            </div>
            <div className="bg-amber-600">
              modal com três pontinhos. é dentro colocar excluír. Editar
              prioridade, editar data para tocar alarme.
            </div>
          </div>
          {/* BTN ADD */}
          <div className="max-w-100 mx-auto w-full flex flex-1 justify-between items-center ">
            <Button
              className="max-w-30 w-full h-10 bg-gray-500"
              onKeyDown={(event) => console.log(event.key)}
              onClick={() => {
                if (!task) refInputTask.current?.focus();
                addTask();
                setTask("");
              }}
            >
              Adicionar
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
        </div>
      )}
      {/* Filtro Lixeira / Recuperar / remover selecionados */}
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

        <Button onPress={() => clearSelects()}>Remove selecionados</Button>

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
      <div className="flex flex-col scrollbar-thumb-red-500/0 overflow-y-auto h-[80%] mask-b-from-90% mask-t-from-95%">
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
