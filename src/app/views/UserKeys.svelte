<script>
  import {onMount} from "svelte"
  import {fly} from "svelte/transition"
  import {navigate} from "svelte-routing"
  import {nip19} from "nostr-tools"
  import {copyToClipboard} from "src/util/html"
  import Input from "src/partials/Input.svelte"
  import Anchor from "src/partials/Anchor.svelte"
  import Content from "src/partials/Content.svelte"
  import Toggle from "src/partials/Toggle.svelte"
  import Heading from "src/partials/Heading.svelte"
  import keys from "src/agent/keys"
  import {toast} from "src/partials/state"

  const {pubkey, privkey} = keys
  const nip07 = "https://github.com/nostr-protocol/nips/blob/master/07.md"
  const keypairUrl = "https://www.cloudflare.com/learning/ssl/how-does-public-key-encryption-work/"

  let asHex = false

  $: pubkeyDisplay = asHex ? $pubkey : nip19.npubEncode($pubkey)
  $: privkeyDisplay = asHex || !$privkey ? $privkey : nip19.nsecEncode($privkey)

  const copyKey = (type, value) => {
    copyToClipboard(value)
    toast.show("info", `Your ${type} key has been copied to the clipboard.`)
  }

  onMount(async () => {
    if (!$pubkey) {
      return navigate("/login")
    }
  })

  document.title = "Keys"
</script>

<div in:fly={{y: 20}}>
  <Content>
    <div class="flex flex-col items-center justify-center">
      <Heading>My Account</Heading>
      <p>
        Your account is identified across the network using a public/private <Anchor
          href={keypairUrl}
          external>keypair</Anchor
        >. This allows you to fully own your account, and move to another app if needed.
      </p>
    </div>
    <div class="flex w-full flex-col gap-8">
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <strong>Show keys in hex format</strong>
          <Toggle bind:value={asHex} />
        </div>
        <p class="text-sm text-gray-1">
          Under the hood, Nostr uses a different encoding to represent keys.
        </p>
      </div>
      <div class="flex flex-col gap-1">
        <strong>Public Key</strong>
        <Input disabled value={pubkeyDisplay}>
          <button
            slot="after"
            class="fa-solid fa-copy cursor-pointer"
            on:click={() => copyKey("public", pubkeyDisplay)} />
        </Input>
        <p class="text-sm text-gray-1">
          Your public key identifies your account. You can share this with people trying to find you
          on nostr.
        </p>
      </div>
      {#if $privkey}
        <div class="flex flex-col gap-1">
          <strong>Private Key</strong>
          <Input disabled type="password" value={privkeyDisplay}>
            <button
              slot="after"
              class="fa-solid fa-copy cursor-pointer"
              on:click={() => copyKey("private", privkeyDisplay)} />
          </Input>
          <p class="text-sm text-gray-1">
            Your private key is used to prove your identity by cryptographically signing messages. <strong
              >Do not share this with anyone.</strong>
            Be careful about copying this into other apps - instead, consider using a <Anchor
              href={nip07}
              external>compatible browser extension</Anchor> to securely store your key.
          </p>
        </div>
      {/if}
    </div>
  </Content>
</div>
