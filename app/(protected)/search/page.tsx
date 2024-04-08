import UserContainer from "@/components/protected/containers/user/user-containter";

const Page = async ({ searchParams }: { searchParams: { q?: string } }) => {
  const q = searchParams.q ? searchParams.q : "";

  // const { onOpen} =useSearchModal()
  return (
    <UserContainer q={q} />

    // <div className="p-2 hover:opacity-60 hover:cursor-pointer" onClick={onOpen}>
    //   <div
    //     className={
    //       "flex w-full  border-[3px] rounded-3xl overflow-hidden border-white justify-end"
    //     }
    //   >
    //     <div />
    //     <Button
    //       variant={"ghost"}
    //       size={"icon"}
    //       type="submit"
    //       className="rounded-none"
    //     >
    //       <Search />
    //     </Button>
    //   </div>
    // </div>
  );
};

export default Page;
