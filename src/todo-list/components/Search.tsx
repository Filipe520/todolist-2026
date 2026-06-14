import { Button, Input } from "@heroui/react";
import { useApp } from "../AppProvider";
import { IoMdArrowRoundUp } from "react-icons/io";

export default function Search() {
  const {
    handleSearch,
    setSearch,
    btnSearch,
    setBtnEnterEditTask,
    btnEnterEditTask,
  } = useApp();
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-baseline items-center w-full max-w-200 h-13">
      <div className="flex-6 relative flex items-center justify-between bg-white  rounded-full h-full">
        <Button
          variant="ghost"
          onPress={() => setBtnEnterEditTask(!btnEnterEditTask)}
          className={" h-full rounded-r-none text-xs"}
        >
          Adicionar tarefa
        </Button>
        <Input
          placeholder="Pesquisa alguma tarefa que já criou."
          className={
            " w-full h-full py-4 focus:ring-transparent rounded-none bg-transparent shadow-none"
          }
          onKeyDown={handleSearch}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Button
          variant="ghost"
          onPress={() => btnSearch()}
          className={"h-full rounded-l-none"}
        >
          <IoMdArrowRoundUp className="text-violet-400 " />
        </Button>
      </div>
    </div>
  );
}
