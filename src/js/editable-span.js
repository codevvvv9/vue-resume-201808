Vue.component('editable-span', {
  props: ['value'],
  template: `
            <span class="editableSpan">
              <span v-show="!editingName" contenteditable="true">{{ value }}</span>
              <input v-show="editingName" type="text" :value="value" @input="triggerEdit">
              <button @click="editingName = !editingName" class="button">edit</button>
            </span>`,
  data() {
    return {
      editingName: false,
    }
  },
  methods: {
    triggerEdit(e) {
      this.$emit('edit', e.target.value)
    }
  }
})