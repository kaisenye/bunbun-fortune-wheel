import { useState } from 'react'
import { SpinWheel } from '@/components/SpinWheel'
import { AdminModal } from '@/components/AdminModal'
import { Button } from '@/components/ui/button'

const Index = () => {
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAdminSave = () => {
    // Trigger a refresh of the SpinWheel component to reload prizes and quantities
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">🐱 BunBun Spin & Win! 🎂</h1>
          <p className="text-lg text-muted-foreground">Spin the wheel and win amazing prizes!</p>
        </header>

        <SpinWheel key={refreshKey} />

        <footer className="text-center mt-12 text-sm text-muted-foreground">
          <p className="mb-2">Thank you for shopping with us!</p>
          <Button variant="ghost" size="sm" onClick={() => setShowAdminModal(true)} className="text-xs">
            Admin Panel
          </Button>
        </footer>

        <AdminModal open={showAdminModal} onClose={() => setShowAdminModal(false)} onSave={handleAdminSave} />
      </div>
    </div>
  )
}

export default Index
