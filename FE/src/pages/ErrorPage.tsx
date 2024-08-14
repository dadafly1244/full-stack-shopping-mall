import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  const errorResponse: { message?: string; data?: unknown } = {};

  function errorMessage(error: unknown): string {
    if (isRouteErrorResponse(error))
      return (errorResponse.message = `${error.status} ${error.statusText}`), (errorResponse.data = error.data);
    if (error instanceof Error) return (errorResponse.message = error.message);
    if (typeof error === "string") return (errorResponse.message = error);

    console.error(error);
    return (errorResponse.message = "Unknown error");
  }

  errorMessage(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorResponse.message}</i>
      </p>
    </div>
  );
}
