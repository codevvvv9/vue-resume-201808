var app = new Vue({
  el: '#app',
  data: {
    resume: {
      name: '姓名',
      gender: '男',
      birthday: '1991-11-07',
      jobTitle: '前端工程师',
      email: 'example@example.com',
      phone: '1666666666'
    }
  },
  methods: {
    onEdit(key, value) {
      console.log(key, value);
      this.resume[key] = value
    }
  }
})
Vue.config.devtools = true;