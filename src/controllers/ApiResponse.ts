export type ApiResponse<T = null> = {
    success: boolean;
    error?: string;
    data: T;
};

// Tuple of [statusCode, data | err]
export type ControllerResponse<
    T extends object | null = null,
    E extends string | Error = string
> = readonly [number, T | E];
