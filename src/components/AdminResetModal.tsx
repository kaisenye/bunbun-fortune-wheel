import { useState } from 'react'
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

interface AdminResetModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export const AdminResetModal = ({ open, onClose, onConfirm }: AdminResetModalProps) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const handlePasswordSubmit = () => {
    if (password !== '4337') {
      setError('Incorrect password!')
      return
    }
    setError('')
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    onConfirm()
    handleClose()
  }

  const handleClose = () => {
    setPassword('')
    setError('')
    setShowConfirm(false)
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showConfirm) {
      handlePasswordSubmit()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        {!showConfirm ? (
          <>
            <DialogHeader>
              <DialogTitle>Admin Reset</DialogTitle>
              <DialogDescription>
                Enter the admin password to reset prize stock.
              </DialogDescription>
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
              <DialogTitle>Confirm Reset</DialogTitle>
              <DialogDescription>
                Are you sure you want to reset all prize quantities? This will restore all prizes to their initial stock.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirm}>
                Reset All Prizes
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
