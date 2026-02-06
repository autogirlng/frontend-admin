"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Toaster } from "react-hot-toast";

import { useCreateAnnouncementBannerContent, useGetAnnouncementBanner, useDeleteAnnouncementBannerContent } from "@/lib/hooks/annoucement-banner/useAnnoucementBanner";
import { BannerPosition, DeviceType } from "@/components/dashboard/announcement-banner/types";


export default function AnnouncementBanner() {

    const [messageContent, setMessageContent] = React.useState("");
    const { mutate, isPending: isPendingMutation } = useCreateAnnouncementBannerContent();
    const [bannerId, setBannerId] = useState<string | null>(null);
    const { mutate: deleteMutation, isPending: isPendingDelete } = useDeleteAnnouncementBannerContent(bannerId || "");


    const { data: annoucementBannerContent, isLoading, isError, error } = useGetAnnouncementBanner();
    const router = useRouter();


    useEffect(() => {
        if (annoucementBannerContent?.content && annoucementBannerContent.content.length > 0) {
            setMessageContent(annoucementBannerContent.content[0].description);
            setBannerId(annoucementBannerContent.content[0].id);
        } else {
            setMessageContent("");
            setBannerId("");
        }
    }, [annoucementBannerContent]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        mutate({
            title: "Announcement Banner",
            description: messageContent,
            publicId: "",
            imageUrl: "",
            priority: 1,
            position: BannerPosition.HOME_TOP,
            deviceType: DeviceType.WEB
        });

    }


    if (isLoading) {
        return (
            <div className="flex justify-center p-4">
                <CustomLoader />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-[80vh] w-full flex items-center justify-center p-4">

                <div className="flex items-center justify-between w-full max-w-md p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 shadow-sm">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={20} />
                        <p className="text-sm font-medium">
                            {error?.message || "Failed to load announcements"}
                        </p>
                    </div>
                    <button
                        onClick={() => router.refresh()}
                        className="p-1 hover:bg-rose-100 rounded-full transition-colors"
                        title="Retry"
                    >
                        <RefreshCcw size={16} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl mb-1 font-bold text-gray-900">Annoucement Banner</h1>
                    <p className="text-sm text-gray-500"> Manage the text displayed at the top of the Muvment customer website. This banner scrolls across the screen to catch the user's attention.</p>

                </div>

            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg"
            >
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                            Banner Text
                        </h3>
                        <p className="text-sm text-gray-500">
                            This message will scroll across the top of the Muvment customer website.
                        </p>
                    </div>

                </div>

                <div className="space-y-4 mb-5  ">

                    <TextAreaInput
                        id="messageContent"
                        label="Message Content"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                    // disabled={isLoadingMutation}
                    />

                </div>
                {
                    annoucementBannerContent?.content && annoucementBannerContent.content.length > 0 ? (
                        <div className="flex justify-end pb-4 mt-4 border-b">
                            <Button
                                type="button"
                                isLoading={isPendingDelete}
                                onClick={() => {
                                    if (annoucementBannerContent.content[0].id) {
                                        setBannerId(annoucementBannerContent.content[0].id);
                                        deleteMutation();
                                    }
                                }}
                                className="w-auto px-4 bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
                            >
                                Delete Banner
                            </Button>
                        </div>
                    ) : <div className="flex justify-end pt-6 mt-6 border-t">
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isPendingMutation}
                            disabled={!messageContent || isPendingMutation}
                            className="w-auto px-4"
                        >
                            Save Changes
                        </Button>
                    </div>
                }

            </form>


        </>
    );
}