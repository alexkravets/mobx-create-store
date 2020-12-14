import { useState, useEffect } from 'react'

function useStore(Store) {
  const [ isReady, setIsReady ] = useState(false)

  useEffect(() => {
    if (!isReady) {
      (async () => {
        const store = new Store()
        await store.initialize()

        global.store = store
        setIsReady(true)
      })()
    }

    return
  }, [ isReady ])

  return [ global.store ]
}

export default useStore
