import SearchBarCard from "@/components/protected/cards/search-bar-card";
import UserContainer from "@/components/protected/containers/user/user-containter";

const Page = async ({ searchParams }: { searchParams: { q?: string } }) => {
  const q = searchParams.q ? searchParams.q : "";

  return (
    <div className="p-2 flex flex-col gap-y-2">
      <SearchBarCard q={q} />
      <UserContainer q={q} />
    </div>
  );
};

export default Page;
