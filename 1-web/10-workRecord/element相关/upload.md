## upload

```
uploadSuccess(response, file, fileList) {
    if (response.result === 1) {
        this.imageList.push(response.data);
    } else {
        this.$message.error(response.message);
        const index = fileList.findIndex(x => x.uid === file.uid);
        if (index > -1) {
            fileList.splice(index, 1);
        }
    }
},
```



# 封装

## 图片上传

### 基本封装（单图）

```vue
<template>
    <div>
        <ks-el-upload
            ref="upload"
            :class="uploadClass"
            :multiple="false"
            list-type="picture-card"
            :limit="1"
            :file-list="cardPicsImg"
            :on-success="handleUploadSuccess"
            :before-upload="handleBeforeUpload"
            :on-remove="handleUploadRemove"
            :on-error="handleUploadError"
            :action="uploadAPI"
            :accept="accept"
        >
            <i class="el-icon-upload"></i>
        </ks-el-upload>
        <div class="el-upload__tip">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import {
    Upload,
} from '@ks/ks-element-ui';
import URL_API from '@/const/url-api';

export default {
    name: 'picture-upload',
    components: {
        KsElUpload: Upload,
    },
    props: {
        api: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            default: ''
        },
        accept: {
            type: String,
            default: 'image/*'
        },
        // 限制图片宽高
        limitWidth: {
            type: [String, Number],
            default: ''
        },
        limitHeight: {
            type: [String, Number],
            default: ''
        },
        // 最大尺寸
        maxSize: {
            type: [String, Number],
            default: ''
        },
    },
    data() {
        return {
            uploadAPI: `${this.$baseUrl}${URL_API[this.api]}`,
            cardPicsImg: [],
            uploadClass: '', // 限制上传一个，隐藏上传后的可上传按钮
        };
    },
    methods: {
        handleUploadSuccess(res) {
            const { url } = res.data;
            this.uploadClass = 'fill-upload';
            this.$emit('input', url);
            this.$emit('file-data', res.data);
        },
        handleBeforeUpload(file) {
            const maxSize = Number(this.maxSize);
            if (maxSize) {
                // 图片大小限制
                const isSize = file.size / 1024 < maxSize;
                if (!isSize) {
                    this.$message.error(`上传图片大小不能超过 ${maxSize}kb!`);
                    return false;
                }
            }
            if (!this.limitHeight || !this.limitWidth) {
                return file;
            }
            const width = Number(this.limitWidth); // 限制图片尺寸
            const height = Number(this.limitHeight);
            const img = new Image();
            return new Promise(function (resolve, reject) {
                img.onload = function () {
                    const valid = img.width === width && img.height === height;
                    if (valid) {
                        this.uploadClass = 'fill-upload';
                        resolve();
                    } else {
                        reject();
                    }
                };
                img.src = URL.createObjectURL(file);
            }).then(() => {
                return file;
            }, () => {
                this.$message.error(`您上传图片尺寸为：${img.width}*${img.height}, 但图片尺寸限制为${this.limitWidth} x ${this.limitHeight}`);
                return Promise.reject();
            });

        },
        handleUploadRemove() {
            this.uploadClass = '';
            this.$emit('input', '');
            this.$emit('file-data', {});
        },
        handleUploadError() {
            this.uploadClass = '';
            this.$message.error('图片上传接口出错！');
        },
    },
    watch: {
        value: {
            immediate: true,
            handler(val) {
                if (val) {
                    if (this.cardPicsImg.length === 1) {
                        return;
                    }
                    this.cardPicsImg.push({
                        url: val
                    });
                    this.uploadClass = 'fill-upload';
                } else {
                    this.cardPicsImg = [];
                    this.uploadClass = '';
                }
            }
        }
    }
};
</script>

<style scoped lang="less">
    .fill-upload {
        /deep/ .el-upload{
            display: none;
        }
    }
    .el-upload__tip{
        color: red;
        line-height: 1.5;
    }
</style>
```





### 设置图片宽高比(单图)

1. 需要fixed
   - 使用v-model传值，而不是用imgUrl
   - 修改图片上传提示语
