<template>
  <div class="container">
    <h1>{{ $t('docs.title') }}</h1>
    <h3>{{ $t('docs.gs.title') }}</h3>
    <h5>Download Wallet</h5>
    <ol>
      <li>
        <span>Go </span>
        <a href="https://github.com/planethouki/nem2-test-dapps-wallet" target="_blank">
          https://github.com/planethouki/nem2-test-dapps-wallet
        </a>
      </li>
      <li>Click Releases</li>
      <li>Find latest tag/release</li>
      <li>Download dist.zip</li>
      <li>Unzip it</li>
    </ol>
    <h5>Install Wallet</h5>
    <ol>
      <li>Google Chromeを開きます</li>
      <li>URL欄にchrome://extensions/と入力します</li>
      <li>デベロッパーモードを有効にします</li>
      <li>パッケージ化されていない拡張機能を読み込む、をクリックします</li>
      <li>先の項目で解凍したフォルダを選択します</li>
      <li>Symbol dApps Wallet Alphaという拡張機能が現れます</li>
    </ol>
    <h5>Buy NFT</h5>
    <ol>
      <li>
        <nuxt-link :to="localePath('/')">トップ</nuxt-link>へ行きます
      </li>
      <li>下へスクロールし、「Buy NFT」の箇所へ行きます</li>
      <li>Buyボタンをクリックします</li>
      <li>ウォレットのポップアップが出現します</li>
      <li>パスワードの入力を要求されれば、パスワードを入力します</li>
      <li>購入確認の画面になるので、問題なければ進みます</li>
      <li>トランザクションが送信されます。承認されるまで待ちます。</li>
      <li>
        <nuxt-link :to="localePath('/mypage')">マイページ</nuxt-link>
        <span>へ行って、保有できているか確認します</span>
      </li>
      <li>他の人が同時に購入トランザクションを送信していれば、承認が早い方が優先されます</li>
    </ol>
    <h3>NFTの仕様</h3>
    <ul>
      <li>１つのトークンは、発行数１のモザイクです</li>
      <li>
        モザイクには、以下の条件のメタデータが付いている必要があります
        <ul>
          <li>キーはAB66A77390046840</li>
          <li>対象アドレスはTCZ5KXKSAJA74A5ECZCXMHOHKFVQ36YSONW4RSA</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: "Docs"
}
</script>

<style scoped>

</style>
