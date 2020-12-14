# @kravc/mobx-create-store

MobX create store helper for react native.

## Usage Example

```sh
npm i --save @kravc/mobx-create-store
npm i --save @react-native-async-storage/async-storage
```

Define store class:

```js
import AsyncStorage    from '@react-native-async-storage/async-storage'
import { createStore } from '@kravc/mobx-create-store'

const observables = {
  lastName:  '',
  firstName: ''
}

class ProfileStore extends createStore(AsyncStorage, '@profile_v1', observables) {
}

export default ProfileStore
```

Initialize store via `useStore` hook:

```js
import React from 'react'
import { useStore, observer } from '@kravc/mobx-create-store'

import ProfileStore from './ProfileStore'

const App = function () {
  const [ store ] = useStore(ProfileStore)

  const isLoading = !store

  if (isLoading) {
    return null
  }

  return (
    <View store={store} />
  )
}

export default observer(App)
```

Check out [interface](./src/createStore.js#3) for more usage examples.