2. 注意：
   - 如果上传接口返回key与url，key用于提交
   - watch的else会导致编辑出错。。这个else忘记干嘛来着

```vue
<template>
    <div>
        <ks-el-upload
            ref="upload"
            :class="uploadClass"
            :multiple="false"
            list-type="picture-card"
            :limit="1"
            :file-list="cardPicsImg"
            :on-success="handleUploadSuccess"
            :before-upload="handleBeforeUpload"
            :on-remove="handleUploadRemove"
            :on-error="handleUploadError"
            :action="uploadAPI"
            :accept="accept"
        >
            <i class="el-icon-upload"></i>
        </ks-el-upload>
        <div class="el-upload__tip">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import {
    Upload,
} from '@ks/ks-element-ui';
import URL_API from '@/const/url-api';
const STATE = {
    ALL: 'all',
    WIDTH: 'width',
    HEIGHT: 'height',
    NONE: 'none',
};

export default {
    name: 'picuter-upload',
    components: {
        KsElUpload: Upload,
    },
    props: {
        imgUrl: {
            type: String,
            default: ''
        },
        accept: {
            type: String,
            default: 'image/*'
        },
        // 限制图片宽高
        limitWidth: {
            type: [String, Number],
            default: ''
        },
        limitHeight: {
            type: [String, Number],
            default: ''
        },
        // 设置宽高比限制，scale: '5:4'
        // limitWidth与limitHeight，要同时设置，或不设置，否则无意义
        scale: {
            type: String,
            default: ''
        },
        // true, 则limitWidth与limitHeight为图片的最大宽高，可以小于
        isMaxLimit: {
            type: [String, Boolean],
            default: false
        },
        // 最大尺寸
        maxSize: {
            type: [String, Number],
            default: ''
        },
        errorMsg: {
            type: String,
            default: ''
        }

    },
    data() {
        return {
            uploadAPI: `${this.$baseUrl}${URL_API.RESOURCE_UPLOAD_API}`,
            cardPicsImg: [],
            uploadClass: '', // 限制上传一个，隐藏上传后的可上传按钮
        };
    },

    computed: {
        limitWidthNum() {
            return Number(this.limitWidth);
        },
        limitHeightNum() {
            return Number(this.limitHeight);
        },
        scaleArr() {
            return this.scale.split(':') || [];
        },
        hasScale() {
            return this.scale !== '';
        },
        isMaxLimitBool() {
            return Boolean(this.isMaxLimit);
        },
        getLimitState() {
            if (this.limitWidthNum) {
                if (this.limitHeightNum) {
                    return STATE.ALL;
                }
                return STATE.WIDTH;
            }
            if (this.limitHeightNum) {
                return STATE.HEIGHT;
            }
            return STATE.NONE;
        },

    },
    methods: {
        handleUploadSuccess(res) {
            const { url } = res.data;
            this.uploadClass = 'fill-upload';
            this.$emit('update:imgUrl', url);
        },
        handleBeforeUpload(file) {
            const maxSize = Number(this.maxSize);
            if (maxSize) {
                // 图片大小限制
                const isSize = file.size / 1024 < maxSize;
                if (!isSize) {
                    this.$message.error(`上传图片大小不能超过 ${maxSize}kb!`);
                    return false;
                }
            }
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    const valid = this.validateImgLimit(img);
                    if (valid) {
                        this.uploadClass = 'fill-upload';
                        resolve();
                    } else {
                        reject();
                    }
                };
                img.src = URL.createObjectURL(file);
            }).then(() => {
                return file;
            }, () => {
                const msg = this.errorMsg || '上传图片尺寸不符合要求！';
                this.$message.error(msg);
                return Promise.reject();
            });

        },
        validateImgLimit(img) {
            let valid = true;
            const state = this.getLimitState;
            const [scaleW, scaleH] = this.scaleArr;
            let validWidth = true; // 宽度是否符合要求
            let validHeight = true;// 高是否符合要求
            if (this.isMaxLimitBool) {
                validWidth = img.width <= this.limitWidthNum;
                validHeight = img.height <= this.limitHeightNum;
            } else {
                validWidth = img.width === this.limitWidthNum;
                validHeight = img.height === this.limitHeightNum;
            }
            switch (state) {
                // 同时传入限制宽高
                case STATE.ALL:
                    // limitWidth，limitHeight，scale都设置
                    if (this.hasScale) {
                        validWidth = img.width >= this.limitWidthNum;
                        validHeight = img.height >= this.limitHeightNum;
                        valid = img.width * scaleH === img.height * scaleW;
                    }
                    valid = valid && validHeight && validWidth;
                    break;
                case STATE.WIDTH:
                    valid = validWidth;
                    break;
                case STATE.HEIGHT:
                    valid = validHeight;
                    break;
                case STATE.NONE:
                    if (this.hasScale) {
                        valid = img.width * scaleH === img.height * scaleW;
                    }
                    break;
            }
            return valid;
        },
        handleUploadRemove() {
            this.uploadClass = '';
        },
        handleUploadError() {
            this.uploadClass = '';
            this.$message.error('图片上传接口出错！');
        },
    },
    watch: {
        imgUrl() {
            if (this.imgUrl) {
                if (this.cardPicsImg.length === 1) {
                    return;
                }
                this.cardPicsImg.push({
                    url: this.imgUrl
                });
                this.uploadClass = 'fill-upload';
            } else {
                this.cardPicsImg = [];
                this.uploadClass = '';
            }
        }
    }
};
</script>

<style scoped lang="less">
    .fill-upload {
        /deep/ .el-upload{
            display: none;
        }
    }
    .el-upload__tip{
        color: red;
        line-height: 1.5;
    }
</style>
```

