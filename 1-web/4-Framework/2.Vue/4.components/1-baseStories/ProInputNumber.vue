<template>
    <slot name="prepend">
        <span :class="$attrs.prepend ? 'prefix' : ''">{{
            $attrs.prepend
        }}</span>
    </slot>
    <element-input-number v-model="model" v-bind="$attrs" />
    <slot name="append">
        <span :class="$attrs.append ? 'suffix' : ''">{{ $attrs.append }}</span>
    </slot>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';

export default defineComponent({
    name: 'ProSelect',
    props: {
        modelValue: {
            type: [String, Number],
            default: () => '',
        },
    },
    emits: ['update:modelValue', 'change'],
    setup(props, ctx) {
        const model = computed({
            get() {
                return props.modelValue;
            },
            set(val) {
                ctx.emit('update:modelValue', val);
                ctx.emit('change', val);
            },
        });
        return {
            model,
        };
    },
});
</script>
<style lang="scss" scoped>
.prefix {
    color: #999;
    margin-right: 12px;
}
.suffix {
    color: #999;
    margin-left: 8px;
}
</style>
