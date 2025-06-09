"use client";

import { useAppSelector } from "@/lib/hooks";
import Button from "@/components/shared/button";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { FullPageSpinner } from "@/components/shared/spinner";
import { LocalRoute } from "@/utils/LocalRoutes";

export default function SuccessfulPage() {
  const router = useRouter();

  return (
    <Suspense fallback={<FullPageSpinner />}>
      <main className="p-8 min-h-screen h-full w-full flex items-center justify-center">
        <div className="space-y-12 flex flex-col items-center text-center">
          <Image
            src="/icons/success_confetti.png"
            alt=""
            height={100}
            width={100}
          />
          <h2 className=" text-h5 md:text-h3 3xl:text-4xl">
            Host Onboarded Successfully
          </h2>
          <p>This Host can now be assigned rides and vehicles. </p>
          <div className="flex flex-col sm:flex-row gap-[18px]">
            <Link href={LocalRoute.addNewHostPage}>
              <Button variant="outlined" className="px-6">
                Add Host
              </Button>
            </Link>
            <Link href="/">
              <Button variant="filled" color="primary" className="px-6">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </Suspense>
  );
}
