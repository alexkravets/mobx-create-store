import { set, action, computed, observable, makeObservable } from 'mobx'

function createStore(
  AsyncStorage,
  storeKey    = '@default',
  observables = {},
  actions     = [],
  computes    = []
) {
  class StoreClass {
    constructor() {
      for (const key in observables) {
        const title = key.charAt(0).toUpperCase() + key.substr(1)

        const saveMethod = `save${title}Async`
        this[saveMethod] = value => this._saveOneAsync(key, value)

        const setMethod = `set${title}`
        this[setMethod] = value => this._setMap({ [key]: value })
      }

      const schema = {
        _setMap: action
      }

      for (const key in observables) {
        this[key]   = observables[key]
        schema[key] = observable
      }

      for (const key of actions) {
        schema[key] = action
      }

      for (const key of computes) {
        schema[key] = computed
      }

      makeObservable(this, schema)
    }

    async initialize() {
      const map = {}

      for (const key in observables) {
        const json = await AsyncStorage.getItem(`${storeKey}_${key}`)

        if (json) {
          const value = JSON.parse(json).value
          map[key] = value
        }
      }

      this._setMap(map)

      await this.onInitialize()
    }

    onInitialize() {
      return null
    }

    setMany(map) {
      this._validateMap(map)
      this._setMap(map)
    }

    async saveManyAsync(map) {
      this._validateMap(map)

      for (const key in map) {
        const value = map[key]
        const json  = JSON.stringify({ value })

        await AsyncStorage.setItem(`${storeKey}_${key}`, json)
      }

      this._setMap(map)

      return
    }

    resetAsync() {
      const map = {}

      for (const key in observables) {
        map[key] = null
      }

      return this.saveManyAsync(map)
    }

    _setMap(map) {
      set(this, map)
    }

    _validateMap(map) {
      const keys = Object.keys(observables)

      for (const key in map) {
        const isKeyDefined = keys.includes(key)

        if (isKeyDefined) { continue }

        throw new Error(`Attribute "${key}" is not defined for "${storeKey}" store.`)
      }

      return
    }

    async _saveOneAsync(key, value) {
      const json = JSON.stringify({ value })

      await AsyncStorage.setItem(`${storeKey}_${key}`, json)

      this._setMap({ [key]: value })

      return
    }
  }

  return StoreClass
}

export default createStore
