<template>
  <div>
    <b-navbar>
      <b-navbar-brand to="/">Primitives NFT</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/mypage">MyPage</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <nuxt />
    <b-navbar>
      <b-navbar-nav>
        <b-nav-item href="https://github.com/planethouki/nem2-test-dapps-client" target="_blank">GitHub</b-nav-item>
        <b-nav-item to="/debug">Debug</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<style>
</style>
