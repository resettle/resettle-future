import { useInterval, useIsomorphicLayoutEffect } from '@resettle/design'
import { useCallback, useState } from 'react'
import { useNavigation } from 'react-router'

export default function NavigationProgressBar() {
  const { state } = useNavigation()

  const [done, setDone] = useState(true)
  const [progress, setProgress] = useState(100)

  useInterval(
    useCallback(() => {
      if (progress < 100 && !done) {
        setProgress(progress + 1)
      }
    }, [done, progress]),
    done ? null : 300,
  )

  useIsomorphicLayoutEffect(() => {
    switch (state) {
      case 'loading':
      case 'submitting':
        setDone(false)
        setProgress(0)
        setTimeout(() => {
          setProgress(10)
        }, 1)
        break
      case 'idle':
        setTimeout(() => {
          setProgress(100)
          setTimeout(() => {
            setDone(true)
          }, 300)
        }, 300)
        break
    }
  }, [state])

  if (done) {
    return null
  }

  return (
    <div
      className="fixed top-0 right-0 left-0 z-1000 h-[3px] bg-orange-500 transition-transform duration-300"
      style={{
        transformOrigin: 'left',
        transform: `scaleX(${progress}%) translate3d(0,0,0)`,
      }}
    />
  )
}
