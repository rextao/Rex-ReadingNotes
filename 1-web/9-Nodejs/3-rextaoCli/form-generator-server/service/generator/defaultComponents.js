const defaultComponents = {
    input: {
        render(data, wrapper = 'formItem') {
            const base = `
                <ks-el-input
                    v-model="searchForm.${data.output}"
                    placeholder="请输入${data.label}"
                    clearable
                ></ks-el-input>
            `;
            if (wrapper === 'formItem') {
                return defaultComponents.formItem.render(base, data);
            }
            return base;
        }
    },
    select: {
        render(data, wrapper = 'formItem') {
            const base = `
                <select-api
                    v-model="searchForm.${data.output}"
                    :options="${data.output}Options"
                    :props="{
                        clearable: true,
                        placeholder: '选择${data.label}'
                    }"
                >
                </select-api>
            `;
            if (wrapper === 'formItem') {
                return defaultComponents.formItem.render(base, data);
            }
            return base;
        },
        components: 'SelectApi'
    },
    formItem: {
        render(template, data) {
            return `<ks-el-form-item label="${data.label}：">${template}</ks-el-form-item>`
        }
    }
};
module.exports = defaultComponents;
