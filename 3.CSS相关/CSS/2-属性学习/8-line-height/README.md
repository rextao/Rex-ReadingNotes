

## line-height撑开div高度

1. 可以看到，当line-height为0时，div高度为0，line-height：20px，div高度为20px

   ```html
   <head>
       <style>
           div {border:1px solid #cccccc;   background:#eeeeee;margin-bottom: 40px;}
           .test1{font-size:20px; line-height:0; }
           .test2{font-size:0; line-height:20px; }
       </style>
   </head>
   
   <body style="padding: 40px;">
       <div class="test1">测试</div>
       <div class="test2">测试</div>
   </body>
   ```

   ![img](README.assets/image0.png)

   - 原因：每个文字都会形成一个inline-box，行高默认为1.2文字大小



 

## 外层div未设置高度，则由一个个inline-box堆叠

1. 行高40的`span`将整行撑高

   ```html
   <style>
   	span {border:1px solid;font-size:10px;display: inline-block;}
   </style>
   <span style="line-height: 20px;">行高20<span style="line-height: 40px">行高40</span></span>
   ```

   - ![img](README.assets/image1.png)

 



 

 

 

 

 

 

 