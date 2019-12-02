<template>
  <div id="app">
    <date></date>
    <upload></upload>
  </div>
</template>

<script>
import Date from './components/date/index'
import Upload from './components/upload';
export default {
  name: 'app',
  components: {
    Date,
    Upload,
  }
}
</script>

<style>
</style>
