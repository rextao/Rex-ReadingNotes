<template>
  <div id="app">
    <date></date>
    <upload></upload>
    <download></download>
  </div>
</template>

<script>
import Date from './components/date/index'
import Upload from './components/upload';
import Download from './components/download';
export default {
  name: 'app',
  components: {
    Date,
    Upload,
    Download,
  }
}
</script>

<style>
</style>
