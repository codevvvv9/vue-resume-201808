let app = new Vue({
  el: '#app',
  data: {
    editingName: false,
    loginVisible: false,
    signUpVisible: false,
    shareVisible: false,
    previewUser: {
      objectId: ""
    },
    previewResume: {

    },
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
      phone: '1666666666',
      skills: [
        {name: '请填写技能名称', description: '请填写技能描述'},
        {name: '请填写技能名称', description: '请填写技能描述'},
        {name: '请填写技能名称', description: '请填写技能描述'},
        {name: '请填写技能名称', description: '请填写技能描述'},
      ],
      projects: [
        {name: '请填写项目名称', link: 'http://...', keywords: '请填写关键字', description: '请填写技能描述'},
        {name: '请填写项目名称', link: 'http://...', keywords: '请填写关键字', description: '请填写技能描述'},
        {name: '请填写项目名称', link: 'http://...', keywords: '请填写关键字', description: '请填写技能描述'},
      ]
    },
    signUp: {
      userName: '',
      email: '',
      password: ''
    },
    login: {
      email: '',
      password: ''
    },
    shareLink: '当前没有用户登录，请选择注册',
    mode: 'edit'
  },
  computed: {
    displayResume() {
      return this.mode === 'preview' ? this.previewResume : this.resume
    }
  },
  watch: {
    'currentUser.objectId': function (newValue, OldValue) {
      if (newValue) {
        this.getResume(this.currentUser)
      }
    }
  },
  methods: {
    onEdit(key, value) {
      //使用正则表达式把[0]形式分解成.0.
      let reg = /\[(\d+)\]/g
      key = key.replace(reg, (match, number) => `.${number}`)
      keys = key.split('.')
      let result = this.resume
      for (let i = 0; i < keys.length; i++) {
        // result = this.resume
        // i = 0 result = result['skills'] = this.resume['skills']
        // i = 1 result = result['o'] = this.resume['skills']['0']
        // i = 2 result = result['name'] = this.resume['skills']['0']['name']
        if (i === keys.length - 1) {
          result[keys[i]] = value
        } else {
          result = result[keys[i]]
        }
      }

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
    getResume(user) {
      var query = new AV.Query('User')
      return query.get(user.objectId).then((user) => {
        let resume = user.toJSON().resume
        return resume
      },  (error) => {
        // 异常处理
      });
    },
    addSkill() {
      this.resume.skills.push({name: '请填写技能名称', description: '请填写技能描述'})
    },
    removeSkill(index) {
      this.resume.skills.splice(index, 1)
    },
    addProject() {
      this.resume.projects.push({name: '请填写项目名称', link: 'http://...', keywords: '请填写关键字', description: '请填写技能描述'})
    },
    removeProject(index) {
      this.resume.projects.splice(index, 1)
    },
  }
})

//获取当前用户
let currentUser= AV.User.current()
if (currentUser) {
  app.currentUser = currentUser.toJSON()
  app.shareLink = location.origin + location.pathname + '?user_id=' + app.currentUser.objectId
  app.getResume(app.currentUser).then(resume => {
    app.resume = resume
  })
}

//获取预览用户的id
let search = location.search
let regex = /user_id=([^&]+)/
let matches = search.match(regex)
let userId
if (matches) {
  userId = matches[1]
  app.mode = 'preview'
  app.getResume({objectId: userId}).then(resume => {
    // console.log(this)
    app.previewResume = resume
  })
}

