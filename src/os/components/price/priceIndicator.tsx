import { useCallback, useEffect, useState } from 'react'

import IonIcon from 'shared/ionicon'

import { fetchCGK } from 'shared/helper'
import { parseColor } from './parseColor'

const PriceIndicator = ({
  ticket,
  colorized = false,
}: {
  ticket: string
  colorized?: boolean
}) => {
  const [cgkData, setCGKData] = useState<CgkData>()

  const getCGKData = useCallback(async () => {
    const cgkData = await fetchCGK(ticket)
    return setCGKData(cgkData)
  }, [ticket])

  useEffect(() => {
    getCGKData()
  }, [getCGKData])

  let name = 'remove-outline'
  if (cgkData?.priceChange < 0) name = 'arrow-down-outline'
  if (cgkData?.priceChange > 0) name = 'arrow-up-outline'
  const color = parseColor(cgkData?.priceChange)
  return (
    <span style={{ color: colorized ? color : 'inherit' }}>
      <IonIcon name={name} />
    </span>
  )
}

export default PriceIndicator
