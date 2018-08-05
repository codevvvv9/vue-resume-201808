let app
app = new Vue({
  el: '#app',
  data: {
    editingName: false,
    loginVisible: false,
    signUpVisible: false,
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
      this.resume[key] = value
    },
    onClickSave() {
      let currentUser = AV.User.current()
      console.log(currentUser)

      if (!currentUser) {
        this.loginVisible = true
      } else {
        this.saveResume()
      }
    },
    saveResume() {

    }
  }
});