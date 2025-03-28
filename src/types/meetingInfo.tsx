export interface meetingInfo {
    id: string,
    title?: string,
    description?: string | null,
    startTime?: string | null,
    participants?: string | null,
    leader?: string | null,
}