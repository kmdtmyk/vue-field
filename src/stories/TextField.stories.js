import {storiesOf} from '@storybook/vue'
import {withKnobs, text, number, boolean, color} from '@storybook/addon-knobs'

import TextField from '../components/TextField'

storiesOf('TextField', module)
  .addDecorator(withKnobs)
  .add('basic', () => {
    const value = text('value', 'foo')
    const size = number('size', 10)
    const readonly = boolean('readonly', false)
    const disabled = boolean('disabled', false)
    return {
      components: {TextField},
      template: `
        <div>
          <text-field v-model='value' :size='${size}' :disabled='${disabled}' :readonly='${readonly}'/>
          {{value}}
        </div>
      `,
      data(){
        return {
          value,
        }
      },
    }
  }, {info: true})
  .add('style', () => {
    const value = text('value', 'foo')
    const size = number('size', 24)
    const colour = color('color', 'red')
    return {
      components: {TextField},
      template: `
        <div>
          <text-field v-model='value' style='font-size: ${size}px; color: ${colour};'/>
          {{value}}
        </div>
      `,
      data(){
        return {value}
      },
    }
  }, {info: true})
  .add('autocomplete (array)', () => {
    return {
      components: {TextField},
      template: `
        <div>
          <text-field v-model='value' :autocomplete='["foo", "bar", "baz", "hoge", "piyo"]'/>
          {{value}}
        </div>
      `,
      data(){
        return {
          value: '',
        }
      },
    }
  }, {info: true})
  .add('autocomplete (function)', () => {
    return {
      components: {TextField},
      template: `
        <div>
          <text-field v-model='value' :autocomplete='autocomplete'/>
          {{value}}
        </div>
      `,
      data(){
        return {
          value: '',
          autocomplete: (value) => {
            return value.split('').map((value, index) => value.repeat(index + 1))
          }
        }
      },
    }
  }, {info: true})
  .add('autocomplete (async function)', () => {
    return {
      components: {TextField},
      template: `
        <div>
          <text-field v-model='value' :autocomplete='autocomplete' :async-wait='asyncWait'/>
          {{value}}
        </div>
      `,
      data(){
        return {
          value: '',
          autocomplete: async (query) => {
            if(!query){
              return []
            }
            const result = await fetch(`https://api.github.com/search/repositories?q=${query}`)
            const text = await result.text()
            const json = JSON.parse(text)
            return json.items.map(item => item.full_name)
          },
          asyncWait(query){
            if(!query){
              return 0
            }else{
              return 500
            }
          }
        }
      },
    }
  }, {info: true})
