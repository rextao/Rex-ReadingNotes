<template>
    <ks-select
        class="co_select"
        ref="select"
        v-model="model"
        @focus="handleFocus"
        v-bind="bindProps"
    >
        <ks-option
            v-for="(item, v) in options"
            :label="item[label]"
            :value="item[val]"
            :key="item[val] || v"
            :disabled="item.disabled"
        ></ks-option>
        <slot name="after-option"></slot>
        <template #empty>
            <slot name="empty"></slot>
        </template>
    </ks-select>
</template>

<script lang="ts">
import { Select, Option } from 'element-ui';
import { computed, defineComponent } from '@vue/composition-api';

interface IProps  {
    options: Array<any>;
    label: string;
    val: string;
    value: any;
}
export default defineComponent<IProps>({
    name: 'co-select',
    components: {
        KsSelect: Select,
        KsOption: Option,
    },
    props: {
        options: {
            type: Array,
            default: () => [],
        },
        value: {
            required: true,
        },
        label: {
            type: String,
            default: 'label',
        },
        val: {
            type: String,
            default: 'value',
        },
    },
    setup(props, context) {
        const model = computed({
            get() {
                return props.value;
            },
            set(val) {
                context.emit('input', val);
                if (props.value !== val) {
                    context.emit('change', val);
                }
            },
        });
        const bindProps = computed(() => {
            return {
                ...context.attrs,
            };
        });
        const handleFocus = () => {
            context.emit('focus');
        };
        return {
            bindProps,
            model,
            handleFocus,
        };
    },
});
</script>
<style scoped lang="less">
.co_select {
    display: inline-block;
}
</style>
