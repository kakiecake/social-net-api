export type ApiResponse<T = null> = {
    success: boolean;
    error?: string;
    data: T;
};
