'use client'

// https://github.com/PaulLeCam/react-leaflet/issues/956

import dynamic from 'next/dynamic'

export const ProjectMap = dynamic(() => import('./map'), { ssr: false })
