import { ChevronRight } from "lucide-react"

const ProgressBar = () => {
    return <><h1 className="text-4xl font-bold mt-3 text-[#344054]">Book Ride</h1>
        {/* Progress Bar */}
        <div className="flex items-center  gap-[40px] mt-5 mb-10">
            <div className="flex items-center ">
                <div className="w-8 h-8 rounded-full bg-[#657084] text-white mr-4 flex items-center justify-center text-xs ">1</div>
                <span className="text-[#667185] text-[15px] whitespace-nowrap">Itinerary</span>
            </div>
            <div>
                <ChevronRight />
            </div>
            <div className="flex items-center">
                <div className="w-8 h-8 rounded-full border border-[#657084] text-[#657084] mr-4 flex items-center justify-center text-xs ">2</div>
                <span className="text-[#667185] text-[15px] whitespace-nowrap ">Select Vehicle</span>
            </div>
            <div>
                <ChevronRight />
            </div>
            <div className="flex items-center">
                <div className="w-8 h-8 rounded-full border border-[#657084] text-[#657084] mr-4 flex items-center justify-center text-xs">3</div>
                <span className="text-[#667185] text-[15px] whitespace-nowrap">Booking Summary</span>
            </div>
            <div>
                <ChevronRight />
            </div>
            <div className="flex items-center">
                <div className="w-8 h-8 rounded-full border border-[#657084] text-[#657084] mr-4 flex items-center justify-center text-xs">4</div>
                <span className="text-[#667185] text-[15px] whitespace-nowrap">Payment</span>
            </div>
        </div></>
}

export { ProgressBar }