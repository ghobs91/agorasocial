<script lang="ts">
  import Feed from "src/app/shared/Feed.svelte"
  import {isLike} from "src/util/nostr"
  import {timedelta} from "src/util/misc"

  export let pubkey
  export let relays
  let includesReposts

  const filter = {kinds: [7], authors: [pubkey]}
  const shouldDisplay = e => isLike(e.content)
</script>

<Feed {relays} {filter} {shouldDisplay} parentsTimeout={10_000} delta={timedelta(1, "days")} {includesReposts}/>
