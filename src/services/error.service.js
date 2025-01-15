
export const handleApiError = (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return {
        error: true,
        message
    };
};