<template>
    <div>
        <el-upload
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
        </el-upload>
        <div class="el-upload__tip">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'picture-upload',
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
        // 最大尺寸
        maxSize: {
            type: [String, Number],
            default: ''
        }

    },
    data() {
        return {
            uploadAPI: '',
            cardPicsImg: [],
            uploadClass: '', // 限制上传一个，隐藏上传后的可上传按钮
        };
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
            if (!this.limitHeight || !this.limitWidth) {
                return file;
            }
            const width = Number(this.limitWidth); // 限制图片尺寸
            const height = Number(this.limitHeight);
            return new Promise(function (resolve, reject) {
                const img = new Image();
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
                this.$message.error(`图片尺寸限制为${this.limitWidth} x ${this.limitHeight}`);
                return Promise.reject();
            });

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
            // Todo，如果外面没有使用到
            if (this.imgUrl) {
                // 避免imgUrl是对象，导致新建时图片不显示
                if (this.imgUrl !== 'string') {
                    return;
                }
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
