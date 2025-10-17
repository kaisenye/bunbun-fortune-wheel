import { SpinWheel } from "@/components/SpinWheel";
import { resetPrizeQuantities } from "@/data/prizes";
import { Button } from "@/components/ui/button";

const Index = () => {
  const handleReset = () => {
    if (confirm("Reset all prize quantities? This will restore all prizes to their initial stock.")) {
      resetPrizeQuantities();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-2">
            🎪 Slime Spin & Win! 🎪
          </h1>
          <p className="text-lg text-muted-foreground">
            Spin the wheel and win amazing prizes!
          </p>
        </header>

        <SpinWheel />

        <footer className="text-center mt-12 text-sm text-muted-foreground">
          <p className="mb-2">Thank you for shopping with us!</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs"
          >
            Admin: Reset Stock
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default Index;
