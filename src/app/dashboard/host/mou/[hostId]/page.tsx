import React from "react";
import HostMou from "@/components/dashboard/host-management/HostMou";

export default function HostMouPage({
  params,
}: {
  params: { hostId: string };
}) {
  return <HostMou hostId={params.hostId} />;
}
