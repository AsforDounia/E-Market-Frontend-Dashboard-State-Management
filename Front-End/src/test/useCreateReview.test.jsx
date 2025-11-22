import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useCreateReview from "../hooks/useCreateReview";
import reviewService from "../services/reviewService";
import { toast } from "react-toastify";

// Mock the reviewService and toast
vi.mock("../services/reviewService", () => ({
  default: {
    createReview: vi.fn(),
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

describe("useCreateReview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a review and invalidate queries on success", async () => {
    const newReview = { productId: "product1", rating: 5, comment: "Excellent!" };
    const mockResponse = {
      data: {
        review: { ...newReview, id: "review2" },
      },
    };
    reviewService.createReview.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreateReview(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newReview);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(reviewService.createReview).toHaveBeenCalledWith(newReview);
    expect(toast.success).toHaveBeenCalledWith("Review created successfully!");
  });

  it("should show an error toast on failure", async () => {
    const newReview = { productId: "product1", rating: 5, comment: "Excellent!" };
    const errorMessage = "Could not create review";
    reviewService.createReview.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    const { result } = renderHook(() => useCreateReview(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newReview);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });
});
