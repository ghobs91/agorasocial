<script lang="ts">
  import {Tags, displayRelay} from "src/util/nostr"
  import Content from "src/partials/Content.svelte"
  import Feed from "src/app/shared/Feed.svelte"
  import RelayTitle from "src/app/shared/RelayTitle.svelte"
  import RelayActions from "src/app/shared/RelayActions.svelte"
  import {relays} from "src/agent/db"
  import Spinner from "src/partials/Spinner.svelte"
  import Card from "src/partials/Card.svelte"
  import ImageCircle from "src/partials/ImageCircle.svelte"
  import Anchor from "src/partials/Anchor.svelte"
  import {formatTimestamp} from "src/util/misc"
  import Media from "src/partials/Media.svelte"
  import {pluck, find} from "ramda"
  import user from "src/agent/user"

  export let url = 'wss://feeds.nostr.band/popular'
  export let size = 6
  export let mutedWordsArray = []

  let mutedWordsList;
  mutedWordsList = find(e => e.id !== mutedWordsList?.id && Tags.from(e).getMeta("d") === "agora_muted_words", user.getLists());

  mutedWordsList.tags.forEach(element => {
    if (element[0] === "t") {
      mutedWordsArray.push(element[1])
    }
  });

  const relay = relays.get(url) || {url}

  const mastodonFediTrendsAPI = 'https://mastodon.social/api/v1/trends/statuses'

  document.title = 'Popular Posts'

  const popularMastodon = async (): Promise <any[]> => {
    const res = await fetch(`${mastodonFediTrendsAPI}`, {method: "get"})
    const json = await res.json()
    const filteredJson = filterOutMutedWords(json);
    return filteredJson
  }

  const getRsslayMastoProfile = async (mastoLink) => {
    const mastoLinkArray = mastoLink.split("/@")
    const mostrPubFormattedHandle = mastoLinkArray[1] + '_at_' + mastoLinkArray[0].replace('https://', '');
    const res = await fetch(`https://mostr.pub/.well-known/nostr.json?name=${mostrPubFormattedHandle}`, {method: "get"});
    const mostrResponse = await res.json();
    if (!mostrResponse.error) {
      const pubKey = mostrResponse.names[`${mostrPubFormattedHandle}`];
      window.location.href = `/people/${pubKey}/notes`
    } else {
      const res = await fetch(`https://rsslay.onrender.com/api/feed?url=${mastoLink}.rss`, {method: "get"});
      const rsslayResponse = await res.json();
      const pubKey = rsslayResponse.NPubKey;
      console.log(`pubkey: ${pubKey}`)
      window.location.href = `/people/${pubKey}/notes`
    }
  }

  const filterOutMutedWords = async (json): Promise <any[]> => {
    json.forEach((post) => {
        mastoArray.push(post)
    })

    // mastoArray = mastoArray.filter(post => !mutedWordsArray.some(mutedWord => post.content.toLowerCase().includes(mutedWord.toLowerCase())));

    mastoArray.forEach((post, index) => {
      if (mutedWordsArray.some(mutedWord => post.content.toLowerCase().includes(mutedWord.toLowerCase()))) {
        console.log(`this post has a muted word: ${post.content.toLowerCase()}`);
        mastoArray = mastoArray.splice(index, 1);
      }
    })

    return json;
  }

  export let mastoArray = []

  $: popularMastodon().then((daArray) => {
    daArray.forEach((post) => {
        mastoArray.push(post)
    })

    // mastoArray = mastoArray.filter(post => !mutedWordsArray.some(mutedWord => post.content.toLowerCase().includes(mutedWord.toLowerCase())));

    mastoArray.forEach((post, index) => {
      if (mutedWordsArray.some(mutedWord => post.content.toLowerCase().includes(mutedWord.toLowerCase()))) {
        console.log(`this post has a muted word: ${post.content.toLowerCase()}`);
        mastoArray = mastoArray.splice(index, 1);
      }
    })

    // mastoArray.push(daArray);
  })

</script>

<!-- <Content>
  <Feed relays={[relay]} filter={{kinds: [1]}} />
</Content> -->

<div class="border-b border-solid border-gray-6" />

<Content>
  {#await popularMastodon()}
  <Spinner />
  {:then resultArray }
      {#each resultArray as mastoPost}
        <Card class="discover-card" on:click={() => getRsslayMastoProfile(mastoPost.account.url)}>
          <div class="topic-post-buttons">
            <button class="note-buttons text-left">
                <i class="fa fa-reply cursor-pointer"/>
                {mastoPost.replies_count}
            </button>
            <button class="note-buttons text-left">
                <i class="fa fa-heart cursor-pointer"/>
                {mastoPost.favourites_count}
            </button>
          </div>
          <div class="topic-post-main-section">
            <div class="flex justify-between">
            </div>
            <div class="topic-post-content">
              {mastoPost.content.replace( /(<([^>]+)>)/ig, '').replaceAll('&#39;', '').replaceAll('&quot;', '"').replaceAll('&amp;', '&')}
            </div>
            {#if mastoPost.media_attachments.length > 0}
              {#if mastoPost.media_attachments[0].url}
                <Media link={mastoPost.media_attachments[0]} onClose={close} />
              {/if}
            {/if}
            <div class="topic-post-info">
              <div class="flex">
                <Anchor class="text-lg font-bold" href={mastoPost.account.url}>
                <ImageCircle {size} src={mastoPost.account.avatar} />
                </Anchor>
                <div class="discover-card-name-header">{mastoPost.account.display_name}</div>
              </div>
              <div>{mastoPost.created_at.replace("T", " ").substring(0, 16)}</div>
            </div>
          </div>
        </Card>
      {/each}
  {:catch}
    <p class="mb-1 py-24 px-12 text-center text-gray-5">
      Unable to load feditrends
    </p>
  {/await}
</Content>