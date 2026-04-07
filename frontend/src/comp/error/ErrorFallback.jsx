import React from "react";
import { Link, useRouteError } from "react-router";

function ErrorFallback() {
  const error = useRouteError();
  const message =
    error?.message || error?.statusText || "Something went wrong. Please try again.";

  return (
    <div className="main-background min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/10 p-10 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
           
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-secondary">Error</p>
              <h1 className="text-4xl font-semibold text-white">Something went wrong.</h1>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#1f1a3c]/80 p-6 text-white shadow-xl shadow-black/20">
            <p className="text-sm text-secondary mb-4">We were unable to load this page. If the problem persists, try refreshing or return home.</p>
            <p className="whitespace-pre-wrap break-words text-base text-red-600">{message}</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col font-Inter gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className=" bg-primary inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold text-white transition duration-300 hover:shadow-lg"
              >
                Reload Page
              </button>
              <Link
                to="/"
                className=" bg-secondary inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold text-black transition duration-300 hover:shadow-lg"
              >
                Go Home
              </Link>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorFallback;

