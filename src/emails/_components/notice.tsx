import { Section, Text } from '@react-email/components'

interface Props {
  notice: string
  noticeTitle: string
}

export const Notice = ({ notice, noticeTitle }: Props) => {
  return (
    <Section className="rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-4">
      <Text className="m-0 text-gray-700">
        <strong>{noticeTitle}</strong> {notice}
      </Text>
    </Section>
  )
}
