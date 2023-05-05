<template>
    <ks-input
        ref="inputRef"
        v-model="model"
        v-bind="bindProps"
    >
        <template slot="prepend">
            <slot name="prepend"></slot>
        </template>
        <template slot="append">
            <slot name="append">
                <span v-if="transformConfig">{{transformConfig.text}}</span>
            </slot>
        </template>
    </ks-input>
</template>

<script lang="ts">
import { ref, computed, defineComponent } from '@vue/composition-api';
import { Input } from 'element-ui';
const TYPE_TRANSFORM_METHODS = {
    // 输入中英文，可能需要
    comma: {
        get(value) {
            return value;
        },
        output(value) {
            return value.trim().replace(/，/g, ',');
        },
    },
    // 提交数据为数组，需将逗号（中或英文）split
    array: {
        get(value) {
            if (Array.isArray(value)) {
                return value.join();
            }
            return value;
        },
        output(value) {
            // 数组类型，将以逗号（兼容中文逗号）分隔的文本数组形式输出
            if (!value) {
                return [];
            }
            return value.trim().split(/,|，/);
        },
    },
};
// append与prepend 配置
const CONFIG = {
    email: {
        text: '@test.com',
    },
};

interface IProps {
    transform: string;
    value: any;
}
export default defineComponent<IProps>({
    name: 'co-input',
    components: {
        KsInput: Input,
    },
    props: {
        value: {
            type: [String, Array, Number],
            default: '',
        },
        /**
         * default: 不进行转换
         * comma: 将中文逗号转为英文
         * array： 将逗号分隔的文本转为数组
         */
        transform: {
            type: String,
            default: 'default',
        },
    },
    setup(props, context) {
        const inputRef = ref(null);
        const transformMethod = computed(() => {
            return TYPE_TRANSFORM_METHODS[props.transform];
        });
        const transformConfig = computed(() => {
            return CONFIG[props.transform];
        });
        const model = computed({
            get() {
                const { value } = props;
                if (transformMethod.value) {
                    return transformMethod.value.get(value);
                }
                return value;
            },
            set(val) {
                let result = val;
                if (transformMethod.value) {
                    result = transformMethod.value.output(val);
                }
                context.emit('input', result);
                context.emit('change', result);
            },
        });
        const bindProps = computed(() => {
            return {
                clearable: true,
                ...context.attrs, // 直接使用解构，attrs会失去响应式
            };
        });
        const focus = () => {
            if (inputRef.value) {
                inputRef.value.focus();
            }
        };
        const handleFocus = () => {
            context.emit('focus');
        };
        return {
            inputRef,
            bindProps,
            model,
            handleFocus,
            focus,
            transformConfig,
        };
    },
});
</script>