1. 设置宽高比

   ```html
   <picture-upload
                   :imgUrl.sync="searchForm.bannerUrl"
                   limitWidth="150"
                   limitHeight="120"
                   scale="5:4"
                   accept="image/png"
                   >
   </picture-upload>
   ```






## 文件上传

```javascript
<template>
    <div>
        <ks-el-upload
            ref="upload"
            :multiple="false"
            :limit="1"
            :on-success="handleUploadSuccess"
            :on-remove="handleUploadRemove"
            :on-error="handleUploadError"
            :file-list="fileList"
            :on-exceed="handleExceed"
            :action="uploadAPI"
            :accept="accept"
            :name="name"
            :disabled="disabled"
        >
            <slot>
                <ks-el-button size="small" type="primary">
                    点击上传
                </ks-el-button>
            </slot>
        </ks-el-upload>
        <div class="el-upload__tip">
            <slot name="tip"></slot>
        </div>
    </div>
</template>

<script>
import {
    Button,
    Upload,
} from '@ks/ks-element-ui';
import URL_API from '@/const/url-api';

export default {
    name: 'file-upload',
    components: {
        KsElButton: Button,
        KsElUpload: Upload,
    },
    props: {
        name: {
            type: String,
            default: 'file'
        },
        apiKey: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            default: ''
        },
        accept: {
            type: String,
            default: '*'
        },
        val: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        exceedMsg: {
            type: String,
            default: '上传文件数量超限！'
        }
    },
    data() {
        return {
            uploadAPI: `${this.$baseUrl}${URL_API[this.apiKey]}`,
            fileList: [],
        };
    },
    methods: {
        handleUploadSuccess(res) {
            const { result, data, message } = res;
            if (result !== 1) {
                this.$message.error(`${message || ''}`);
                return;
            }
            const { key } = data;
            this.$emit('input', key);
        },
        handleExceed() {
            this.$message.warning(this.exceedMsg);
        },
        handleUploadError() {
            this.$message.error('上传接口出错！');
        },
        handleUploadRemove() {
            this.$emit('input', '');
        },
    },
    watch: {
        value: {
            immediate: true,
            handler(val) {
                if (val) {
                    if (this.fileList.length === 1) {
                        return;
                    }
                    const index = val.lastIndexOf('/') + 1;
                    this.fileList.push({
                        url: val,
                        name: val.substring(index)
                    });
                } else {
                    this.fileList = [];
                }
            }
        }
    }
};
</script>
<style scoped lang="less">
    .el-upload__tip{
        color: red;
        line-height: 1.5;
    }
</style>
```

