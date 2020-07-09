# 问题

1. 一些涉及源码的问题

## computed setter不生效

1. 对于数组或对象的computed，如果不是重新赋值，而是push或添加属性是无法触发getter和setter的
2. 理由是：computed`只是通过`Object.defineProperty设置了`setter`和`getter`



##  