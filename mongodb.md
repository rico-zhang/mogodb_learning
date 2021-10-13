# 1-1 mongodb的安装
MongoDB官网：https://www.mongodb.com/zh

# windows下安装mongodb

下载`msi`安装程序

一步一步安装即可



# MacOS下安装mongodb

安装流程：https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

首先安装`homebrew`

**注意事项：**

在安装过程中如果出现权限不足的问题，输入命令：

```shell
sudo chown -R $(whoami) /usr/local/include /usr/local/lib /usr/local/lib/pkgconfig
```



添加开启自启动服务时需要使用`sudo`



# 安装robo 3T

类似于`mysql`的`navicat`

下载地址：https://robomongo.org/



#  基础概念

- `db`：和`mysql`的概念一致
- `collection`：集合，类似于`mysql`中的表
- `document`：每个集合中的文档，类似于`mysql`中的记录
  - `Primary Key`：和`mysql`中的主键含义一致，每个`document`都有一个主键
  - `field`：文档中的字段

![image-20200521170211855](http://mdrs.yuanjin.tech/img/image-20200521170211855.png)

`mongodb`属于`nosql`中的文档型数据库，每个文档相当于是一个对象，它没有列的概念，也没有表关系

由于它是一个`nosql`数据库：

- 无`sql`语句
- 使用极其简单，学习成本非常低
- 由于没有集合之间的关联，难以表达复杂的数据关系
- 存取速度极快

由于它是一个`文档型`数据库：

- 数据内容非常丰富和灵活
- 对数据结构难以进行有效的限制

*** 

# 1-2 mongodb的基本操作

通过`mongo`命令，即可进入`mongodb`的`shell`交互环境，在`shell`环境中，很多时候都可以使用简单的`js`语句即可完成对`mongodb`的控制



下面是`mongo`的常用命令：

1. 查看所有数据库：

   ```
   show dbs;
   ```

2. 显示当前使用的数据库：

   ```
   db;
   ```

3. 查看当前数据库状态：

   ```
   db.stats()
   ```

4. 查看数据库中所有的集合：

   ```shell
   show collections;
   ```

5. 切换数据库：

   ```shell
   use 数据库名;
   ```

6. 向集合中添加文档：

   ```js
   db.collection.insertOne({文档内容});
   db.collection.insertMany([多个文档]);
   ```

   > 新的文档如果没有指定字段`_id`，则会自动添加一个字段`_id`作为主键
   >
   > 自动的主键是一个`ObjectId`对象，该对象是通过调用函数`ObjectId()`创建的
   >
   > 它的原理是根据`时间戳+机器码+进程Id+自增量`生成的一个十六进制的唯一字符串
   >
   > 使用`ObjectId`函数还可以把某个字符串还原成一个`ObjectId`对象，例如`ObjectId("xxxxx")`

7. 查询文档：

   ```js
   db.collection.find(查询对象);
   ```

8. 修改文档：

   ```shell
   db.collection.updateOne(<filter>, <update>)
   db.collection.updateMany(<filter>, <update>)
   db.collection.replaceOne(<filter>, <update>)
   ```

9. 删除文档：

   ```shell
   db.collection.deleteMany(查询对象)
   db.collection.deleteOne(查询对象)
   ```

***

# 1-3 Schema和modal

mongodb的驱动就叫做`mongodb`



> 创建连接、模型定义，CRUD



mongoose官网：https://mongoosejs.com/

mongoose民间中文网：http://www.mongoosejs.net/



schema: 结构，描述某种数据中有哪些字段、每个字段是什么类型、每个字段的约束

模型：对应数据库中集合的文档



模型：



1. 用户：

   ```js
   {
     loginId:"账号",
     loginPwd:"密码",
     name:"姓名",
     loves: ["爱好"],
     address: {
       province: "省份",
       city: "城市"
     }
   }
   ```

   



2. 用户操作：

   ```js
   {
     operation: "登录",
     time: 日期,
     userid: 用户的id,
     extraInfo: 任意对象, // 操作额外的信息
     address: { // 操作的地址
       province: "省份",
       city: "城市"
     }
   }
   ```

   
***

# 1-4 文档新增

# mongodb原生操作

```js
// 新增单个数据，doc是一个文档对象
db.<collection>.insertOne(doc); 

// 新增多个数据，docs是一个文档数组
db.<collection>.insertMany(docs); 

// 新增单个或多个数据，返回新增的行数，doc即可以是一个文档对象，也可以是一个文档数组
db.<collection>.insert(doc); 
```

> mognoose中的所有验证规则在原生操作中无效

# mongoose操作

**方式1：创建模型对象，然后保存**

```js
var obj = new <Model>(doc); 
var result = await obj.save(); // 保存文档到数据库，会触发验证，也可以使用回调模式
```

**方式2：直接使用函数创建对象**

```js
// 创建一个或多个文档
// 也可以使用回调模式
// 若传入单个对象，返回单个对象
// 若传入多个对象，返回一个数组
var result = await <Model>.create(...doc); 
```



**创建操作的细节**：

- `mongoose`会为每个对象（包括子对象）添加唯一键`_id`，这是一种极好的的做法，特别是在对象数组中，可以有效的维护数据的唯一标识

  - 如果希望禁用这种做法，只需要在相应的`Schema`中配置`_id: false`

- `mongoose`在创建文档时，会自动生成一个字段`__v`，该字段用于方式并发冲突（后续课程中讲解）

  - 如果希望禁用这种做法，只需要在`Schema`的第二个参数中配置`versionKey: false`

- `mongoose`总是会在保存文档时触发验证，如果希望禁用这种行为，可以有两种做法：

  - 在`Schema`的第二个参数中配置`validateBeforeSave:false`，这将导致使用该`Schema`的`Model`在保存时均不会触发验证

  - 在调用`save`方法或`create`方法时，传入一个配置对象，配置`validateBeforeSave:false`，这样一来，仅针对这一次调用不进行验证。当给`create`方法传入配置时，为了避免歧义，需要将第一个参数设置为数组。

    > `mongoose`支持`<Model>.validate(doc, [context])`直接对文档进行验证，该验证是异步的。
    >
    > 当验证失败时，抛出的错误类型是`ValidationError`
    >
    > 注意：unique在数据库中表现为唯一索引（unique index），并不属于验证的范畴，因此尽管`unique`约束不满足，也不会导致验证失败，最终在添加时会抛出`MongoError`，而不是`ValidationError`

- `<Model>.create(doc, option)`等效于`new <Model>(doc).save(option)`

  - 如果你给`create`传入的是多个文档，则其在内部会创建多个模型，然后循环调用它们的`save`方法

- 无论用哪一种方式，都会得到**模型实例**，该实例会被`mongoose`持续跟踪，只要对模型实例的修改都会被记录，一旦重新调用模型实例的`save`方法，就会把之前对模型的所有更改持久化到数据库。

- 新增对象时，如果遇到`Schema`中没有定义的字段，则会被忽略

*** 

# 1-5 文档查询

# 补充

1. `mongoodb`操作和`mongoose`操作对比

![image-20200601150124530](http://mdrs.yuanjin.tech/img/image-20200601150124530.png)

2. `mongodb`的备份与恢复

```shell
# 恢复
mongorestore -d <dbname> <backupDir>
# 备份
mongodump -d <dbname> -o <backupDir>
```



# mongodb原生查询

```js
// 根据条件、投影查询指定集合，返回游标
db.<collection>.find([filter], [projection]); 
```

## 返回结果

查询返回的是一个游标对象，它类似于迭代器，可以在查询结果中进行迭代

<img src="http://mdrs.yuanjin.tech/img/image-20200601154340434.png" alt="image-20200601154340434" style="zoom:50%;" />

`cursor`的成员：

- `next()`：游标向后移动，并返回下一个结果，如果没有结果则报错
- `hasNext()`：判断游标是否还能向后移动，返回`boolean`
- `skip(n)`：去前面的`n`条数据，**返回`cursor`**
- `limit(n)`：取当前结果的`n`条数据，**返回`cursor`**
- `sort(sortObj)`：按照指定的条件排序，**返回`cursor`**
- `count()`：得到符合`filter`的结果数量，返回`Number`
- `size()`：得到最终结果的数量，返回`Number`

由于某些函数会继续返回`cursor`，因此可以对其进行链式编程，返回`cursor`的函数成为了链中的一环，无论它们的调用顺序如何，始终按照下面的顺序执行：

```
sort -> skip -> limit
```



## 查询条件

`find`函数的第一个参数是查询条件`filter`，它的写法极其丰富，下面列举了大部分情况下我们可能使用到的写法。

```js
// 查询所有 name="曹敏" 的用户
{
  name: "曹敏" 
}

// 查询所有 loginId 以 7 结尾 并且 name 包含 敏 的用户
{
  loginId: /7$/ , 
 	name: /敏/  
}

// 查询所有 loginId 以 7 结尾 或者 name 包含 敏 的用户
{
  $or: [
    {
      loginId: /7$/,
    },
    {
      name: /敏/  
    },
  ],
}
  
// 查询所有年龄等于18 或 20 或 25 的用户
{
  age: {
    $in: [18, 20, 25]
  }
}
  
// 查询所有年龄不等于18 或 20 或 25 的用户
{
  age: {
    $nin: [18, 20, 25]
  }
}
  
// 查询所有年龄在 20~30 之间的用户
{
  age: {
    $gt: 20,
    $lt: 30
  }
}
```

查询中出现了一些特殊的属性，它以`$`开头，表达了特殊的查询含义，这些属性称之为`操作符 operator`

查询中的常用操作符包括：

- `$or`：或者
- `$and`：并且
- `$in`：在...之中
- `$nin`：不在...之中
- `$gt`：大于
- `$gte`：大于等于
- `$lt`：小于
- `$lte`：小于等于
- `$ne`：不等于



## 投影

`find`中的第二个参数`projection`表示投影，类似于`mysql`中的`select`

它是一个对象，表达了哪些字段需要投影到查询结果中，哪些不需要

```js
// 查询结果中仅包含 name、age，以及会自动包含的 _id
{
  name: 1,
  age: 1
}

// 查询结果不能包含 loginPwd、age，其他的都要包含
{
  loginPwd: 0,
  age: 0
}

// 查询结果中仅包含 name、age，不能包含_id
{
  name: 1,
  age: 1,
  _id: 0
}

// 错误：除了 _id 外，其他的字段不能混合编写
{
  name: 1,
  age: 0
}
```



# mongoose中的查询

```js
<Model>.findById(id); // 按照id查询单条数据
<Model>.findOne(filter, projection); // 根据条件和投影查询单条数据
<Model>.find(filter, projection); // 根据条件和投影查询多条数据
```

`findOne`和`find`如果没有给予回调或等待，则不会真正的进行查询，而是返回一个`DocumentQuery`对象，可以通过`DocumentQuery`对象进行链式调用进一步获取结果，直到传入了回调、等待、调用`exec`时，才会真正执行。

链式调用中包括：

- `count`
- `limit`
- `skip`
- `sort`



## 差异点

1. `count`得到的是当前结果的数量
2. 查询`id`时，使用字符串即可
3. `projection`支持字符串写法
4. `sort`支持字符串写法
5. `populate`支持关联查询

*** 

# 1-6 文档更新

# mongodb原生

```js
// 根据查询条件，更新结果中的第一篇文档，更新的内容由update参数决定，options决定更新的一些细节
db.<collection>.updateOne(filter, update, [options]); 

// 根据查询条件，更新所有结果，更新的内容由update参数决定，options决定更新的一些细节
db.<collection>.updateMany(filter, update, [options]); 
```

## 过滤条件

同查询一致

## 更新内容

第二个参数决定了更新哪些字段，它的常见写法如下：

1. 字段操作

```js
// 将匹配文档的 name 设置为 邓哥，address.city 设置为 哈尔滨
{
  $set: { name:"邓哥", "address.city": "哈尔滨" }
}

// 将匹配文档的 name 设置为 邓哥，并将其年龄增加2
{
  $set: { name:"邓哥" },
  $inc: { age: 2 }
}

// 将匹配文档的 name 设置为 邓哥，并将其年龄乘以2
{
  $set: { name:"邓哥" },
  $mul: { age: 2 }
}

// 将匹配文档的 name 字段修改为 fullname
{
  $rename: { name: "fullname" }
}

// 将匹配文档的 age 字段、address.province 字段 删除
{
  $unset: {age:"", "address.province":""}
}
```



2. 数组操作

```js
// 向 loves 添加一项：秋葵
// 若数组中不存在则进行添加 若存在则不进行任何操作
{
  $addToSet: {
    loves: "秋葵"
  }
}

// 向 loves 添加一项：秋葵
// 无论数组中是否存在，都必定会添加
{
  $push: {
    loves: "秋葵"
  }
}

// 向 loves 添加多项：秋葵 香菜
{
  $push: {
    loves: { $each: ["秋葵", "香菜"]}
  }
}

// 删除 loves 中满足条件的项: 是秋葵 或 香菜
{
  $pull: {
    loves: {$in: ["秋葵","香菜"]}
  }
}

// 将所有loves中的 其他 修改为 other
// 该操作符需要配合查询条件使用
db.users.updateOne({
  loves: "其他"
}, {
  $set: {
    "loves.$": "other"
  }
})
```

> 更多的操作符见：https://docs.mongodb.com/manual/reference/operator/update/

## 其他配置

第三个参数是其他配置

- `upsert`：默认`false`，若无法找到匹配项，则进行添加



# mongoose

方式1：在模型实例中进行更新，然后保存

```js
const u = await User.findById("5ed093872e3da2b654983476");
u.address.province = "黑龙江";
u.loves.push("秋葵", "香菜");
await u.save(); // 此时会自动对比新旧文档，完成更新
```



方式2：直接使用函数进行更新

```js
<Model>.updateOne(filter, doc, [options]);
<Model>.updateMany(filter, doc, [options]);
```



这种方式与原生的区别：

- `_id`可以直接使用字符串进行匹配
- `doc`中可以省略`$set`，直接更改即可
- 默认情况下，不会触发验证，需要在`options`设置`runValidators: true`开启验证

*** 

# 1-7 文档删除

# mongodb原生

```js
db.<collection>.deleteOne(filter)
db.<collection>.deleteMany(filter)
```



# mongoose

```js
<Model>.deleteOne(filter);
<Model>.deleteMany(filter);
```

***

# 1-8 索引

# 索引的概念

在数据库中，索引类似于一个目录，用于快速定位到具体的内容

**使用索引可以显著的提高查询效率，但会增加额外的存储空间**

无索引的查询：

<img src="http://mdrs.yuanjin.tech/img/image-20200602140525636.png" alt="image-20200602140525636" style="zoom:50%;" />

带索引的查询：

<img src="http://mdrs.yuanjin.tech/img/image-20200602140824950.png" alt="image-20200602140824950" style="zoom:50%;" />

# mongodb中的索引操作

## 创建索引

```js
// 为某个集合创建索引
db.<collection>.createIndex(keys, [options]);
```

- `keys`：指定索引中关联的字段，以及字段的排序方式，1为升序，-1为降序

  ```js
  // 索引关联 age 字段，按照升序排序
  { age: 1 }
  ```

- `options`索引的配置

  - `background`：默认`false`，建索引过程会阻塞其它数据库操作，是否以后台的形式创建索引
  - `unique`：默认`false`，是否是唯一索引
  - `name`：索引名称

> 在mongodb中，索引的存储结构是B-树

## 其他索引操作

```js
// 查看所有索引
db.<collection>.getIndexes()
// 查看集合索引占用空间
db.<collection>.totalIndexSize()
// 删除所有索引
db.<collection>.dropIndexes()
// 删除集合指定索引
db.<collection>.dropIndex("索引名称")
```



# 最佳实践

- 针对数据量大的集合使用索引
- 针对常用的查询或排序字段使用索引
- 尽量避免在程序运行过程中频繁创建和删除索引

***

# 1-9 mongoose的并发版本管理

# mongoose中的并发管理

![image-20200602172616148](http://mdrs.yuanjin.tech/img/image-20200602172616148.png)

当多个异步函数同时操作数据库时，就可能发生这样的情况，具体的场景往往发生在并发请求中

面对这种情况，`mongoose`作出以下假设：

- 当修改一个文档时，如果某些字段已经不再和数据库对应，说明这个字段的数据是脏数据（dirty data），对于脏数据，不应该对数据库产生影响
- 当修改一个文档时，如果字段和数据库是对应的，则是正常数据，正常数据可以正常的更改数据库



因此，`mongoose`对于上述场景的处理如下：

![image-20200602172739999](http://mdrs.yuanjin.tech/img/image-20200602172739999.png)

可以看出，对于`user2`的修改，`name`和`loginId`是脏数据，因此不会更新到数据库中，而`age`是正常数据，对它的更改会应用到数据库

然而，`mongoose`无法准确的判定对数组是否是脏数据，因此，如果遇到数组的修改，`mongoose`会做出如下处理：

- 当新增文档时，会自动添加字段`__v`，用于记录更新版本号，一开始为`0`
- 通过模型实例对数组进行修改后，保存时会在内部调用实例的`increment`函数，将版本号`+1`
- 当其他模型实例也更改了数组，保存时会对比版本号，如果不一致，则会引发`VersionError`

原理图如下：

![image-20200602183628001](http://mdrs.yuanjin.tech/img/image-20200602183628001.png)



出现错误是好事，可以提醒开发者：这一次保存的某些数据是脏数据，应该引起重视。开发者可以灵活的根据具体情况作出处理，比如提示用户保存失败，或者重新获取数据然后保存。

由于`mongoose`仅针对数组进行版本控制，如果要针对所有字段都进行版本控制，需要使用`mongoose`的插件：`mongoose-update-if-current`

> 插件地址：https://github.com/eoin-obrien/mongoose-update-if-current
>
> 该插件有一个`bug`，需要手动解决

使用插件后，所有的字段都将受到版本控制，一旦版本不一致，将引发`VersionError`

***

# 1-10 mongodb的分布式架构

# mongodb的分布式架构

![image-20200603113348923](http://mdrs.yuanjin.tech/img/image-20200603113348923.png)

***

# 1-11 虚拟属性和模型方法

# 虚拟属性

```js
new Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  fullName: {
    virtual: true, // 虚拟属性，不会持久化到数据库
    get(){
      // 读取该属性时运行的函数
      return this.firstName + " " + this.lastName;
    }
  }
})
```



# 模型方法

```js
var schema = new Schema({});
schema.methods.methodName = fn; // 添加实例方法
schema.static("methodName", fn); // 添加静态方法
```



