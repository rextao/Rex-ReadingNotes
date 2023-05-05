<template>
    <ks-checkbox-group
        v-model="model"
        v-bind="$attrs"
    >
        <ks-checkbox
            v-for="(item, v) in options"
            :label="item[val]"
            :key="item[val] || v"
            :disabled="item.disabled"
        >
            {{item[label]}}
        </ks-checkbox>
    </ks-checkbox-group>
</template>

<script lang="ts">
import { Checkbox, CheckboxGroup } from 'element-ui';
import { computed, defineComponent } from '@vue/composition-api';

interface IProps {
    options: Array<any>;
    val: string;
    value: any;
    label: string;
}
export default defineComponent<IProps>({
    name: 'co-checkbox',
    components: {
        KsCheckboxGroup: CheckboxGroup,
        KsCheckbox: Checkbox,
    },
    props: {
        options: {
            type: Array,
            default: () => [],
        },
        label: {
            type: String,
            default: 'label',
        },
        val: {
            type: String,
            default: 'value',
        },
        value: {
            type: [String, Array],
            default: '',
        },
    },
    setup(props, ctx) {
        const model = computed({
            get() {
                console.log(props.value);
                return props.value;
            },
            set(val) {
                ctx.emit('input', val);
                ctx.emit('change', val);
            },
        });
        return {
            model,
        };
    },
});
</script>
