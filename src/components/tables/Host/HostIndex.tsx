import React, { ChangeEvent, useCallback, useEffect, useState } from "react";

import HostDataTable from "./HostTable";

import HostStats from "./HostStat";
import Link from "next/link";
import { LocalRoute } from "@/utils/LocalRoutes";

type Props = {};

export default function HostIndex({}: Props) {
  return (
    <div className="space-y-6 p-4 md:p-0">
      <HostStats />

      <div className="flex justify-between items-center ">
        <span className="text-base 2xl:text-xl text-grey-700">Hosts</span>
        <Link href={LocalRoute.hostViewAllPage}>
          <span className="text-base 2xl:text-xl text-grey-700">View All</span>
        </Link>
      </div>

      <HostDataTable filters={{}} search={""} />
    </div>
  );
}
