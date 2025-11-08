import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  getPrizeQuantities,
  updatePrizeQuantity,
  resetPrizeQuantities,
  getBasePrizes,
} from '@/data/prizes'
import {
  getPrizeProbabilities,
  updateAllPrizeProbabilities,
  resetPrizeProbabilities,
  DEFAULT_PRIZE_PROBABILITIES,
  type PrizeProbabilityKey,
} from '@/data/prizeConstants'

interface AdminModalProps {
  open: boolean
  onClose: () => void
  onSave?: () => void
}

export const AdminModal = ({ open, onClose, onSave }: AdminModalProps) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [probabilities, setProbabilities] = useState<Record<PrizeProbabilityKey, number>>({})
  const [hasChanges, setHasChanges] = useState(false)

  const basePrizes = getBasePrizes()

  useEffect(() => {
    if (showAdminPanel) {
      // Load current quantities and probabilities
      setQuantities(getPrizeQuantities())
      setProbabilities(getPrizeProbabilities())
      setHasChanges(false)
    }
  }, [showAdminPanel])

  const handlePasswordSubmit = () => {
    if (password !== '4337') {
      setError('Incorrect password!')
      return
    }
    setError('')
    setShowAdminPanel(true)
  }

  const handleQuantityChange = (prizeId: string, value: string) => {
    const numValue = parseInt(value, 10)
    if (!isNaN(numValue) && numValue >= 0) {
      setQuantities({ ...quantities, [prizeId]: numValue })
      setHasChanges(true)
    }
  }

  const handleProbabilityChange = (prizeId: PrizeProbabilityKey, value: string) => {
    const numValue = parseInt(value, 10)
    if (!isNaN(numValue) && numValue > 0) {
      setProbabilities({ ...probabilities, [prizeId]: numValue })
      setHasChanges(true)
    }
  }

  const handleSave = () => {
    // Save quantities
    Object.entries(quantities).forEach(([prizeId, quantity]) => {
      updatePrizeQuantity(prizeId, quantity)
    })

    // Save probabilities
    updateAllPrizeProbabilities(probabilities)

    setHasChanges(false)
    if (onSave) {
      onSave()
    }
    handleClose()
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all quantities and probabilities to default values?')) {
      resetPrizeQuantities()
      resetPrizeProbabilities()
      setQuantities(getPrizeQuantities())
      setProbabilities(getPrizeProbabilities())
      setHasChanges(false)
      if (onSave) {
        onSave()
      }
    }
  }

  const handleClose = () => {
    setPassword('')
    setError('')
    setShowAdminPanel(false)
    setHasChanges(false)
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showAdminPanel) {
      handlePasswordSubmit()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {!showAdminPanel ? (
          <>
            <DialogHeader>
              <DialogTitle>Admin Panel</DialogTitle>
              <DialogDescription>Enter the admin password to manage prizes.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter admin password"
                  className={error ? 'border-red-500' : ''}
                  autoFocus
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handlePasswordSubmit}>Continue</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Admin Panel - Prize Management</DialogTitle>
              <DialogDescription>
                View and edit prize quantities and probabilities. Changes are saved to localStorage.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Prize Quantities</h3>
                <div className="grid gap-4">
                  {basePrizes.map((prize) => (
                    <div key={prize.id} className="flex items-center gap-4">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-2xl">{prize.emoji}</span>
                        <Label htmlFor={`qty-${prize.id}`} className="font-medium min-w-[150px]">
                          {prize.name}:
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`qty-${prize.id}`}
                          type="number"
                          min="0"
                          value={quantities[prize.id] ?? 0}
                          onChange={(e) => handleQuantityChange(prize.id, e.target.value)}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">left</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="text-lg font-semibold">Prize Probabilities</h3>
                <p className="text-sm text-muted-foreground">
                  Higher values = higher probability of winning. These weights are relative to each other.
                </p>
                <div className="grid gap-4">
                  {basePrizes.map((prize) => {
                    const prizeId = prize.id as PrizeProbabilityKey
                    return (
                      <div key={prize.id} className="flex items-center gap-4">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-2xl">{prize.emoji}</span>
                          <Label htmlFor={`prob-${prize.id}`} className="font-medium min-w-[150px]">
                            {prize.name}:
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            id={`prob-${prize.id}`}
                            type="number"
                            min="1"
                            value={probabilities[prizeId] ?? DEFAULT_PRIZE_PROBABILITIES[prizeId]}
                            onChange={(e) => handleProbabilityChange(prizeId, e.target.value)}
                            className="w-24"
                          />
                          <span className="text-sm text-muted-foreground">weight</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="destructive" onClick={handleReset}>
                Reset All
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={!hasChanges}>
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

