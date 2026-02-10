import Image from 'next/image'

export default function Partners() {
  const partners = [
    // {
    //   id: 1,
    //   title: 'camara',
    //   url: '/img/logo/camara-madrid-logo.png',
    // },
    {
      id: 2,
      title: 'esma',
      url: '/img/logo/esma-logo.png',
    },
    {
      id: 3,
      title: 'erc3643',
      url: '/img/logo/erc3643-logo.png',
    },
    // {
    //   id: 4,
    //   title: 'camara',
    //   url: '/img/logo/camara-madrid-logo.png',
    // },
    {
      id: 5,
      title: 'adigital',
      url: '/img/logo/adigital-logo.svg',
    },
    // {
    //   id: 6,
    //   title: 'camara',
    //   url: '/img/logo/camara-madrid-logo.png',
    // },
    {
      id: 7,
      title: 'camara',
      url: '/img/logo/camara-madrid-logo.png',
    },
    {
      id: 8,
      title: 'alastria',
      url: '/img/logo/alastria-logo.png',
    },
  ]

  return (
    <section className="flex flex-wrap items-center justify-around gap-8 py-4">
      {partners.map(({ id, title, url }) => (
        <Image
          alt={`${title} logo`}
          className="object-contain"
          height={64}
          key={id}
          src={url}
          width={112}
          // width={0}
        />
      ))}
    </section>
  )
}
