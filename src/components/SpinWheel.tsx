import { useState, useRef, useEffect } from "react";
import { Prize, PRIZES, getPrizeQuantities, updatePrizeQuantity } from "@/data/prizes";
import { Button } from "./ui/button";
import { PrizeModal } from "./PrizeModal";

export const SpinWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuantities(getPrizeQuantities());
  }, []);

  const selectPrize = (): Prize | null => {
    const available = PRIZES.filter(prize => quantities[prize.id] > 0);
    if (available.length === 0) return null;

    const totalWeight = available.reduce((sum, prize) => sum + prize.chanceWeight, 0);
    let random = Math.random() * totalWeight;

    for (const prize of available) {
      random -= prize.chanceWeight;
      if (random <= 0) return prize;
    }

    return available[0];
  };

  const handleSpin = () => {
    if (spinning) return;

    const prize = selectPrize();
    if (!prize) {
      alert("All prizes have been claimed!");
      return;
    }

    setSpinning(true);

    const prizeIndex = PRIZES.findIndex(p => p.id === prize.id);
    const segmentAngle = 360 / PRIZES.length;
    const targetAngle = 360 - (prizeIndex * segmentAngle + segmentAngle / 2);
    const spins = 5;
    const finalRotation = rotation + spins * 360 + targetAngle;

    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      setWonPrize(prize);
      const newQuantity = quantities[prize.id] - 1;
      updatePrizeQuantity(prize.id, newQuantity);
      setQuantities({ ...quantities, [prize.id]: newQuantity });
    }, 4000);
  };

  const segmentAngle = 360 / PRIZES.length;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto px-4">
      <div className="relative w-full aspect-square max-w-[500px]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-accent drop-shadow-lg" />
        </div>

        <div
          ref={wheelRef}
          className="relative w-full h-full rounded-full shadow-2xl overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)" : "none",
          }}
        >
          {PRIZES.map((prize, index) => {
            const startAngle = index * segmentAngle;
            const isOutOfStock = quantities[prize.id] === 0;

            return (
              <div
                key={prize.id}
                className="absolute w-full h-full"
                style={{
                  transform: `rotate(${startAngle}deg)`,
                  transformOrigin: "center",
                }}
              >
                <div
                  className={`absolute left-1/2 top-0 w-1/2 h-1/2 origin-bottom-left transition-opacity ${
                    isOutOfStock ? "opacity-40" : ""
                  }`}
                  style={{
                    background: prize.color,
                    clipPath: `polygon(0 0, 100% 0, 100% 100%)`,
                    transform: `rotate(${segmentAngle}deg)`,
                  }}
                >
                  <div
                    className="absolute top-[20%] left-[40%] transform -rotate-90 text-center"
                    style={{
                      transform: `rotate(${segmentAngle / 2 - 90}deg)`,
                    }}
                  >
                    <div className="text-5xl mb-2">{prize.emoji}</div>
                    <div className="text-sm font-bold text-white drop-shadow-md whitespace-nowrap">
                      {quantities[prize.id] || 0}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-accent rounded-full shadow-lg flex items-center justify-center border-4 border-white">
            <span className="text-2xl font-bold text-accent-foreground">🎁</span>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSpin}
        disabled={spinning}
        size="lg"
        className="text-xl px-12 py-6 h-auto font-bold shadow-lg hover:scale-105 transition-transform disabled:scale-100"
      >
        {spinning ? "Spinning..." : "SPIN THE WHEEL!"}
      </Button>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full text-center text-sm">
        {PRIZES.map(prize => (
          <div
            key={prize.id}
            className={`p-3 rounded-lg border-2 transition-all ${
              quantities[prize.id] === 0
                ? "opacity-50 border-muted bg-muted"
                : "border-primary/20 bg-card"
            }`}
          >
            <div className="text-2xl mb-1">{prize.emoji}</div>
            <div className="font-semibold text-xs text-foreground">{prize.name}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {quantities[prize.id]} left
            </div>
          </div>
        ))}
      </div>

      {wonPrize && (
        <PrizeModal
          prize={wonPrize}
          open={!!wonPrize}
          onClose={() => setWonPrize(null)}
        />
      )}
    </div>
  );
};
