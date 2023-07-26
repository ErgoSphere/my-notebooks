### vuex / vue-router
- test useStore() / useRouter()
  ```typescript
  // before describe
  jest.mock('vuex', () => ({
    createStore: jest.fn(() => ({
      state: {}
    })),
    useStore: jest.fn()
  }))
  ```
- test with config file
  ```typescript
  import store from '@/store/index'
  jest.mock('@/store/index');
  (store.dispatch as jest.Mock).mockReturnValue('')
  ```
- test store in component
  ```typescript
  import { shallowMount } from '@vue/test-utils'
  import { createStore } from 'vuex'
  import Component from 'Component.vue'
  describe('test store in component', () => {
    const store = createStore({
      state: {
        key: 1
      }
    })
    store.dispatch = jest.fn()
    const wrapper = shallowMount(Component, {
      global: {
        plugins: [store]
      }
    })
  })
  ```