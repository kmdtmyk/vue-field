import {mount} from '@vue/test-utils'
import Component from './SelectField'

describe('name', () => {

  it('has hidden field', () => {
    const wrapper = mount(Component, {
      propsData: {
        name: 'foo',
        value: 'bar',
      }
    })
    const input = wrapper.find('input[type=text]')
    const hidden = wrapper.find('input[type=hidden]')
    expect(input.attributes().name).toBeUndefined()
    expect(hidden.attributes().name).toBe('foo')
    expect(hidden.attributes().value).toBe('bar')
  })

})

describe('autocomplete', () => {

  it('force off', () => {
    const wrapper = mount(Component, {
      propsData: {
        autocomplete: 'on',
      }
    })
    const input = wrapper.find('input[type=text]')
    expect(input.attributes().autocomplete).toBe('off')
  })

})

describe('input class', () => {

  it('attribute', () => {

    const subject = inputClass => {
      const wrapper = mount(Component, {
        propsData: {
          inputClass,
          value: 'abc',
        }
      })
      const input = wrapper.find('input[type=text]')
      return input.attributes().class
    }

    expect(subject('foo bar')).toEqual('foo bar')
    expect(subject(['foo', 'baz'])).toEqual('foo baz')
    expect(subject({foo: true, bar: false, hoge: true})).toEqual('foo hoge')
  })

})

describe('value', () => {

  it('string', () => {
    const wrapper = mount(Component, {
      propsData: {
        value: 'foo',
      },
    })
    expect(wrapper.vm.value).toEqual('foo')
    expect(wrapper.emitted().input).toBeUndefined()
  })

  it('object', () => {
    const wrapper = mount(Component, {
      propsData: {
        value: {id: 1, name: 'foo'},
      },
    })
    expect(wrapper.vm.value).toEqual({id: 1, name: 'foo'})
    expect(wrapper.emitted().input).toBeUndefined()
  })

})

describe('placeholder', () => {

  it('attribute', () => {
    const subject = (value, placeholder) => {
      const wrapper = mount(Component, {
        propsData: {
          value,
          placeholder,
        },
      })
      const input = wrapper.find('input')
      return input.attributes().placeholder
    }

    expect(subject(null, 'foo')).toBe('foo')
    expect(subject('', 'foo')).toBe('foo')
    expect(subject(0, 'foo')).toBe('0')
    expect(subject('', '')).toBe('')
    expect(subject('', null)).toBe(undefined)
  })

  it('without slot', () => {
    const subject = (records, value) => {
      const wrapper = mount(Component, {
        propsData: {
          records,
          value,
        },
      })
      const input = wrapper.find('input')
      return input.attributes().placeholder
    }

    expect(subject([], 'value')).toBe('value')
    expect(subject(['foo'], 'value')).toBe('value')
    expect(subject(() => [], 'value')).toBe('value')
  })

  it('with slot', () => {
    const subject = (value, asyncWait = null) => {
      const records = [
        {id: 1, name: 'foo'},
        {id: 2, name: 'bar'},
      ]

      const wrapper = mount(Component, {
        propsData: {
          records,
          value,
          recordKey: 'id',
          asyncWait,
        },
        scopedSlots: {
          default: '<div>{{props.record.id}}. {{props.record.name}}</div>'
        },
      })
      const input = wrapper.find('input')
      return input.attributes().placeholder
    }

    expect(subject(1)).toBe('1. foo')
    expect(subject(2, 100)).toBe('2')
  })

  it('with record', () => {
    const wrapper = mount(Component, {
      propsData: {
        recordKey: 'id',
        value: 1,
        record: {id: 1, name: 'foo'},
      },
      scopedSlots: {
        default: '<div>{{props.record.id}}. {{props.record.name}}</div>'
      },
    })
    const input = wrapper.find('input')
    expect((input.attributes().placeholder)).toEqual('1. foo')
  })

  it('set props record', () => {
    const wrapper = mount(Component, {
      propsData: {
        recordKey: 'id',
      },
      scopedSlots: {
        default: '<div>{{props.record.id}}. {{props.record.name}}</div>'
      },
    })

    const input = wrapper.find('input')

    expect((input.attributes().placeholder)).toBeUndefined()
    wrapper.setProps({record: {id: 1, name: 'foo'}})
    expect((input.attributes().placeholder)).toEqual('1. foo')
  })

})

