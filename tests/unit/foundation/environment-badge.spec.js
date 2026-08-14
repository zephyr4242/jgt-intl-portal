import { shallowMount } from '@vue/test-utils'
import EnvironmentBadge from '@/components/jgt-environment-badge/index.vue'

describe('mock environment badge', () => {
  it('is visible in the test mock build', () => {
    const wrapper = shallowMount(EnvironmentBadge, { mocks: { $t: key => key } })
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('mockEnvironmentBadge')
  })
})
