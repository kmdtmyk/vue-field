import {storiesOf} from '@storybook/vue'
import {withKnobs, number, boolean, color} from '@storybook/addon-knobs'

import NumberField from '../components/NumberField'

storiesOf('NumberField', module)
  .addDecorator(withKnobs)
  .add('basic', () => {
    const value = number('value', 12345.67)
    const size = number('size', 10)
    const readonly = boolean('readonly', false)
    const disabled = boolean('disabled', false)
    return {
      components: {NumberField},
      template: `
        <div>
          <number-field v-model='value' :size='${size}' :disabled='${disabled}' :readonly='${readonly}'/>
          {{value}}
        </div>
      `,
      data(){
        return {value}
      },
    }
  }, {info: true})
  .add('style', () => {
    const value = number('value', 123456789)
    const size = number('size', 24)
    const colour = color('color', 'red')
    return {
      components: {NumberField},
      template: `
        <div>
          <number-field v-model='value' style='font-size: ${size}px; color: ${colour};'/>
          {{value}}
        </div>
      `,
      data(){
        return {value}
      },
    }
  }, {info: true})
  .add('delimiter', () => {
    const value = number('value', 12345.67)
    const delimiter = boolean('delimiter', true)
    return {
      components: {NumberField},
      template: `
        <div>
          <number-field v-model='value' :delimiter='${delimiter}'/>
          {{value}}
        </div>
      `,
      data(){
        return {value}
      },
    }
  }, {info: true})
  .add('precision', () => {
    const value = number('value', 123.45)
    const precision = number('precision', 2)
    return {
      components: {NumberField},
      template: `
        <div>
          <number-field v-model='value' :precision='${precision}'/>
          {{value}}
        </div>
      `,
      data(){
        return {value}
      },
    }
  }, {info: true})
  .add('min and max', () => {
    const value = number('value', 50)
    const min = number('min', 0)
    const max = number('max', 100)
    return {
      components: {NumberField},
      template: `
        <form>
          <number-field v-model='value' :min='${min}' :max='${max}'/>
          {{value}}
        </form>
      `,
      data(){
        return {value}
      },
    }
  }, {info: true})
