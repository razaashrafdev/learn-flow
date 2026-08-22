import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, MessageSquarePlus, Star } from "lucide-react";
import { toast } from "sonner";

import { AppShell, studentNav } from "@/components/lms/app-shell";
import { CourseCard } from "@/components/lms/course-card";
import { EmptyState } from "@/components/lms/ui-bits";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLms, useSelectors } from "@/lib/lms/store";

export const Route = createFileRoute("/app/completed")({
  head: () => ({
    meta: [
      { title: "Completed Courses — Hamza Visuals LMS" },
      { name: "description", content: "Every course you've finished on Hamza Visuals LMS, ready to revisit any time." },
      { property: "og:title", content: "Completed Courses — Hamza Visuals LMS" },
      { property: "og:description", content: "Courses you've finished on Hamza Visuals LMS." },
    ],
  }),
  component: CompletedCourses,
});

function CompletedCourses() {
  const { data, currentUser, addReview } = useLms();
  const s = useSelectors();
  const user = currentUser!;
  const completed = data.enrollments.filter((e) => e.studentId === user.id && e.status === "completed");

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackCourseId, setFeedbackCourseId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const hasReviewed = (courseId: string) => {
    const course = data.courses.find((c) => c.id === courseId);
    return course?.reviews?.some((r) => r.author === user.name) ?? false;
  };

  const openFeedback = (courseId: string) => {
    setFeedbackCourseId(courseId);
    setRating(0);
    setHoverRating(0);
    setReviewText("");
    setFeedbackOpen(true);
  };

  const submitFeedback = () => {
    if (!feedbackCourseId || rating === 0) return;
    addReview(feedbackCourseId, rating, reviewText);
    toast.success("Feedback submitted successfully");
    setFeedbackOpen(false);
  };

  return (
    <AppShell nav={studentNav} title="Completed Courses">
      {completed.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No completed courses yet"
          description="Finish every lesson in a course and it will show up here."
          action={{ label: "Go to My Courses", to: "/app/my-courses" }}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {completed.map((e) => {
            const course = data.courses.find((c) => c.id === e.courseId);
            if (!course) return null;
            const reviewed = hasReviewed(course.id);
            return (
              <div key={e.id} className="flex flex-col gap-3">
                <CourseCard
                  course={course}
                  lessonCount={s.publishedLessonsOfCourse(course.id).length}
                  progress={{ percent: 100, label: "Completed" }}
                  appLink
                  footer={{ label: "Review Course", to: "/app/learn/$slug", params: { slug: course.slug } }}
                />
                {!reviewed && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => openFeedback(course.id)}
                  >
                    <MessageSquarePlus className="mr-1.5 h-4 w-4" />
                    Share Feedback
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div>
              <p className="mb-2 text-sm font-medium">Rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "fill-transparent text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Review (optional)</p>
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Tell others about your experience..."
                rows={4}
                maxLength={200}
              />
              <p className="mt-1 text-xs text-muted-foreground text-right">
                {reviewText.length}/200 characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitFeedback} disabled={rating === 0}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
