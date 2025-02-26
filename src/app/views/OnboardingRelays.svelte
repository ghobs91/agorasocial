<script lang="ts">
  import {pluck} from "ramda"
  import {fuzzy} from "src/util/misc"
  import {modal} from "src/partials/state"
  import Input from "src/partials/Input.svelte"
  import Anchor from "src/partials/Anchor.svelte"
  import Heading from "src/partials/Heading.svelte"
  import Content from "src/partials/Content.svelte"
  import RelayCard from "src/app/shared/RelayCard.svelte"
  import {watch} from "src/agent/db"
  import user from "src/agent/user"

  const {relays} = user

  export let signupRelays

  let q = ""
  let search

  const knownRelays = watch("relays", t => t.all())
  const skip = () => signupRelays()

  $: joined = new Set(pluck("url", $relays))
  $: search = fuzzy(
    $knownRelays.filter(r => !joined.has(r.url)),
    {keys: ["name", "description", "url"]}
  )
</script>

<Content>
  <div class="text-center">
    <Heading>Get Connected</Heading>
    <p>
      Nostr is a protocol, not a platform. This means that <i>you</i> choose where to store your data.
      Select your preferred storage relays below, or click "continue" to use some pre-selected defaults.
      You can change your selection any time.
    </p>
  </div>
  <Anchor
    type="button-accent"
    class="text-center"
    on:click={skip}>
    Continue
  </Anchor>
  <div class="flex items-center gap-2">
    <i class="fa fa-server fa-lg" />
    <h2 class="roboto text-2xl">Your relays</h2>
  </div>
  {#if $relays.length === 0}
    <div class="mt-8 flex items-center justify-center gap-2 text-center">
      <i class="fa fa-triangle-exclamation" />
      <span>No relays connected</span>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-4">
      {#each $relays as relay (relay.url)}
        <RelayCard {relay} />
      {/each}
    </div>
  {/if}
  <div class="flex items-center gap-2">
    <i class="fa fa-earth-asia fa-lg" />
    <h2 class="roboto text-2xl">Other relays</h2>
  </div>
  <Input bind:value={q} type="text" wrapperClass="flex-grow" placeholder="Type to search">
    <i slot="before" class="fa-solid fa-search" />
  </Input>
  {#each (search(q) || []).slice(0, 50) as relay (relay.url)}
    <RelayCard {relay} />
  {/each}
  <small class="text-center">
    Showing {Math.min($knownRelays.length - $relays.length, 50)}
    of {$knownRelays.length - $relays.length} known relays
  </small>
</Content>
