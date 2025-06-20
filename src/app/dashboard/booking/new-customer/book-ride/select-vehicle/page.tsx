'use client'

import { SelectVehicleLayout } from "@/components/bookings/select-vehicle/SelectVehicleLayout"
import { Suspense } from "react"
import { FullPageSpinner } from "@/components/shared/spinner"
const SelectVehicle = () => {

    return (
        <Suspense fallback={<FullPageSpinner />}>

            <SelectVehicleLayout />
        </Suspense>
    )
}


export default SelectVehicle