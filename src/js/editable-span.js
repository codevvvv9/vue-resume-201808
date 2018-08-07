Vue.component('editable-span', {
  props: ['value'],
  template: `
            <span class="editableSpan">
              <span v-show="!editing" contenteditable="true">{{ value }}</span>
              <input v-show="editing" type="text" :value="value" @input="triggerEdit">
              <button @click="editing = !editing" class="button">edit</button>
            </span>`,
  data() {
    return {
      editing: false
    }
  },
  methods: {
    triggerEdit(e) {
      console.log(e)
      this.$emit('edit', e.target.value)
      console.log(1)
      console.log(e.target.value)
    }
  }
})