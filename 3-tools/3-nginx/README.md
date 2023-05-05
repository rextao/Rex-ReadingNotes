# 配置规则

## root 和 alias 的区别

1. 请求的URI是`/t/a.html`

```nginx
# 返回服务的/www/root/html/t/a.html的文件。
location ^~ /t/ {
    root /www/root/html/;
}

# 返回服务器上的/www/root/html/new_t/a.html的文件。
# 注意这里是new_t，因为alias会把location后面配置的路径丢弃掉，把当前匹配到的目录指向到指定的目录。
location ^~ /t/ {
    alias /www/root/html/new_t/;
}
```



## location匹配

### 语法规则

```nginx
location [ = | ~ | ~* | ^~ ] uri { ... }
location @name { ... }
```

1. `=` 表示精确匹配。只有请求的url路径与后面的字符串完全相等时，才会命中。
2. `~` 表示使用正则定义的，区分大小写
3. `~*` 表示使用正则定义的，不区分大小写。
4. `^~` 表示如果该符号后面的字符是最佳匹配，采用该规则，不再进行后续的查找。

### 匹配规则

1. 使用正则定义的location在配置文件中出现的顺序很重要，匹配到后就不会往后查找

```nginx
location = / {
    [ configuration A ]
}
location / {
    [ configuration B ]
}
location /user/ {
    [ configuration C ]
}
location ^~ /images/ {
    [ configuration D ]
}
location ~* \.(gif|jpg|jpeg)$ {
    [ configuration E ]
}
```

1. 请求`/user/1.jpg`匹配E。首先进行前缀字符的查找，找到最长匹配项C，继续进行正则查找，找到匹配项E。因此使用E
2. 请求`/images/1.jpg`匹配D。首先进行前缀字符的查找，找到最长匹配D。不再进行查找；但如果不适用 `^~`，会往后继续查找，故最终会匹配E



## @name的用法

1. 主要用于内部重定向，不能用来处理正常的请求

   ```nginx
   location / {
       try_files $uri $uri/ @custom
   }
   location @custom {
       # ...do something
   }
   ```

   - 当尝试访问url找不到对应的文件就重定向到我们自定义的命名location



# 常用命令

1. ps aux | grep nginx
2. kill -9 6446 6447
3. sudo nginx -s reload    （重启nginx）
4. sudo nginx   （启动nginx）
5. 重命名：mv test.html test2.html  



## 用户切换

1.  sudo su -   切换根用户
2.  sudo su xxxx  切换xxx用户



## 通常配置位置

1. /etc/nginx/conf.d



# 常用工具

1. location match tester
   - https://nginx.viraptor.info/
2. 可视化配置nginx
   - https://github.com/digitalocean/nginxconfig.io