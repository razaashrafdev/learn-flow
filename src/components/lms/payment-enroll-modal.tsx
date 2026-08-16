import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/lms/ui-bits";

export function PaymentEnrollModal({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (screenshotUrl: string) => void;
  loading: boolean;
}) {
  const [screenshot, setScreenshot] = useState("");

  const handleSubmit = () => {
    if (!screenshot) return;
    onSubmit(screenshot);
    setScreenshot("");
  };

  const handleClose = (open: boolean) => {
    if (!open) setScreenshot("");
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Payment Screenshot</DialogTitle>
          <DialogDescription>
            Upload your payment receipt or screenshot for verification. Your enrollment will be
            reviewed by an administrator.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <ImageUpload
            value={screenshot}
            onChange={setScreenshot}
            placeholder="Upload payment screenshot"
            className="w-full"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!screenshot || loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit Enrollment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
