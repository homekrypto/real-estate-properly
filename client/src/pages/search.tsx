import { Footer } from "@/components/layout/footer";
import SearchResults from "./search-results";
import { Layout } from "@/components/Layout";

export default function Search() {
  return (
    <Layout>
      <SearchResults />
      {/* Footer is included in Layout */}
    </Layout>
  );
}
