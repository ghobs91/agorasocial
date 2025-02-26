<script lang="ts">
  import {onMount} from "svelte"
  import {fly} from "svelte/transition"
  import {tweened} from "svelte/motion"
  import {numberFmt} from "src/util/misc"
  import {modal} from "src/partials/state"
  import {sampleRelays, getPubkeyWriteRelays} from "src/agent/relays"
  import network from "src/agent/network"
  import pool from "src/agent/pool"

  export let person
  export let followersCountFromNostrBand

  const interpolate = (a, b) => t => a + Math.round((b - a) * t)

  let followersCount = tweened(0, {interpolate, duration: 1000})

  const nostrBandApi = 'https://api.nostr.band/v0/stats/profile/' + person.pubkey
  const alternateNostrBandApi = 'https://api.nostr.band/nostr?method=search&count=1&q=' + person.pubkey

  const nostrbandFollowersCount = async (): Promise <any[]> => {
      const res = await fetch(alternateNostrBandApi, {
                method: "GET"
              })
      const json = await res.json();
      return json.people[0] || json.stats[person.pubkey];
    }

  const showFollows = () => {
    modal.push({type: "person/follows", pubkey: person.pubkey})
  }

  const showFollowers = () => {
    modal.push({type: "person/followers", pubkey: person.pubkey})
  }

  onMount(async () => {
    nostrbandFollowersCount().then((response) => {
      followersCountFromNostrBand = response["followed_count"] || response["followers_pubkey_count"];
      followersCountFromNostrBand = followersCountFromNostrBand.toLocaleString();
    })
    
    // Get our followers count
    const count = await pool.count({kinds: [3], "#p": [person.pubkey]})

    if (count) {
      followersCount.set(count)
    } else {
      const followers = new Set()

      await network.load({
        relays: sampleRelays(getPubkeyWriteRelays(person.pubkey)),
        shouldProcess: false,
        filter: [{kinds: [3], "#p": [person.pubkey]}],
        onChunk: events => {
          for (const e of events) {
            followers.add(e.pubkey)
          }

          followersCount.set(followers.size)
        },
      })
    }
  })
</script>

<div class="flex gap-8" in:fly={{y: 20}}>
  {#if person?.petnames}
    <button on:click={showFollows}>
      <strong>{person.petnames.length.toLocaleString()}</strong> Following
    </button>
  {/if}
  <button on:click={showFollowers}>
    <!-- <strong>{numberFmt.format($followersCount)}</strong> followers -->
    <strong>{followersCountFromNostrBand ? followersCountFromNostrBand: '___'}</strong> Followers
  </button>
</div>
