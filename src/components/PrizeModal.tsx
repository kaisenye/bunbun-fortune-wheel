import { Prize } from "@/data/prizes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface PrizeModalProps {
  prize: Prize;
  open: boolean;
  onClose: () => void;
}

export const PrizeModal = ({ prize, open, onClose }: PrizeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            🎉 Congratulations!
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="text-8xl animate-bounce">{prize.emoji}</div>
          <h3 className="text-2xl font-bold text-primary">{prize.name}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Show this screen to claim your prize!
          </p>
        </div>
        <Button onClick={onClose} size="lg" className="w-full">
          Claim Prize
        </Button>
      </DialogContent>
    </Dialog>
  );
};
