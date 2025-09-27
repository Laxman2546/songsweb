"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchResults from "../search/page";

export default function SearchHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); 
  }, []);

  if (!mounted) return null; 

  const query = searchParams.get("q");
  return query ? <SearchResults query={query} /> : <>{children}</>;
}
