import Bottombar from "@/components/protected/bottom-bar";
import LeftSidebar from "@/components/protected/left-side-bar";
import Topbar, { LayoutTopbar } from "@/components/protected/top-bar";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <Topbar />
      <div className="mx-auto grid grid-cols-4 max-w-[1280px] min-h-screen relative">
        <LeftSidebar />
        <div className="lg:col-span-2 col-span-full flex w-full h-full flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
          <LayoutTopbar />
          {children}
        </div>
        <div className="lg:block hidden">right-side-bar</div>
      </div>
      <Bottombar />
    </div>
  );
};

export default HomeLayout;
