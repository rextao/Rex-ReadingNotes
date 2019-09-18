# Replace Animated GIFs with Video 

1. https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/replace-animated-gifs-with-video/
2. 20180706



## 读后总结

1. 要提高加载性能，帮助用户减少数据使用量，少用gif
2. 利用ffmpeg将gif转换为视频文件
	- 一般将GIF转换为MPEG-4（具有更高广泛的支持.mp4格式）
3. 如何将视频嵌入到页面中，让其看起来想gif



## 内容

1. 根据《20181220浏览器painting》可知，gif图会造成页面重复渲染
2. 而且，有的gif图可能会非常大，10几兆

## 转换gif到mp4

1. 使用[ffmpeg](https://www.ffmpeg.org/)工具
2. `ffmpeg -i input.gif output.mp4`，可以将gif转为mp4

### 通过crf再降低视频大小

1. Constant Rate Factor([crf](https://trac.ffmpeg.org/wiki/Encode/H.264#crf))可以控制生成视频的大小
2. 使用这个模式意味着控制生成视频的质量，而忽略文件大小
3. 默认值是23，可以设置0-51，值越小视频质量越高，一般推荐设置范围是17-28，如果发现视频质量略差，可以降低crf值
4. 不推荐用于流媒体文件上
5. `ffmpeg -i input.gif -b:v 0 -crf 25 output.mp4`
	- 将视频crf设置为25，质量略差一点，缩小视频体积
	- [-b:v 0](https://trac.ffmpeg.org/wiki/Limiting%20the%20output%20bitrate)：使用crf模式，这个值必须设置为0，限制输入比特率，如处理实时传输或特定格式，编码器可能无法处理大比特率峰值

## 转换gif到WebM

1. google推出的一种视频格式，video可以添加多个视频文件，可以作为这种视频格式的回退方案
2. `ffmpeg -i input.gif -c vp9 -b:v 0 -crf 41 output.webm`
	- -c vp9：使用VP9编码器，如果vp9参数不可用，可以使用vp8
	- -crf值，由于CRF值不会在格式之间产生相同的结果， 故需要根据视频结果调整crf值
	- 相同效果，WebM 66KB，MP4 611KB，gif 13.7MB

## 使用video

### 保证表现正确

1. gif的主要特征
	- 自动播放动画
	- 不停循环（通常可能会阻止其循环）
	- 他们无声音
2. 直接`<video autoplay loop muted playsinline></video>`就包含了上述的特征
	- muted：静音，即使视频可能没有声音也需要包含此属性
	- playinline：IOS中，自动播放需要这个属性

### 指定视频源

1. ```html
	<video autoplay loop muted playsinline>
	  <source src="oneDoesNotSimply.webm" type="video/webm">
	  <source src="oneDoesNotSimply.mp4" type="video/mp4">
	</video>
	```

## 性能对比

1. 并不是说文件大小就完全决定了性能的好坏，视频文件需要进行解码，同样需要消耗性能
2. 因此除了比较大小，还可以比较下cpu消耗情况，在performance中可以查看

### 涉及的问题

1. 将gif转换为同等质量的视频需要花费时间
2. 当用户启用data saver时，安卓的chrome是不允许自动播放的



