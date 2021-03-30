<template>
    <ks-radio-group
        v-model="model"
        v-bind="bindProps"
    >
        <component
            :is="radioType"
            v-for="(item, v) in options"
            :label="item[val]"
            :key="getRadioKey(item, v)"
        >
            <slot name="prepend" :item="item"></slot>{{item[label]}}<slot name="append" :item="item"></slot>
        </component>
    </ks-radio-group>
</template>

<script lang="ts">

interface IProps {
    value: any;
    options: Array<any>;
    type: string;
    label: string;
    val: string;
}
import { defineComponent, computed } from '@vue/composition-api';
import { RadioGroup, Radio, RadioButton }  from 'element-ui';

export default defineComponent<IProps>({
    name: 'co-radio',
    components: {
        KsRadioGroup: RadioGroup,
        KsRadioButton: RadioButton,
        KsRadio: Radio,
    },
    props: {
        type: {
            type: String,
            default: '',
        },
        options: {
            type: Array,
            default: () => [],
        },
        value: {
            type: [String, Boolean, Number],
            default: '',
        },
        label: {
            type: String,
            default: 'label',
        },
        // 下拉选项的value
        val: {
            type: String,
            default: 'value',
        },
    },
    setup(props, ctx) {
        const radioType = computed(() => {
            return props.type === 'button' ? 'KsRadioButton' : 'KsRadio';
        });

        const model = computed({
            get() {
                return props.value;
            },
            set(val) {
                ctx.emit('input', val);
                ctx.emit('change', val);
            },
        });
        const bindProps = computed(() => {
            return {
                ...ctx.attrs,
            };
        });

        const getRadioKey = (item: any, index: number) => {
            const val = item[props.val];
            if (typeof val === 'number' || typeof val === 'boolean') {
                return val;
            }
            // 如options为[{value:1},{value: 0}]， 直接返回val || index会导致key都为1
            return val || index;
        };
        return {
            radioType,
            model,
            bindProps,
            getRadioKey,
        };
    },
});
</script>
