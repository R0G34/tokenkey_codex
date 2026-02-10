import { Heading, Section, Text } from '@react-email/components'

interface Props {
  heading: string
  greeting: string | undefined
}

export const Header = ({ heading, greeting }: Props) => {
  return (
    <Section className="text-center">
      <Heading className="text-3xl font-bold text-gray-800">{heading}</Heading>
      {greeting && (
        <Text className="mt-2 text-lg text-gray-600">{greeting}</Text>
      )}
    </Section>
  )
}
