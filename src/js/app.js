let app = new Vue({
  el: '#app',
  data: {
    editingName: false,
    loginVisible: false,
    signUpVisible: false,
    currentUser: {
      objectId: '',
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
      user.signUp().then((signedUpUser) => {
        alert('注册成功啦～')
        signedUpUser = signedUpUser.toJSON()
        this.currentUser = {
          objectId: signedUpUser.objectId,
          email: signedUpUser.email
        }
        this.signUpVisible = false
      }, (error) => {
        alert(error.rawMessage)
      });
    },
    hasLogin() {return !!this.currentUser.objectId},
    onLogin(e) {
      AV.User.logIn(this.login.email, this.login.password).then((loggedInUser) => {
        loggedInUser = loggedInUser.toJSON()
        console.log(loggedInUser)
        this.currentUser = {
          objectId: loggedInUser.objectId,
          email: loggedInUser.email
        }
        this.loginVisible = false
        // this.currentUser.objectId = loggedInUser.objectId
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
      let {objectId} = AV.User.current().toJSON()
      // 第一个参数是 className，第二个参数是 objectId
      var user = AV.Object.createWithoutData('User', objectId);
      // 修改属性
      user.set('resume', this.resume);
      // 保存到云端
      user.save().then(() => {
        alert('保存成功了')
      },() => {
        alert('保存失败了')
      });
    },
    getResume() {
      var query = new AV.Query('User');
      query.get(this.currentUser.objectId).then((user) => {
        // 成功获得实例
        // todo 就是 id 为 57328ca079bc44005c2472d0 的 Todo 对象实例
        console.log(user)
        let resume = user.toJSON().resume
        this.resume = resume
      },  (error) => {
        // 异常处理
      });
    }
  }
})

let currentUser= AV.User.current()
if (currentUser) {
  app.currentUser = currentUser.toJSON()
  app.getResume()
}
