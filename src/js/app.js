let app = new Vue({
  el: '#app',
  data: {
    editingName: false,
    loginVisible: false,
    signUpVisible: false,
    currentUser: {
      id: '',
      email: ''
    },
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
    },
    login: {
      email: '',
      password: ''
    }
  },
  methods: {
    onEdit(key, value) {
      this.resume[key] = value
      console.log(key)
      console.log(value)
    },
    onSignUp(e) {
      // 新建 AVUser 对象实例
      var user = new AV.User();
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
    onLogin(e) {
      AV.User.logIn(this.login.email, this.login.password).then((loggedInUser) => {
        console.log(loggedInUser);
        this.currentUser = {
          id: loggedInUser.id,
          email: loggedInUser.attributes.email
        }
        // this.currentUser.id = loggedInUser.id
        // this.currentUser.email = loggedInUser.attributes.email
      }, (error) => {
        if (error.code === 211) {
          alert('用户不错在')
        } else if(error.code === 210) {
          alert('邮箱和密码不匹配')
        }
      });
    },
    onLogOut(e) {
      AV.User.logOut()
      alert('注销成功')
      window.location.reload()
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
      let {id} = AV.User.current()
      // 第一个参数是 className，第二个参数是 objectId
      var user = AV.Object.createWithoutData('User', id);
      // 修改属性
      user.set('resume', this.resume);
      // 保存到云端
      user.save();
    }
  }
})

let currentUser= AV.User.current()
if (currentUser) {
  app.currentUser = currentUser
}
