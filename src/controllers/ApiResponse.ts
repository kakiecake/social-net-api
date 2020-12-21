export type ApiResponse<T = unknown> = {
    success: boolean;
    error?: string;
    data: T | null;
};
