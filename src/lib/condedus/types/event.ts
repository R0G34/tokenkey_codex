export type Event = {
  date: string // DateTime, when the file was created
  subject: string // individual
  category: string // default: "Legitimation"
  file: string // relative path to the file
  key: string
  modified: string // timestamp in the form YYYY-MM-DDTHH:mm:ss (ISO 8601) is important for the respective record. It describes the last change and is essential for the history. It must always correspond to the status of the data record.
}
