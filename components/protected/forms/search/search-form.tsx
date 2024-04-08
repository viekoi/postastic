"use client";
import { SearchSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

import useDebounce from "@/hooks/use-debounce";
import { Loader } from "@/components/Loader";

import { useGetInfiniteUsers } from "@/queries/react-query/queris";
import { getIniniteUsers } from "@/actions/get-infinite-users";
import { UserWithData } from "@/type";
import { useRouter } from "next/navigation";
import UserCard from "../../cards/user/user-card";
import { useSearchModal } from "@/hooks/use-modal-store";
interface SearchFormProps {
  q: string | null;
  setSearchValue: (value: string) => void;
}

const SearchForm = ({ q, setSearchValue }: SearchFormProps) => {
  const router = useRouter();
  const { onClose } = useSearchModal();
  const form = useForm<z.infer<typeof SearchSchema>>({
    resolver: zodResolver(SearchSchema),
    defaultValues: {
      searchTerm: q ? q : "",
    },
  });

  const debounceQ = useDebounce(form.watch("searchTerm"), 300);

  const { data: users, isPending } = useGetInfiniteUsers({
    q: debounceQ,
    queryFn: getIniniteUsers,
  });

  const formErrors = form.formState.errors;

  const onSubmit = async (values: z.infer<typeof SearchSchema>) => {
    try {
      router.push(`/search?q=${values.searchTerm}`);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full w-full p-2 flex flex-col gap-y-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div
            className={cn(
              "flex w-full  border-[3px] rounded-3xl overflow-hidden flex-shrink-0 ",
              formErrors.searchTerm ? "border-rose-400" : "border-white"
            )}
          >
            <FormField
              control={form.control}
              name="searchTerm"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      autoComplete={"off"}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setSearchValue(e.target.value);
                      }}
                      value={field.value}
                      className="bg-black border-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              variant={"ghost"}
              size={"icon"}
              type="submit"
              className="rounded-none"
            >
              <Search />
            </Button>
          </div>
        </form>
      </Form>
      <div className="w-full flex-1">
        {isPending ? (
          <div className="flex w-full h-full items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="flex h-full  flex-col gap-y-2">
            {users?.pages[0].data &&
              users?.pages[0].data.map((user: UserWithData) => {
                return <UserCard key={user.id} user={user} type="link" />;
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchForm;
