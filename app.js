/**
 * 
 * @authors Phelps Chou
 * @date    2017-02-28 16:39:55
 * @version $Id$
 */

import Vue from 'vue';
import AV from 'leancloud-storage';

let APP_ID = 'NIBvX6tQOTPhLV3tY00uPii6-gzGzoHsz';
let APP_KEY = 'bkLlTnqDmOrBEKTkqCnsUO92';

// 初始化LeanCloud SDK
AV.init({
  appId: APP_ID,
	appKey: APP_KEY
});


// 每个 Vue.js 应用都是通过构造函数 Vue 创建一个 Vue 的根实例启动的
var app = new Vue({
	el: '#app',
	data: {
    newTodo: '',  //表单输入和应用状态中做双向数据绑定
    todoList: [],  //所有待办事项的容器
		actionType: 'signUp',  //默认显示注册表单
    isSignColor:true,
    isLoginColor:false,
    formData: {
      username: '',
      password: ''
    },
    currentUser: null  //当前无用户，即处于非登入状态，显示界面
	},
  //实例会调用一些生命周期钩子，给我们提供了执行自定义逻辑的机会。例如，created 这个钩子在实例被创建之后被调用  
  created: function(){
    this.currentUser = this.getCurrentUser();
    this.fetchTodos();
  },
  methods: {
    updateTodos: function(){
      let dataString = JSON.stringify(this.todoList) 
      let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id)
      avTodos.set('content', dataString)
      avTodos.save().then(()=>{
        console.log('更新成功')
      });
    },
    saveTodos: function(){
      let dataString = JSON.stringify(this.todoList)
      var AVTodos = AV.Object.extend('AllTodos');
      var avTodos = new AVTodos();

      var acl = new AV.ACL();
      acl.setReadAccess(AV.User.current(),true); // 只有这个 user 能读
      acl.setWriteAccess(AV.User.current(),true); // 只有这个 user 能写

      avTodos.set('content', dataString);
      avTodos.setACL(acl) // 设置访问控制

      avTodos.save().then((todo)=>{
        this.items.id=todo.id;
        console.log("保存成功");
      },function(error){
        console.error("保存失败");
      });
    },

    saveOrUpdateTodos: function(){
      if(this.todoList.id){
        this.updateTodos()
      } else{
        this.saveTodos()
      }
    },
    fetchTodos:function(){
      if(this.currentUser){
       var query = new AV.Query('AllTodos');
       console.log(query)
       query.find()
         .then((todos)=> {
          let avAllTodos = todos[0];
          let id = avAllTodos.id;
          this.items = JSON.parse(avAllTodos.attributes.content);
          this.items.id=id;
          console.log(this.items.id)         
         }, function(error){
           console.error(error) 
         })
      }
    },

    addTodo: function(){
      let times=new Date();
      let currentTime=times.getFullYear()+"年"+ (times.getMonth()+1)+"月"+times.getDate()+"日";
      this.todoList.push({
        title: this.newTodo,
        createAt: currentTime,  //添加时间戳
        done: false  // 添加一个done属性，标记开始为未完成状态
      });
      // console.log(this.todoList)
      this.newTodo = '';  //添加后输入框清空
      // this.saveTodos();
      this.saveOrUpdateTodos(); // 不能用 saveTodos 了
    },
    isfinish: function(item){
      item.done = !item.done;
      this.saveOrUpdateTodos();
    },
    isdelete: function(item){
      let index = this.todoList.indexOf(item);
      this.todoList.splice(index, 1);
      // this.saveTodos();
      this.saveOrUpdateTodos(); // 不能用 saveTodos 了
    },
    changeBtn:function(type){
      [this.isSignColor,this.isLoginColor]=[false,false];  //解构赋值
      if(type==="signup"){
        this.actionType='signUp';
        this.isSignColor=true;
      }
      if(type==="login"){
        this.actionType='login';
        this.isLoginColor=true;
      }      
    },
    signUp: function(){
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then((loginedUser) => {
        this.currentUser = this.getCurrentUser()
      }, (error) => {
        alert('用户名已被注册')
      });
    },
    login:function(){
      AV.User.logIn(this.formData.username,this.formData.password).then((loginedUser) => {
        this.currentUser = this.getCurrentUser();  
        this.fetchTodos();
        window.location.reload();                 
      }, function (error) {
        alert("登录失败")
      });
    },
    getCurrentUser: function(){
      let current = AV.User.current()
      if (current) {
        let {id, createdAt, attributes: {username}} = AV.User.current();
        return {id, username, createdAt};
      } else {
        return null;
      }
    },
    logOut: function(){
      AV.User.logOut();
      this.currentUser = null;
      window.location.reload();
    }
  }
});