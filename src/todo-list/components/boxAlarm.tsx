import { useApp } from "../AppProvider";

// Modal de Aviso
export default function BoxAlarm() {
  const { modalStatus, itensSelects } = useApp();
  return (
    <div
      className={`w-70 min-h-12 absolute top-10 z-20 bg-zinc-200/10 backdrop-blur-lg  transition-opacity duration-300 ease-in ${modalStatus ? " opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} flex justify-start pl-3 py-1 rounded-lg border-l-4 border-l-green-500 flex-col text-left`}
    >
      <h2 className="!text-sm !p-0 !m-0 !text-green-500">
        Adicionado com sucesso.
      </h2>

      <div className="flex items-center gap-2">
        <h4 className="text-xs text-gray-400">Tarefas:</h4>
        <div className="flex flex-col gap-1">
          {itensSelects.map((task) => (
            <div key={task.id}>
              <p className="text-white text-xs max-w-50 line-clamp-1 wrap-break-word">
                {task.task}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
