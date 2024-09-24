import { Link, useMatches } from "react-router-dom";
import { Breadcrumbs } from "@material-tailwind/react";
// handle 속성의 타입을 정의합니다
interface Handle {
  title: string;
  action: string;
}

// RouteObject 타입을 확장하여 handle 속성을 포함시킵니다
interface CustomRouteObject {
  handle: Handle;
  pathname: string;
}
const BreadcrumbComponent = () => {
  const matches = useMatches() as CustomRouteObject[];

  const crumbs = matches
    .filter((match) => Boolean(match.handle.title))
    .map((match) => ({
      title: match.handle.title,
      path: match.pathname,
    }));

  return (
    <Breadcrumbs>
      {crumbs.map((crumb, index) => (
        <Link
          key={index}
          to={crumb.path}
          className={index === crumbs.length - 1 ? "font-bold" : ""}
        >
          {crumb.title}
        </Link>
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbComponent;
