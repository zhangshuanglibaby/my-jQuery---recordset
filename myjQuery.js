/**
 * 目的:
 * 仿照jQuery,封装一个js文件
 * 该js文件具有这些功能
 * 1.获取元素
 * 2.数组遍历
 * 3.设置css样式 :获取和设置属性
 * 4.操作类名
 */

//这里了要用自调用函数
//自调用函数的目的：形成一个局部的作用域,把自己的代码保护起来,不让其他的代码影响这里的代码

;
(function () {
  //封装用于获取元素时的函数 let 元素 = $('css选择器')
  function jQuery(selector) {
    //由于获取的值需要做许多的行为,用一个构造函数来new一个实例对象去执行这里的操作
    return new inIt(selector);
  }

  //构造函数 --- this指向实例对象
  function inIt(selector) {
    //jq中获取的元素都是伪数组
    //用原生的js先获取一个伪数组
    let dom = document.querySelectorAll(selector); //Nodelist伪数组
    //把dom伪数组里面的数据都设置给自己的实例对象里面
    //遍历dom数组
    for (let i = 0; i < dom.length; i++) {
      this[i] = dom[i];
    }
    //把dom的数组的长度也设置给自己的实例对象
    this.length = dom.length;
  }

  //要把行为-方法都设置给构造函数的原型对象inIt.prototype里面

  //分装jq中遍历的方法
  //jq中数组的遍历 $('css选择器').each(function(i,e) {})
  inIt.prototype.each = function (callback) {
    for (let i = 0; i < this.length; i++) {
      //遍历里面的逻辑是不确定的
      callback(i, this[i]); //this[i]指的是元素
    };
  }

  /**
   * jq的css方法有两个功能
   *   设置css样式  jq.对象(属性,属性值)
   *   获取css样式  jq.对象(属性) 
   */

  //封装css样式的方法 -- 有两个参数 property属性 value值 
  inIt.prototype.css = function (property, value) {
    //在原生js中,获取元素样式的方式是,let cssResult  = window.getComputedStyle(box[1]).width
    //要判断用户输入的参数是一个还是两个
    //如果是一个,则是获取属性的样式,否则是设置属性样式
    if (value === undefined) {
      //获取样式
      return window.getComputedStyle(this[0])[property]; //获取样式只需要一个元素即可
    } else {
      //设置样式
      //原生js设置样式  document.body.style.backgroundColor(css属性名) = 'pink'
      //设置属性的时候,要判断哪些属性是需要带单位的 ,如背景颜色是不需要带单位的
      //自己模拟创建一个需要带单位属性值的数组
      let pxArr = ['left', 'width', 'height', 'top', 'bottom', 'right', 'font-size'];
      //需要遍历自己的伪数组,让每个元素都能设置样式
      //判断输入的是否是需要带单位的
      //利用indexOf()方法来检索上面的数组是否有输入,如果没有则返回-1
      this.each(function (i, e) {
        if (pxArr.indexOf(property) !== -1) {
          //如果是输入了带单位的属性则执行这里的代码
          //还要判断用户设置属性值时,自己有没有加单位
          //indexOf只用于字符串
          if (value.toString().indexOf('px') === -1) {
            //如果是没加px时执行这里的代码
            e.style[property] = value + 'px';
          } else {
            e.style[property] = value;
          }
        } else {
          //如果是不需要带单位的属性则直接返回属性值
          e.style[property] = value;
        }
      })
    }
    //返回实例对象,实现jq中的链式编程
    return this;
  };


  /**
   * jq中操作类名有3中方法
   *   jq对象.addClass(类名)  --增加类名
   *   jq对象.removeClass(类名)  --移除类名
   *   jq对象.toggleClass(类名)  --切换类名
   * 
   */

  //封装增加类名的方法 -- 参数是类名
  inIt.prototype.addClass = function (className) {
    //原生js中增加类名 元素.classList.add(类名) / classList.add(类名)
    //遍历自己的数字,让每个元素都能增加类名
    this.each(function (i, e) {
      e.classList.add(className);
    })
    //返回实例对象,实现jq中的链式编程
    return this;

  };

  //封装移出类名的方法 -- 参数是类名
  inIt.prototype.removeClass = function (className) {
    //原生js中增加类名 元素.classList.remove(类名) / classList.remove(类名)
    //遍历自己的的数组,让每个元素移除类名
    this.each(function (i,e) {
      e.classList.remove(className);
    });
    //返回实例对象,实现jq中的链式编程
    return this;
  };

  //封装切换类名的方法 ---参数是类名
  inIt.prototype.toggleClass = function (className) {
    //原生js中增加类名 元素.classList.toggle(类名) / classList.toggle(类名)
    //遍历自己的的数组,让每个元素移除类名
    this.each(function (i,e) {
      e.classList.toggle(className);
    });
    //返回实例对象,实现jq中的链式编程
    return this;
  }

  //封装生成新的元素html
  inIt.prototype.html = function(html) {
    //变量是满足html语法的格式的字符串
    if(html === undefined) {
      return this[0].innerHTML  
    }else {
      return this.each(function(i,e) {
        e.innerHTML = html;
      })
    }
  }

  //封装操作元素的文本内容
  inIt.prototype.text = function(text) {
    if(text === undefined) {
      return this[0].innerText;
    }else {
      return this.each(function(i,e) {
        e.innerText = text;
      })
    }
  }

  //封装可以获取和设置元素的属性(非开关)
  inIt.prototype.attr = function(attr,value) {
    if(value === undefined) {
      //getAttribute()方法通过名称获取属性的值
      return this[0].getAttribute(attr);
    }else {
      return this.each(function(i,e) {
        e.setAttribute(attr,value);
      })
    }
  }

  //封装删除元素的属性方法
  inIt.prototype.removeAttr = function(attr) {
    return this.each(function(i,e) {
      e.removeAttribute(attr);
    })
  }

  //封装可以获取和设置元素的属性(开关)
  inIt.prototype.prop = function(property,value) {
    //开关属性的返回值是布尔类型
    if(value === undefined) {
      return this[0][property];
    } else {
      return this.each(function(i,e) {
        e[property] = Boolean(value);
      })
    }
  }

  //封装注册事件
  inIt.prototype.on = function(type,selector,fn) {
    //如果只传了两个参数,代表是普通的注册事件
    if(fn === undefined) {
      //把selector赋值给fn
      fn = selector;
      this.each(function(i,e) {
        e.addEventListener(type,fn)
      })
    }else { 
      //代表传了三个参数,事件委托注册事件
      this.each(function(i,e) {
        e.addEventListener(type,function(ev) {
          //事件触发的元素必须是父元素的后代元素,把伪数组转成数组
          let dom = Array.from(e.querySelectorAll(selector)) ;
         //判断事件触发的元素是否在数组里面
         if(dom.indexOf(ev.target) != -1) {
           //代表事件元素是在范围内的
           //把函数的this改成指向后代选择器,利用call
          fn.call(ev.target,ev)
         }         
        })
      })
    }
  }























  //让在获取元素时,可以使用$或者jQuery获取,设置如下操作
  window.$ = window.jQuery = jQuery;

})();