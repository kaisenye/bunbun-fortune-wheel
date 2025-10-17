import { SpinWheel } from "@/components/SpinWheel";
import { resetPrizeQuantities } from "@/data/prizes";
import { Button } from "@/components/ui/button";

const Index = () => {
  const handleReset = () => {
    if (confirm("Reset all prize quantities? This will restore all prizes to their initial stock. 重置所有奖品数量？")) {
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
          <h2 className="text-2xl sm:text-3xl font-semibold text-accent mb-4">
            史莱姆转盘抽奖
          </h2>
          <p className="text-lg text-muted-foreground">
            Spin the wheel and win amazing prizes! 转动转盘赢取精美礼品！
          </p>
        </header>

        <SpinWheel />

        <footer className="text-center mt-12 text-sm text-muted-foreground">
          <p className="mb-2">Thank you for shopping with us! 感谢您的购买！</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs"
          >
            Admin: Reset Stock 管理员：重置库存
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default Index;
