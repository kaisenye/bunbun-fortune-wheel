import { useState } from 'react'
import { SpinWheel } from '@/components/SpinWheel'
import { AdminResetModal } from '@/components/AdminResetModal'
import { resetPrizeQuantities } from '@/data/prizes'
import { Button } from '@/components/ui/button'

const Index = () => {
  const [showResetModal, setShowResetModal] = useState(false)

  const handleReset = () => {
    resetPrizeQuantities()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">🎪 BunBun Spin & Win! 🎪</h1>
          <p className="text-lg text-muted-foreground">Spin the wheel and win amazing prizes!</p>
        </header>

        <SpinWheel />

        <footer className="text-center mt-12 text-sm text-muted-foreground">
          <p className="mb-2">Thank you for shopping with us!</p>
          <Button variant="ghost" size="sm" onClick={() => setShowResetModal(true)} className="text-xs">
            Admin: Reset Stock
          </Button>
        </footer>

        <AdminResetModal
          open={showResetModal}
          onClose={() => setShowResetModal(false)}
          onConfirm={handleReset}
        />
      </div>
    </div>
  )
}

export default Index
