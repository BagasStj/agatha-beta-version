import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PhoneCall from "./PhoneCall"
import PhoneCallPhoneNumber from "./PhoneCallPhoneNumber"
import PhoneCallSchedule from "./phonecallSchedule"
import { Brain, ClockIcon, Phone } from "lucide-react"

export function PhoneTabs() {
  return (
    <Tabs defaultValue="assistant" className="w-full h-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="assistant">
          <Brain className="w-4 h-4 mr-2" />
          AI Assistant Call
        </TabsTrigger>
        <TabsTrigger value="phonenumber">
          <Phone className="w-4 h-4 mr-2" />
          Phone Number Call
        </TabsTrigger>
        <TabsTrigger value="schedule">
          <ClockIcon className="w-4 h-4 mr-2" />
          Call Schedule
        </TabsTrigger>
      </TabsList>
      <TabsContent value="assistant" className="h-[calc(100%-48px)] overflow-y-auto">
        <PhoneCall />
      </TabsContent>
      <TabsContent value="phonenumber" className="h-[calc(100%-48px)] overflow-y-auto">
        <PhoneCallPhoneNumber />
      </TabsContent>
      <TabsContent value="schedule" className="h-[calc(100%-48px)] overflow-y-auto">
        <PhoneCallSchedule />
      </TabsContent>
    </Tabs>
  )
}