<template>
  <div class="d-flex align-items-center py-1">
    <div
      class="rounded d-flex align-items-center justify-content-center"
      style="width: 100px; height: 100px; background-color: rgba(0, 0, 0, 0.12);">
      <span style="color: white;">NO ITEM</span>
    </div>
    <div class="px-1" style="width: calc(100% - 100px);">
      <div
        class="rounded"
        style="height: 1rem; background-color: rgba(0, 0, 0, 0.12);"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NftItemEmpty"
}
</script>

<style scoped>

</style>
