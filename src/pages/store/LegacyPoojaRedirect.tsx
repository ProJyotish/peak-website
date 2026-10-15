import { Navigate, useLocation, useParams } from "react-router-dom";
import { ROUTES } from "@/lib/routes";

/** `/pooja` and `/pooja/:slug` moved into the store; keeps the query (`?code=`, utm) on the way. */
const LegacyPoojaRedirect = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { search, hash } = useLocation();
  const pathname = slug ? ROUTES.poojaPage(slug) : ROUTES.pooja;
  return <Navigate replace to={{ pathname, search, hash }} />;
};

export default LegacyPoojaRedirect;
