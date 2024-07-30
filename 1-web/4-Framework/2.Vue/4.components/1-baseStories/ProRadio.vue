<template>
    <element-radio-group v-model="model" v-bind="bindProps" :class="radioType === 'switch' ? 'switch-radio' : ''">
        <component :is="comType" v-for="(item, v) in transOptions" :key="getRadioKey(item, v)" :disabled="item.disabled" :label="item[val]">
            <slot name="prepend" :item="item"></slot>
            {{ isK18n ? $k18n(item[label]) : item[label] }}
            <ProTooltip v-if="tooltips[v] || item.tooltip" :content="$k18n(tooltips[v] || item.tooltip)" />
            <slot name="append" :item="item"></slot>
        </component>
    </element-radio-group>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import { RadioGroup, Radio, RadioButton, RadioTag } from 'element';
import { ProTooltip } from '@components/base/index';
import { trans } from './util';
import { getK18n } from '@/components/proUtils/get';

export default defineComponent({
    name: 'ProRadio',
    components: {
        ElementRadioGroup: RadioGroup,
        ElementRadioButton: RadioButton,
        ElementRadioTag: RadioTag,
        ElementRadio: Radio,
        ProTooltip,
    },
    props: {
        isK18n: {
            type: Boolean,
            default: false,
        },
        k18nDesc: {
            type: String,
            default: '',
        },
        radioType: {
            type: String,
            default: '',
        },
        options: {
            type: Array,
            default: () => [],
        },
        modelValue: {
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
        tooltips: {
            type: Array,
            default: () => [],
        },
        transform: {
            type: String,
            default: '',
        },
    },
    emits: ['update:modelValue', 'change'],
    setup(props, ctx) {
        const $k18n = getK18n();
        const comType = computed(() => {
            switch (props.radioType) {
                case 'button':
                    return 'ElementRadioButton';
                case 'tag':
                    return 'ElementRadioTag';
                case 'switch':
                    return 'ElementRadioTag';
                default:
                    return 'ElementRadio';
            }
            // return props.type === 'button' ? 'ElementRadioButton' : 'ElementRadio';
        });

        const model = computed({
            get() {
                if (['tag', 'switch'].includes(props.radioType)) {
                    if (typeof props.modelValue === 'string') {
                        return [props.modelValue];
                    }
                    if (typeof props.modelValue === 'boolean') {
                        return [+props.modelValue];
                    }
                }
                return props.modelValue;
            },
            set(val) {
                let result = val;
                if (props.transform === 'string' && typeof val !== 'string') {
                    result = val.toString();
                }
                if (props.transform === 'boolean' && typeof val !== 'boolean') {
                    result = !!Number(val);
                }
                ctx.emit('update:modelValue', result);
                ctx.emit('change', result);
            },
        });
        const bindProps = computed(() => {
            return {
                ...ctx.attrs,
            };
        });

        const transOptions = ref(trans(props));
        watch(
            () => props.options,
            newVal => {
                transOptions.value = trans(props);
            }
        );

        const getRadioKey = (item: any, index: number) => {
            const val = item[props.val];
            if (typeof val === 'number' || typeof val === 'boolean') {
                return val;
            }
            // 如options为[{value:1},{value: 0}]， 直接返回val || index会导致key都为1
            return val || index;
        };
        return {
            comType,
            model,
            bindProps,
            getRadioKey,
            transOptions,
            $k18n,
        };
    },
});
</script>
<style lang="scss" scoped>
.switch-radio {
    :deep(.element-radio-tag) {
        .element-radio-tag__inner {
            height: 70px;
            width: 208px;
            border-radius: 8px;
            font-weight: 500;
            line-height: 68px;
        }
        &.is-checked {
            .element-radio-tag__inner {
                background: #f7f8fc;
                border: 1px solid #005cff;
                color: #005cff;
            }
        }
    }
}
</style>
