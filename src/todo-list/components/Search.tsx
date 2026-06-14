import { Button, Input } from "@heroui/react";
import { useApp } from "../AppProvider";
import { IoMdArrowRoundUp } from "react-icons/io";

export default function Search() {
  const { handleSearch, setSearch, btnSearch } = useApp();
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-baseline items-center w-full max-w-170">
      <div className="flex-6 relative">
        <Input
          placeholder="Pesquisa alguma tarefa"
          className={" w-full h-full py-4 pl-4 pr-28 rounded-full "}
          onKeyDown={handleSearch}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Button
          className={"absolute right-2 top-1/2 -translate-y-1/2"}
          variant="ghost"
          onPress={() => btnSearch()}
        >
          <IoMdArrowRoundUp className="text-violet-400" />
        </Button>
      </div>
    </div>
  );
}
