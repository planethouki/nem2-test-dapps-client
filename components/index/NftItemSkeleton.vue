<template>
  <div class="d-flex align-items-center py-1">
    <div style="width: 100px; height: 100px;">
      <b-skeleton-img width="100" aspect="1:1"></b-skeleton-img>
    </div>
    <div class="px-1" style="width: calc(100% - 100px);">
      <b-skeleton></b-skeleton>
      <b-skeleton></b-skeleton>
      <b-skeleton></b-skeleton>
    </div>
  </div>
</template>

<script>
export default {
  name: "NftItemSkeleton"
}
</script>

<style scoped>

</style>
