import { useState, useRef, useEffect } from "react";
import { Prize, PRIZES, getPrizeQuantities, updatePrizeQuantity } from "@/data/prizes";
import { Button } from "./ui/button";
import { PrizeModal } from "./PrizeModal";

export const SpinWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const wheelRef = useRef<SVGSVGElement>(null);

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
    
    // Calculate target rotation to align prize with top pointer
    // Add random offset within the segment for natural feel
    const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.5;
    const targetAngle = -prizeIndex * segmentAngle + randomOffset;
    
    // Add multiple full rotations for visual effect
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

        <svg
          ref={wheelRef}
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-2xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)" : "none",
          }}
        >
          <g>
            {PRIZES.map((prize, index) => {
              const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
              const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
              const middleAngle = (startAngle + endAngle) / 2;
              const isOutOfStock = quantities[prize.id] === 0;

              const x1 = 200 + 200 * Math.cos(startAngle);
              const y1 = 200 + 200 * Math.sin(startAngle);
              const x2 = 200 + 200 * Math.cos(endAngle);
              const y2 = 200 + 200 * Math.sin(endAngle);

              const textX = 200 + 130 * Math.cos(middleAngle);
              const textY = 200 + 130 * Math.sin(middleAngle);

              const largeArcFlag = segmentAngle > 180 ? 1 : 0;

              return (
                <g key={prize.id} opacity={isOutOfStock ? 0.4 : 1}>
                  <path
                    d={`M 200 200 L ${x1} ${y1} A 200 200 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={prize.color}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="48"
                    fill="white"
                    style={{ filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.5))" }}
                    transform={`rotate(${(middleAngle * 180) / Math.PI + 90}, ${textX}, ${textY})`}
                  >
                    {prize.emoji}
                  </text>
                </g>
              );
            })}
          </g>

          <circle
            cx="200"
            cy="200"
            r="40"
            fill="hsl(var(--accent))"
            stroke="white"
            strokeWidth="6"
          />
          <text
            x="200"
            y="215"
            textAnchor="middle"
            fontSize="32"
          >
            🎁
          </text>
        </svg>
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
