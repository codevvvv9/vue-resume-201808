let app = new Vue({
  el: '#app',
  data: {
    editingName: false,
    loginVisible: false,
    signUpVisible: true,
    resume: {
      name: '姓名',
      gender: '男',
      birthday: '1991-11-07',
      jobTitle: '前端工程师',
      email: 'example@example.com',
      phone: '1666666666'
    },
    signUp: {
      userName: '',
      email: '',
      password: ''
    }
  },
  methods: {
    onEdit(key, value) {
      this.resume[key] = value
    },
    onSignUp(e) {
      console.log(e);
      console.log(this)
      console.log(this.signUp)
      // 新建 AVUser 对象实例
      var user = new AV.User();
      console.log(1);
      console.log(user);
      // 设置用户名
      user.setUsername(this.signUp.userName);
      // 设置密码
      user.setPassword(this.signUp.password);
      // 设置邮箱
      user.setEmail(this.signUp.email);
      user.signUp().then(function (user) {
        console.log(user);
      }, function (error) {
        console.log(error);
      });
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
