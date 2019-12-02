<template>
    <div>
        <h1>date-picker-limit</h1>
        <h2>限制14天</h2>
        <date-picker-limit :pickTimeNum="14"></date-picker-limit>
        <h2>只能从今天开始选</h2>
        <date-picker-limit :pickStartTime="new Date().getTime()"></date-picker-limit>
        <p>通过v-model="searchForm.time"绑定值</p>
    </div>
</template>

<script>
import DatePickerLimit from './date-picker-limit';
export default {
    name: "index",
    components: {
        DatePickerLimit,
    }
}
</script>

<style scoped>

</style>