describe('clear button', () => {

  const subject = (records, value) => {
    const wrapper = mount(Component, {
      propsData: {
        records,
        value,
      },
    })
    const clear = wrapper.find('.clear')
    return clear.exists()
  }

  it('exists', () => {
    expect(subject([], 0)).toBe(true)
    expect(subject([], 1)).toBe(true)
    expect(subject([], 'foo')).toBe(true)
  })

  it('not exists', () => {
    expect(subject([], '')).toBe(false)
    expect(subject([], null)).toBe(false)
    expect(subject([], undefined)).toBe(false)
  })

})

describe('key event', () => {

  describe('delete', () => {

    it('emit null when value is present', () => {
      const records = [
        {id: 1, name: 'foo'}
      ]
      const value = 1
      const wrapper = mount(Component, {
        propsData: {
          records,
          value,
          recordKey: 'id'
        },
        scopedSlots: {
          default: '<span>{{props.record.id}}. {{props.record.name}}</span>',
        },
      })
      const input = wrapper.find('input[type=text]')
      expect(input.attributes().placeholder).toEqual('1. foo')
      input.trigger('keydown.delete')
      expect(wrapper.emitted().input[0]).toEqual([null])
      wrapper.setProps({value: wrapper.emitted().input[0][0]})
      expect(input.attributes().placeholder).toBeUndefined()
    })

    it('not emit when value is null', () => {
      const records = [
        {id: 1, name: 'foo'}
      ]
      const wrapper = mount(Component, {
        propsData: {
          records,
          value: null,
          recordKey: 'id'
        },
      })
      const input = wrapper.find('input[type=text]')
      expect(wrapper.vm.selectedRecord).toBeNull()
      input.trigger('keydown.delete')
      expect(wrapper.vm.selectedRecord).toBeNull()
      expect(wrapper.emitted().input).toBeUndefined()
    })

  })

})

describe('dropdown list', () => {

  describe('length', () => {

    const subject = (records) => {
      const wrapper = mount(Component, {
        propsData: {
          records
        }
      })
      const input = wrapper.find('input')
      input.trigger('input')
      return wrapper.findAll('.dropdown-list-item').length
    }

    it('array', () => {
      const records = [
        'foo',
        'bar',
        'hoge',
      ]
      expect(subject(records)).toBe(3)
    })

    it('function', () => {
      const records = () => {
        return [
          'foo',
          'bar',
          'hoge',
        ]
      }
      expect(subject(records)).toBe(3)
    })

    it('null', () => {
      const records = null
      expect(subject(records)).toBe(0)
    })

  })

  describe('empty', () => {

    it('slot exists', () => {
      const subject = (inputValue) => {
        const records = [
          'foo',
          'bar',
          'hoge',
        ]
        const wrapper = mount(Component, {
          propsData: {
            records,
          },
          scopedSlots: {
            empty(){
              return 'empty message'
            }
          },
        })
        const input = wrapper.find('input[type=text]')
        input.trigger('focus')
        wrapper.setData({inputValue})
        return wrapper.find('.dropdown-list-item.empty')
      }

      expect(subject('').exists()).toEqual(false)
      expect(subject('f').exists()).toEqual(false)
      expect(subject('zzz').exists()).toEqual(true)
    })

    it('slot not exists', () => {
      const subject = (inputValue) => {
        const records = [
          'foo',
          'bar',
          'hoge',
        ]
        const wrapper = mount(Component, {
          propsData: {
            records,
          },
        })
        const input = wrapper.find('input[type=text]')
        input.trigger('focus')
        wrapper.setData({inputValue})
        return wrapper.find('.dropdown-list-item.empty')
      }

      expect(subject('').exists()).toEqual(false)
      expect(subject('f').exists()).toEqual(false)
      expect(subject('zzz').exists()).toEqual(false)
    })

  })

})

describe('select', () => {

  it('string', () => {
    const wrapper = mount(Component)
    wrapper.vm.select('foo')
    expect(wrapper.emitted('input')[0]).toEqual(['foo'])
  })

  it('records is null', () => {
    const wrapper = mount(Component, {
      propsData: {
        records: null,
      },
    })
    wrapper.vm.select('foo')
    expect(wrapper.emitted('input')[0]).toEqual(['foo'])
  })

  it('emit update:record if record key exists', () => {
    const wrapper = mount(Component, {
      propsData: {
        recordKey: 'id',
      },
    })
    wrapper.vm.select({id: 1, name: 'foo'})
    expect(wrapper.emitted('input')[0]).toEqual([1])
    expect(wrapper.emitted('update:record')[0]).toEqual([{id: 1, name: 'foo'}])
  })

})
