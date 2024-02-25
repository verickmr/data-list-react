import { FileDown, Filter, MoreHorizontal, Plus, Search } from "lucide-react";
import { Header } from "./components/Header";
import { Tabs } from "./components/Tabs";
import { Button } from "./components/ui/Button";
import { Pagination } from "./components/Pagination";
import { Control, Input } from "./components/ui/Input";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/Table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

export interface TagResponse {
  first: number;
  prev: number | null;
  next: number;
  last: number;
  pages: number;
  items: number;
  data: Tag[];
}

export interface Tag {
  title: string;
  amountOfVideos: number;
  id: string;
}

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilter = searchParams.get("filter") ?? "";
  const [filters, setFilters] = useState(urlFilter);
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const { data: tagsResponse, isLoading } = useQuery<TagResponse>({
    queryKey: ["get-tags", urlFilter, page],
    queryFn: async () => {
      const response = await fetch(
        ` http://localhost:3333/tags?_page=${page}&_per_page=10&title=${urlFilter}`
      );
      const data = await response.json();

      await new Promise((resolve) => setInterval(resolve, 2000));
      return data;
    },
    placeholderData: keepPreviousData,
  });

  function handleFilter() {
    setSearchParams((params) => {
      params.set("page", "1");
      params.set("filter", filters);

      return params;
    });
  }

  if (isLoading) {
    return null;
  }

  return (
    <div className="py-10 space-y-8">
      <div>
        <Header />
        <Tabs />
      </div>
      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex gap-3 items-center">
          <h1 className="text-xl font-bold">Tags</h1>
              <Button variant="primary">
                <Plus className="size-3" />
                Create new
              </Button>
         
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Input variant="filter">
              <Search className="size-3" />
              <Control
                placeholder="Search Tags..."
                onChange={(e) => {
                  setFilters(e.target.value);
                }}
                value={filters}
              />
            </Input>
            <Button onClick={handleFilter}>
              <Filter className="size-3" />
              Filter
            </Button>
          </div>
          <Button>
            <FileDown />
            Export
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Amount of videos</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tagsResponse?.data.map((tag) => {
              return (
                <TableRow key={tag.id}>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{tag.title}</span>
                      <span className="text-xs text-zinc-500">{tag.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {tag.amountOfVideos} vídeo(s)
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {tagsResponse && (
          <Pagination
            pages={tagsResponse.pages}
            items={tagsResponse.items}
            page={page}
          />
        )}
      </main>
    </div>
  );
}

export default App;
