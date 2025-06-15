import { ChevronRight } from "lucide-react"

const ProgressBar = ({ headerText, page }: { headerText: string, page?: string }) => {
    return <><h1 className="text-4xl font-bold mt-3 text-[#344054]">{headerText}</h1>
        {/* Progress Bar */}
        <div className="flex items-center justify-between mt-5 mb-10">
            <div className="flex items-center ">
                <div className={`w-8 h-8 rounded-full  ${page === "bookingSummary1" ? "bg-[#0673ff] text-white" : "bg-[#657084]"}  text-white mr-4 flex items-center justify-center text-xs `}>1</div>
                <span className="text-[#667185] text-[15px] whitespace-nowrap">Itinerary</span>
            </div>
            <div>
                <ChevronRight />
            </div>
            <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${page === "bookingSummary1" ? "bg-[#0673ff] text-white" : "border border-[#657084]"}    text-[#657084] mr-4 flex items-center justify-center text-xs `}>2</div>
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
        </div>
    </>
}

export { ProgressBar }