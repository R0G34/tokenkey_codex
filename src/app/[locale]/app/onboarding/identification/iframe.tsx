'use client'

interface Props {
  url: string
}

export default function IFrame({ url }: Props) {
  return (
    <>
      <iframe
        allow="camera;microphone"
        height="1180px"
        src={url}
        style={{ border: '1px solid #ccc', borderRadius: '4px' }}
        title="KYC Verification"
        width="100%"
      />
      {/* <Button onClick={handleComplete}>Complete KYC Verification</Button> */}
    </>
  )
}
