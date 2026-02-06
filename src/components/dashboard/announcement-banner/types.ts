
export enum DeviceType {
    MOBILE,
    DESKTOP,
    WEB,
    TABLET,
}

export enum BannerPosition {
    HOME_TOP,
    HOME_MIDDLE,
    HOME_BOTTOM,
    SPLASH,
    SIDEBAR
}

export interface CreateBannerPayload {
    title?: string,
    description: string,
    imageUrl?: string,
    publicId?: string,
    position?: BannerPosition,
    priority?: number,
    deviceType?: DeviceType,
}

export interface BannerResponse {

    createdAt: string,
    updatedAt: string,
    deletedAt: string,
    createdById: string,
    updatedById: string,
    deletedById: string,
    restoredById: string,
    id: string,
    title: string,
    description: string,
    imageUrl: string,
    publicId: string,
    position: BannerPosition,
    priority: number,
    deviceType: DeviceType

}

export interface GetBannerResponse {
    content: BannerResponse[];
}


