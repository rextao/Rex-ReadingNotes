<template>
    <ks-cascader
        class="co_cascader"
        ref="cascaderRef"
        v-model="model"
        v-bind="$attrs"
    >
        <template #default="{ node, data }">
            <slot :node="node" :data="data"></slot>
        </template>
    </ks-cascader>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, toRefs, ref } from '@vue/composition-api';
import { Cascader } from 'element-ui';

interface IState {
    hotVideoPopper: Element | null;
}
interface ICoProps {
    value?: any;
}

export default defineComponent<ICoProps>({
    name: 'co-cascader',
    components: {
        KsCascader: Cascader,
    },
    props: {
        value: {
            type: [String, Array, Number, Boolean],
            default: '',
        },
    },
    setup(props, ctx) {
        const cascaderRef = ref(null);
        const state = reactive<IState>({
            hotVideoPopper: null,
        });
        const model = computed({
            get() {
                return props.value;
            },
            set(val) {
                ctx.emit('input', val);
            },
        });
        const bindProps = computed(() => {
            return {
                'collapse-tags': true,
                'popper-class': 'co_cascader_popper',
                ...ctx.attrs,
            };
        });

        function handleChange(val: any) {
            ctx.emit('change', val);
        }
        function handleFocus() {
            ctx.emit('focus');
        }

        return {
            ...toRefs(state),
            handleChange,
            cascaderRef,
            bindProps,
            model,
        };
    },
});
</script>
