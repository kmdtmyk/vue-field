
import {storiesOf} from '@storybook/vue'
import VueInfoAddon from 'storybook-addon-vue-info'

import SelectField from '../src/components/SelectField'

storiesOf('SelectField', module).addDecorator(VueInfoAddon)
  .add('basic', () => ({
    components: { SelectField },
    template: `
      <div>
        <select-field v-model='value' :records='records'/>{{value}}
      </div>
    `,
    data(){
      return {
        value: '',
        records: ['foo', 'bar', 'hoge']
      }
    },
  }))
  .add('function', () => ({
    components: { SelectField },
    template: `
      <div>
        <select-field v-model='value' :records='records'/>{{value}}
      </div>
    `,
    data(){
      return {
        value: '',
        records: (query) => {
          if(!query){
            return []
          }
          return query.split('')
        },
      }
    },
  }))
  .add('object array', () => ({
    components: { SelectField },
    template: `
      <div>
        <select-field v-model='value' :records='records' record-key='id'>
          <span slot-scope='{record}'>{{record.id}}. {{record.name}}</span>
        </select-field>
        {{value}}
      </div>
    `,
    data(){
      return {
        value: '',
        records: (query) => {
          const records = [
            {id: 1, name: 'foo'},
            {id: 2, name: 'bar'},
            {id: 3, name: 'hoge'},
          ]
          if(!query){
            return records
          }
          return records.filter(record => record.name.startsWith(query))
        },
      }
    },
  }))
  .add('async function', () => ({
    components: { SelectField },
    template: `
      <div>
        <select-field v-model='value' :records='records'/>{{value}}
      </div>
    `,
    data(){
      return {
        value: '',
        records: async (query) => {
          if(!query){
            return
          }
          const result = await fetch(`https://api.github.com/search/repositories?q=${query}`)
          const text = await result.text()
          const json = JSON.parse(text)
          return json.items.map(item => item.name)
        },
      }
    },
  }))