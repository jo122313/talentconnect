import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Mail, Calendar, MapPin } from "lucide-react"

interface InterviewNotificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidate: {
    _id: string
    fullName: string
    email: string
    job: {
      title: string
    }
  } | null
  onConfirm: (interviewDetails: {
    date: string
    time: string
    location: string
    additionalNotes: string
  }) => void
}

const InterviewNotificationDialog = ({
  open,
  onOpenChange,
  candidate,
  onConfirm
}: InterviewNotificationDialogProps) => {
  const { toast } = useToast()
  const [interviewDetails, setInterviewDetails] = useState({
    date: "",
    time: "",
    location: "",
    additionalNotes: ""
  })
  const [sending, setSending] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setInterviewDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    if (!interviewDetails.date || !interviewDetails.time || !interviewDetails.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (date, time, location).",
        variant: "destructive",
      })
      return
    }

    setSending(true)
    try {
      await onConfirm(interviewDetails)
      
      // Reset form
      setInterviewDetails({
        date: "",
        time: "",
        location: "",
        additionalNotes: ""
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to send interview notification:", error)
    } finally {
      setSending(false)
    }
  }

  const previewMessage = candidate ? `
Dear ${candidate.fullName},

Congratulations! We are pleased to inform you that you have been selected for an interview for the position of ${candidate.job.title}.

Interview Details:
📅 Date: ${interviewDetails.date || '[Date]'}
⏰ Time: ${interviewDetails.time || '[Time]'}
📍 Location: ${interviewDetails.location || '[Location]'}

${interviewDetails.additionalNotes ? `Additional Notes:\n${interviewDetails.additionalNotes}` : ''}

We look forward to meeting with you and discussing your qualifications in detail.

Best regards,
The Hiring Team
  `.trim() : ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-job-blue" />
            Schedule Interview - {candidate?.fullName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Interview Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={interviewDetails.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Interview Time *</Label>
              <Input
                id="time"
                type="time"
                value={interviewDetails.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Interview Location *
            </Label>
            <Input
              id="location"
              value={interviewDetails.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="e.g., Office Address, Google Meet Link, Zoom Meeting ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
            <Textarea
              id="additionalNotes"
              value={interviewDetails.additionalNotes}
              onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
              placeholder="Any special instructions, documents to bring, dress code, etc."
              rows={3}
            />
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-2">Email Preview:</h4>
            <div className="text-sm text-gray-700 whitespace-pre-line bg-white p-3 rounded border">
              {previewMessage}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={sending}
            className="bg-job-blue hover:bg-job-purple"
          >
            {sending ? "Sending..." : "Send Interview Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InterviewNotificationDialog