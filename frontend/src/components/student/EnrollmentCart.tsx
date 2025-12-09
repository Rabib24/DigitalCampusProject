"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { CourseEnrollmentService, type CartItem, CourseEnrollmentError } from "@/lib/student/course-enrollment";
import { RegistrationConfirmation } from "./RegistrationConfirmation";
import { ShoppingCart, Trash2, BookOpen, CreditCard, Calendar, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EnrollmentCartProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll: () => void;
}

interface EnrollmentResult {
  successful_enrollments: Array<{ course_id: string; status: string; waitlist_position?: number }>;
  failed_enrollments: Array<{ course_id: string; reason: string }>;
}

const EnrollmentCartComponent = memo(({ isOpen, onClose, onEnroll }: EnrollmentCartProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [enrollmentResults, setEnrollmentResults] = useState<EnrollmentResult | null>(null);

  // Load cart items on component mount and when cart opens
  useEffect(() => {
    if (isOpen) {
      loadCartItems();
    }
  }, [isOpen]);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await CourseEnrollmentService.getCart();
      setCartItems(items);
    } catch (err) {
      if (err instanceof CourseEnrollmentError) {
        setError(err.message);
      } else {
        setError("Failed to load cart items");
      }
      console.error("Cart load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = useCallback(async (courseId: string) => {
    try {
      await CourseEnrollmentService.removeFromCart(courseId);
      // We must reload locally to reflect changes immediately in UI
      await loadCartItems();
    } catch (err) {
      // Error handling remains same
      let msg = "Failed to remove item";
      if (err instanceof CourseEnrollmentError) msg = err.message;
      setError(msg);
      console.error(err);
      setTimeout(() => setError(null), 3000);
    }
  }, []); // Removing loadCartItems from dependency to avoid cycles, it is stable enough or use a ref if needed

  const handleClearCart = useCallback(async () => {
    try {
      await CourseEnrollmentService.clearCart();
      setCartItems([]);
    } catch (err) {
      if (err instanceof CourseEnrollmentError) {
        setError(err.message);
      } else {
        setError("Failed to clear cart");
      }
      console.error("Failed to clear cart:", err);
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 lg:relative lg:bg-transparent lg:p-0 lg:inset-auto">
      <div className="relative w-full max-w-md rounded-lg border bg-card shadow-lg lg:max-w-full lg:h-full lg:flex lg:flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold">Enrollment Cart</h3>
          </div>
          <button
            type="button"
            className="rounded-md p-1 hover:bg-muted lg:hidden"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border p-4 animate-pulse">
                  <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-3"></div>
                  <div className="h-8 bg-muted rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="text-center">
                <button
                  type="button"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  onClick={loadCartItems}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-medium mb-1">Your cart is empty</h4>
              <p className="text-muted-foreground">
                Add courses to your cart to enroll in them.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.course_id} className="rounded-lg border p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-semibold">{item.course_name}</h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-mono bg-muted px-2 py-0.5 rounded">{item.course_code}</span>
                        <span className="inline-flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          {item.credits} Credits
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-md p-2 hover:bg-muted text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveFromCart(item.course_id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Added: {new Date(item.added_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && !loading && !error && (
          <div className="sticky bottom-0 z-20 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between mb-4">
              <span className="font-medium text-lg">Total Courses:</span>
              <span className="font-bold text-xl">{cartItems.length}</span>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-md border border-input bg-transparent px-6 py-4 text-lg font-medium hover:bg-accent transition-colors"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
              <button
                type="button"
                className="flex-[2] rounded-md bg-primary px-6 py-4 text-lg font-bold text-primary-foreground hover:bg-primary/90 shadow-sm transition-all hover:scale-[1.02]"
                onClick={async () => {
                  try {
                    const results = await CourseEnrollmentService.enrollFromCart();
                    setEnrollmentResults(results);
                    setShowConfirmation(true);
                    await loadCartItems();
                  } catch (err) {
                    if (err instanceof CourseEnrollmentError) {
                      setError(err.message);
                    } else {
                      setError("Failed to enroll from cart");
                    }
                    setTimeout(() => setError(null), 5000);
                  }
                }}
              >
                Enroll Now
              </button>
            </div>
          </div>
        )}
      </div>

      {enrollmentResults && (
        <RegistrationConfirmation
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          enrollmentResults={enrollmentResults}
        />
      )}
    </div>
  );
});

export { EnrollmentCartComponent as EnrollmentCart };
