<template>
    <element-checkbox v-if="isSingleCheckBox" v-model="model" v-bind="$attrs">
        {{ isK18n ? k18n({ desc: k18nDesc, text: content }) : content }}
        <ProTooltip v-if="tooltips?.[0]" :content="k18n(tooltips?.[0])" />
    </element-checkbox>

    <element-checkbox-group v-else v-model="model" v-bind="$attrs">
        <element-checkbox v-for="(item, v) in transOptions" :key="item[val] || v" :label="item[val]" :disabled="item.disabled">
            {{ isK18n ? k18n({ desc: k18nDesc, text: item[label] }) : item[label] }}
            <ProTooltip v-if="tooltips[v] || item.tooltip" :content="k18n(tooltips[v] || item.tooltip)" />
        </element-checkbox>
    </element-checkbox-group>
</template>

<script lang="ts">
import { Checkbox, CheckboxGroup } from 'element';
import { computed, defineComponent } from 'vue';
import ProTooltip from './ProTooltip.vue';
import { getK18n } from '@/components/proUtils/get';

export default defineComponent({
    name: 'ProCheckbox',
    components: {
        ElementCheckboxGroup: CheckboxGroup,
        ElementCheckbox: Checkbox,
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
        modelValue: {
            type: [Array, Boolean],
            default: false,
        },
        tooltips: {
            type: Array,
            default: () => [],
        },
        content: {
            type: String,
        },
    },
    emits: ['update:modelValue', 'change'],
    setup(props, ctx) {
        const k18n = getK18n();
        const isSingleCheckBox = computed(() => Array.isArray(props.options) && !props.options.length);

        const model = computed({
            get() {
                return isSingleCheckBox.value ? props.modelValue || false : props.modelValue || [];
            },
            set(val) {
                ctx.emit('update:modelValue', val);
                ctx.emit('change', val);
            },
        });
        const transOptions = computed(() => {
            const { label, val, options } = props;
            // {ara: '阿拉伯桶',arg: '阿根廷桶',aus: '澳大利亚桶',bgd: '孟加拉国',br: '巴西桶'} 这种
            if (Object.prototype.toString.call(options) === '[object Object]') {
                interface IOptionsArr {
                    label: string;
                    value: any;
                }
                const optionsArr: IOptionsArr[] = [];
                for (const key in options) {
                    optionsArr.push({
                        label: options[key],
                        value: key,
                    });
                }

                return optionsArr;
            }
            return options;
        });

        return {
            model,
            transOptions,
            isSingleCheckBox,
            k18n,
        };
    },
});
</script>
