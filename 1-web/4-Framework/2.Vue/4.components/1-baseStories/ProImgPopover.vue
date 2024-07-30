<template>
    <element-popover v-if="!error" v-bind="bindProps" :width="parseInt(imgStyle.width) || 100" popper-class="co_img_popover__class">
        <img class="pro-img-popover" :src="url" alt="封面" :style="imgStyle" @error="handleImgError" />
        <template #reference>
            <img class="co-img-preview" :style="previewStyle" :src="url" />
        </template>
    </element-popover>
    <div v-else class="error_box" :style="previewStyle">
        <span v-if="defaultImg" class="iconfont icon-liebiaozhuangtai-fasongzhong"></span>
        <img v-else class="img" src="" alt="" />
    </div>
</template>
<script lang="ts">
import { Popover } from 'element';
import { computed, defineComponent, reactive, toRefs } from 'vue';

const DEFAULT_POPOVER = {
    trigger: 'hover',
    placement: 'right',
};
export interface IProps {
    url: string;
    imgStyle?: Record<string, { width: string; height: string }>;
    previewStyle?: Record<string, { width: string; height: string }>;
}
export default defineComponent({
    name: 'ProImgPopover',
    components: {
        ElementPopover: Popover,
    },
    props: {
        url: {
            type: String,
            default: '',
        },
        // popover弹窗图片的宽高尺寸
        imgStyle: {
            type: Object,
            default: () => ({
                width: '150px',
                height: '150px',
            }),
        },
        // 图片尺寸
        previewStyle: {
            type: Object,
            default: () => ({
                width: '50px',
                height: '50px',
            }),
        },
        // 默认图片，true，使用默认图片，false，使用默认icon，string，则使用传入图片
        defaultImg: {
            type: [String, Boolean],
            default: false,
        },
    },
    setup(props, ctx) {
        const state = reactive({
            error: false,
        });
        const bindProps = computed(() => {
            return {
                ...DEFAULT_POPOVER,
                ...ctx.attrs,
            };
        });
        function handleImgError() {
            state.error = true;
        }
        return {
            ...toRefs(state),
            bindProps,
            handleImgError,
        };
    },
});
</script>
<style lang="scss" scoped>
.pro-img-popover {
    object-fit: contain;
}
.error_box {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
        width: 100%;
        height: 100%;
    }
}
</style>

<style lang="scss">
.co_img_popover__class {
    padding: 0;
    min-width: inherit;
    line-height: 1;
}
</style>
