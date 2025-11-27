import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import useReviews from "../hooks/useReviews";
import reviewService from "../services/reviewService";

// Mock the reviewService
jest.mock("../services/reviewService", () => ({
  __esModule: true,
  default: {
    getReviews: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useReviews", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return reviews for a given product ID", async () => {
    const productId = "product1";
    const mockReviews = {
      data: {
        reviews: [{ id: "review1", comment: "Great product!" }],
        averageRating: 5,
      },
    };
    reviewService.getReviews.mockResolvedValue(mockReviews);

    const { result } = renderHook(() => useReviews(productId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(reviewService.getReviews).toHaveBeenCalledWith(productId);
    expect(result.current.data).toEqual(mockReviews.data);
  });

  it("should not fetch reviews if productId is not provided", () => {
    const { result } = renderHook(() => useReviews(null), {
      wrapper: createWrapper(),
    });

    expect(reviewService.getReviews).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  it("should handle errors when fetching reviews", async () => {
    const productId = "product1";
    const errorMessage = "Error fetching reviews";
    reviewService.getReviews.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useReviews(productId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe(errorMessage);
  });
});
