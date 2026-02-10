import InboxListRealtime from './inbox-list-realtime'
import InboxMessageDetailRealtime from './inbox-message-detail-realtime'

export default async function InboxPage() {
  return (
    <div className="grid gap-4 md:grid-cols-[360px_1fr]">
      <div className="md:sticky md:top-4 md:h-[calc(100vh-12rem)] md:overflow-auto">
        <InboxListRealtime />
      </div>
      <div className="overflow-x-hidden">
        <InboxMessageDetailRealtime />
      </div>
    </div>
  )
}
