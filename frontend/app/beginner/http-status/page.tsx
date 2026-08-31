import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HttpStatusLab } from "@/features/beginner/http-status/HttpStatusLab";

export const metadata = { title: "HTTP Methods & Status Codes" };

export default function HttpStatusPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Beginner", href: "/beginner" }, { label: "HTTP Methods & Status Codes" }]} />
      <h1 className="text-2xl font-semibold mb-1">HTTP Methods & Status Codes</h1>
      <p className="text-neutral-600 mb-6 max-w-2xl">
        The common language of the web, and how to tell which component in a pipeline actually
        broke from the status code alone.
      </p>
      <HttpStatusLab />
    </div>
  );
}
