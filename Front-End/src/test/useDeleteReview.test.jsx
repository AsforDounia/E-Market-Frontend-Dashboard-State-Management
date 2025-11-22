import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useDeleteReview from "../hooks/useDeleteReview";
import reviewService from "../services/reviewService";
import { toast } from "react-toastify";

// Mock the reviewService and toast
vi.mock("../services/reviewService", () => ({
  default: {
    deleteReview: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useDeleteReview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete a review and invalidate queries on success", async () => {
    const reviewId = "review1";
    reviewService.deleteReview.mockResolvedValue({});

    const { result } = renderHook(() => useDeleteReview(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(reviewId);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(reviewService.deleteReview).toHaveBeenCalledWith(reviewId);
    expect(toast.success).toHaveBeenCalledWith("Review deleted successfully!");
  });

  it("should show an error toast on failure", async () => {
    const reviewId = "review1";
    const errorMessage = "Could not delete review";
    reviewService.deleteReview.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    const { result } = renderHook(() => useDeleteReview(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(reviewId);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });
});
