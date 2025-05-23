import { UserNav } from "@/components/features/use-nav";
import SearchInput from "@/components/search-input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4 w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <div className="flex items-center gap-2 ml-auto">
          <div className="hidden md:flex">
            <SearchInput />
          </div>
          {/*<ModeToggle />*/}
          <UserNav />
        </div>
      </div>
    </header>
  );
}
