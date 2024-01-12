import { UseBoundStore, create } from 'zustand'
import { StoreApi } from 'zustand/vanilla'

// These types were removed between zustand 3.4.x and 4.4.x
export type SetState<S> = StoreApi<S>['setState']
export type UseStore<S> = UseBoundStore<StoreApi<S>>

export interface CrossRefProperties<S extends Object> {
  initialized: boolean
  useStore: UseStore<S>
}

export interface CrossRefStore<P> {
  getOwner: () => P // Reference to the Properties that contains the Store
}

export function createCrossRefProps<
  P extends CrossRefProperties<S>,
  S extends Object,
>(props: P = {} as P, generateStoreProps: (set: SetState<S>) => Object) {
  props.initialized = false
  props.useStore = create<S>((set: SetState<S>) => {
    const storeProps = generateStoreProps(set) as S
    return { getOwner: () => props, ...storeProps }
  }) as UseStore<S>

  return props
}
