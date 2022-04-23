import React from "react";
import { useRouter } from "next/router";
import { getRouteInfo } from "api/menuRoutes";

export default function PageTitle() {
  const router = useRouter();
  // console.log(router.route);
  const routeData = getRouteInfo(router.route);
  // console.log(routeData);

  return (
    <>
      <div className="flex items-center justify-center px-3 py-1 mr-1 rounded-full bg-yellow-50">
        <span className="font-semibold">{routeData.code}</span>
      </div>
      <h1 className="mb-0 mr-6 text-xl font-normal tracking-tight text-gray-700">
        {routeData.label}
      </h1>
    </>
  );
}
